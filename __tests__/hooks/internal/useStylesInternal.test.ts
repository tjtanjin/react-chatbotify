import { renderHook, act } from "@testing-library/react";
import { expect } from "@jest/globals";

import { useStylesInternal } from "../../../src/hooks/internal/useStylesInternal";
import { useStylesContext } from "../../../src/context/StylesContext";
import { parseConfig } from "../../../src/utils/configParser";

// Mock the necessary context and service
jest.mock("../../../src/context/StylesContext");
jest.mock("../../../src/utils/configParser", () => ({
    deepClone: jest.fn(),
    getCombinedConfig: jest.fn(),
}));

/**
 * Test for useStylesInternal hook.
 */
describe("useStylesInternal Hook", () => {
    const setStylesMock = jest.fn();
    const stylesMock = {
        bodyStyle: {}
    }

    beforeEach(() => {
        jest.clearAllMocks();
        (useStylesContext as jest.Mock).mockReturnValue({ styles: stylesMock, setStyles: setStylesMock});
    })

    // Test to ensure initial values (styels and setStyles) are returned correctly from the hook
    it("should return initial values from context", () => {
        const { result } = renderHook(() => useStylesInternal());

        expect(result.current.styles).toEqual(stylesMock);
        expect(result.current.replaceStyles).toEqual(expect.any(Function));
        expect(result.current.updateStyles).toEqual(expect.any(Function));
    });

    it("should call setStyles from context, when styles are updated", () => {
        const { result } = renderHook(() => useStylesInternal());
        const styles = { tooltipStyle: {} };

        act(() => {
			result.current.updateStyles(styles);
		});
        // Argument passed to setStyles is not checked, because it is transformed with 
        // deepClone() and getCombinedConfig()
        expect(setStylesMock).toHaveBeenCalled();
    });

    it("should call setStyles from context with correct value, when styles are replaced", () => {
        const { result } = renderHook(() => useStylesInternal());
        const styles = { notificationBadgeStyle: {} };

        act(() => {
			result.current.replaceStyles(styles);
		});

        expect(setStylesMock).toHaveBeenCalledWith(styles);
    });
});