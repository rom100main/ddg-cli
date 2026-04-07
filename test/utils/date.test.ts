import { describe, expect, test } from "@jest/globals";

import { isValidDate, parseDate } from "../../src/utils/date.js";

describe("isValidDate", () => {
    test("accepts valid YYYY-MM-DD format", () => {
        expect(isValidDate("2024-01-15")).toBe(true);
        expect(isValidDate("2024-12-31")).toBe(true);
        expect(isValidDate("2000-06-01")).toBe(true);
    });

    test("rejects invalid formats", () => {
        expect(isValidDate("01/15/2024")).toBe(false);
        expect(isValidDate("2024/01/15")).toBe(false);
        expect(isValidDate("2024-1-15")).toBe(false);
        expect(isValidDate("20240115")).toBe(false);
        expect(isValidDate("not-a-date")).toBe(false);
        expect(isValidDate("")).toBe(false);
    });

    test("rejects impossible dates", () => {
        expect(isValidDate("2024-02-30")).toBe(false);
        expect(isValidDate("2024-13-01")).toBe(false);
        expect(isValidDate("2024-00-01")).toBe(false);
    });
});

describe("parseDate", () => {
    test("parses valid date string", () => {
        const date = parseDate("2024-01-15");
        expect(date.getFullYear()).toBe(2024);
        expect(date.getMonth()).toBe(0);
        expect(date.getDate()).toBe(15);
    });
});
