import { renderHook } from '@testing-library/react';

import { useSettingsContext } from "../../../src/context/SettingsContext";
import { useIsDesktopInternal} from "../../../src/hooks/internal/useIsDesktopInternal";

const originalNavigator = window.navigator;
const originalInnerWidth = window.innerWidth;

// Mock the contexts
jest.mock("../../../src/context/SettingsContext");

const mockWindowProperty = (property: string, value: any) => {
    Object.defineProperty(window, property, {
        configurable: true,
        writable: true,
        value,
    });
};

describe('useIsDesktopInternal', () => {
    beforeEach(() => {
		// default mock values
		(useSettingsContext as jest.Mock).mockReturnValue({
			settings: { device: { applyMobileOptimizations: true } },
		});
	});

    afterEach(() => {
        Object.defineProperty(window, 'navigator', {
            configurable: true,
            writable: true,
            value: originalNavigator,
        });
        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: originalInnerWidth,
        });
    });

    it('should return false when running on server-side (no window object)', () => {
        mockWindowProperty('navigator', undefined);
        mockWindowProperty('innerWidth', 0);

        const { result } = renderHook(() => useIsDesktopInternal());
        expect(result.current).toBe(false);
    });

    it('should return false for a mobile user agent', () => {
        mockWindowProperty('navigator', {
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15A372 Safari/604.1',
        });
        mockWindowProperty('innerWidth', 800);

        const { result } = renderHook(() => useIsDesktopInternal());
        expect(result.current).toBe(false);
    });

    it('should return true for a desktop user agent and wide screen', () => {
        mockWindowProperty('navigator', {
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        });
        mockWindowProperty('innerWidth', 1024);

        const { result } = renderHook(() => useIsDesktopInternal());
        expect(result.current).toBe(true);
    });

    it('should return false for a narrow screen, even on a desktop user agent', () => {
        mockWindowProperty('navigator', {
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        });
        mockWindowProperty('innerWidth', 500);

        const { result } = renderHook(() => useIsDesktopInternal());
        expect(result.current).toBe(false);
    });

    it('should return true if user agent is not mobile and window width is exactly 768', () => {
        mockWindowProperty('navigator', {
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        });
        mockWindowProperty('innerWidth', 768);

        const { result } = renderHook(() => useIsDesktopInternal());
        expect(result.current).toBe(true);
    });

    it('should return true if mobile optimizations are not applied even if user is on mobile', () => {
        (useSettingsContext as jest.Mock).mockReturnValue({
			settings: { device: { applyMobileOptimizations: false } },
		});

        mockWindowProperty('navigator', {
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        });
        mockWindowProperty('innerWidth', 500);

        const { result } = renderHook(() => useIsDesktopInternal());
        expect(result.current).toBe(true);
    });
});
