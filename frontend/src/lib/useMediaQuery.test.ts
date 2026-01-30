
import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useMediaQuery } from "./useMediaQuery";

describe("useMediaQuery", () => {
    let matchMediaMock: any;
    let listeners: Record<string, Function> = {};

    beforeEach(() => {
        listeners = {};
        matchMediaMock = vi.fn().mockImplementation((query) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vi.fn(), // Deprecated
            removeListener: vi.fn(), // Deprecated
            addEventListener: vi.fn((event, _callback) => {
                listeners[event] = _callback;
            }),
            removeEventListener: vi.fn((event, callback) => {
                delete listeners[event];
            }),
            dispatchEvent: vi.fn(),
        }));
        window.matchMedia = matchMediaMock;
    });

    it("should return false initially if no match", () => {
        const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));
        expect(result.current).toBe(false);
    });

    it("should return true if query matches", () => {
        matchMediaMock.mockImplementation((query: string) => ({
            matches: true,
            media: query,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        }));

        const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));
        expect(result.current).toBe(true);
    });
});
