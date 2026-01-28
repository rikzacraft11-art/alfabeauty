import { describe, it, expect } from "vitest";
import {
    calculateReadTime,
    listEvents,
    listArticles,
    getEventBySlug,
    getArticleBySlug
} from "./education";

describe("Education Utils", () => {
    describe("calculateReadTime", () => {
        it("should calculate correctly for empty content", () => {
            expect(calculateReadTime([])).toBe(0);
        });

        it("should calculate correctly for short text (under 200 words)", () => {
            const text = new Array(100).fill("word").join(" ");
            expect(calculateReadTime([text])).toBe(1); // 100/200 = 0.5 -> ceil(1)
        });

        it("should calculate correctly for exactly 200 words", () => {
            const text = new Array(200).fill("word").join(" ");
            expect(calculateReadTime([text])).toBe(1);
        });

        it("should calculate correctly for long text (400 words)", () => {
            const text = new Array(401).fill("word").join(" ");
            expect(calculateReadTime([text])).toBe(3); // 401/200 = 2.005 -> ceil(3)
        });

        it("should handle multiple array items", () => {
            const part1 = new Array(100).fill("word").join(" ");
            const part2 = new Array(100).fill("word").join(" ");
            expect(calculateReadTime([part1, part2])).toBe(1);
        });
    });

    describe("listEvents", () => {
        it("should return events for 'en' locale", () => {
            const events = listEvents("en");
            expect(Array.isArray(events)).toBe(true);
            if (events.length > 0) {
                expect(events[0]).toHaveProperty("slug");
                expect(events[0]).toHaveProperty("title");
            }
        });

        it("should return events for 'id' locale", () => {
            const events = listEvents("id");
            expect(Array.isArray(events)).toBe(true);
            if (events.length > 0) {
                expect(events[0]).toHaveProperty("slug");
            }
        });
    });

    describe("listArticles", () => {
        it("should return articles for 'en' locale", () => {
            const articles = listArticles("en");
            expect(Array.isArray(articles)).toBe(true);
            if (articles.length > 0) {
                expect(articles[0]).toHaveProperty("slug");
                expect(articles[0]).toHaveProperty("body");
            }
        });
    });

    describe("getEventBySlug", () => {
        it("should return null for non-existent slug", () => {
            expect(getEventBySlug("en", "non-existent-slug-123")).toBeNull();
        });

        it("should return event for valid slug if exists", () => {
            // We assume at least one event exists or we mock it.
            // For now, let's grab the first one dynamically if available
            const events = listEvents("en");
            if (events.length > 0) {
                const slug = events[0]!.slug;
                const event = getEventBySlug("en", slug);
                expect(event).toBeDefined();
                expect(event!.slug).toBe(slug);
            }
        });
    });

    describe("getArticleBySlug", () => {
        it("should return null for non-existent slug", () => {
            expect(getArticleBySlug("en", "non-existent-slug-XYZ")).toBeNull();
        });

        it("should return article with readTime for valid slug", () => {
            const articles = listArticles("en");
            if (articles.length > 0) {
                const slug = articles[0]!.slug;
                const article = getArticleBySlug("en", slug);
                expect(article).toBeDefined();
                expect(article!.readTime).toBeGreaterThanOrEqual(0);
                expect(article!.slug).toBe(slug);
            }
        });
    });
});
