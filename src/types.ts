export type SafeSearchLevel = "off" | "moderate" | "strict";
export type DfLevel = "day" | "week" | "month" | "year";
export type OutputFormat = "markdown" | "json";

export interface SearchConfig {
    query: string;
    maxResults: number;
    region: string | null;
    safeSearch: SafeSearchLevel;
    df: DfLevel | null;
    timeFrom: string | null;
    timeTo: string | null;
}

export interface SearchResult {
    title: string;
    url: string;
    snippet: string;
}

export interface SearchResponse {
    results: SearchResult[];
    hasMore: boolean;
}
