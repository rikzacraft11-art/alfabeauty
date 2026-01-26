import { describe, it, expect, vi, afterEach } from 'vitest';
import { logger } from '@/lib/logger';

describe('Structured Logger', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should output valid JSON', () => {
        const consoleSpy = vi.spyOn(console, 'log');
        logger.info("Test Message");

        expect(consoleSpy).toHaveBeenCalled();
        const output = String(consoleSpy.mock.calls[0]?.[0]);
        const json = JSON.parse(output);

        expect(json.level).toBe("info");
        expect(json.message).toBe("Test Message");
        expect(json.timestamp).toBeDefined();
    });

    it('should handle context objects', () => {
        const consoleSpy = vi.spyOn(console, 'log');
        logger.warn("Warning", { user_id: 123 });

        const json = JSON.parse(String(consoleSpy.mock.calls[0]?.[0]));
        expect(json.context.user_id).toBe(123);
    });
});
