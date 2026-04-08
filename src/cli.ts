import { Command } from "commander";

import { DEFAULT_DF, DEFAULT_MAX_RESULTS, DEFAULT_SAFE_SEARCH } from "./config.js";
import { formatResultsJson } from "./output/json.js";
import { formatResultsMarkdown } from "./output/markdown.js";
import { search } from "./search/api.js";
import type { DfLevel, SafeSearchLevel, SearchConfig } from "./types.js";

interface CliOptions {
    maxResults?: string;
    region?: string;
    df?: string;
    safeSearch?: string;
    json?: boolean;
}

const SAFE_SEARCH_LEVELS: SafeSearchLevel[] = ["off", "moderate", "strict"];
const DF_LEVELS: DfLevel[] = ["day", "week", "month", "year"];

export function createCli(): Command {
    const program = new Command();

    program
        .name("ddg")
        .description("DuckDuckGo CLI tool")
        .argument("[query]", "Search query")
        .option("--max-results <n>", "Maximum results to return")
        .option("--region <code>", "Region code (e.g., us-en)")
        .option("--df <level>", "Date filter (day, week, month, year)")
        .option("--safe-search <level>", "Safe search (off, moderate, strict)")
        .option("--json", "Output as JSON")
        .action(handleCommand);

    return program;
}

async function handleCommand(query: string | undefined, options: CliOptions): Promise<void> {
    if (!query) {
        console.error("Error: Missing search query");
        process.exit(1);
    }

    const config = await buildConfig(query, options);
    const response = await search(config);

    if (options.json) {
        console.log(formatResultsJson(response.results));
    } else {
        console.log(formatResultsMarkdown(response.results));
    }
}

async function buildConfig(query: string, options: CliOptions): Promise<SearchConfig> {
    let maxResults = DEFAULT_MAX_RESULTS;
    if (options.maxResults) {
        const parsed = parseInt(options.maxResults, 10);
        if (isNaN(parsed) || parsed < 1) {
            console.error("Invalid max-results value, using default (5)");
        } else {
            maxResults = parsed;
        }
    }

    let region = options.region || null;

    let df: DfLevel | null = DEFAULT_DF;
    if (options.df) {
        const lower = options.df.toLowerCase();
        if (DF_LEVELS.includes(lower as DfLevel)) {
            df = lower as DfLevel;
        } else {
            console.error(`Invalid df value: ${options.df}. Using default (any time)`);
        }
    }

    let safeSearch: SafeSearchLevel = DEFAULT_SAFE_SEARCH;
    if (options.safeSearch) {
        const lower = options.safeSearch.toLowerCase();
        if (SAFE_SEARCH_LEVELS.includes(lower as SafeSearchLevel)) {
            safeSearch = lower as SafeSearchLevel;
        } else {
            console.error(`Invalid safe-search value: ${options.safeSearch}. Using default (off)`);
        }
    }

    return {
        query,
        maxResults,
        region,
        safeSearch,
        df,
    };
}
