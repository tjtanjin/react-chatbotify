// EmojiButton.test.tsx

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EmojiButton from "./EmojiButton";
import { useSettingsContext } from "../../../context/SettingsContext";
import { useStylesContext } from "../../../context/StylesContext";
import { useBotRefsContext } from "../../../context/BotRefsContext";
import { useTextAreaInternal } from "../../../hooks/internal/useTextAreaInternal";

// Mocking the required contexts and hooks
jest.mock("../../../context/SettingsContext");
jest.mock("../../../context/StylesContext");
jest.mock("../../../context/BotRefsContext");
jest.mock("../../../hooks/internal/useTextAreaInternal");

const mockSetTextAreaValue = jest.fn();
const mockInputRef = { current: { value: "" } };

beforeEach(() => {
    (useSettingsContext as jest.Mock).mockReturnValue({
        settings: {
            general: { actionDisabledIcon: "" },
            emoji: { icon: "", list: ["😀", "😁", "😂", "🤣"] },
            ariaLabel: { emojiButton: "emoji button" },
        },
    });

    (useStylesContext as jest.Mock).mockReturnValue({
        styles: {
            emojiButtonStyle: {},
            emojiButtonDisabledStyle: {},
            emojiIconStyle: {},
            emojiIconDisabledStyle: {},
        },
    });

    (useBotRefsContext as jest.Mock).mockReturnValue({
        inputRef: mockInputRef,
    });

    (useTextAreaInternal as jest.Mock).mockReturnValue({
        textAreaDisabled: false,
        setTextAreaValue: mockSetTextAreaValue,
    });
});

test("renders EmojiButton and shows popup on click", () => {
    render(<EmojiButton />);

    // Check if the emoji button is rendered
    const emojiButton = screen.getByRole("button", { name: /emoji button/i });
    expect(emojiButton).toBeInTheDocument();

    // Click to open emoji popup
    fireEvent.mouseDown(emojiButton);
    
    // Check if the emoji popup is displayed
    const emojiPopup = screen.getByText("😀").closest("div");
    expect(emojiPopup).toBeInTheDocument();
});

test("selects an emoji and updates textarea", () => {
    render(<EmojiButton />);

    // Open the emoji popup
    fireEvent.mouseDown(screen.getByRole("button", { name: /emoji button/i }));

    // Select the first emoji
    fireEvent.mouseDown(screen.getByText("😀"));

    // Check if setTextAreaValue was called with the selected emoji
    expect(mockSetTextAreaValue).toHaveBeenCalledWith("😀");
});

test("hides popup when clicking outside", () => {
    render(<EmojiButton />);

    // Open the emoji popup
    fireEvent.mouseDown(screen.getByRole("button", { name: /emoji button/i }));
    expect(screen.getByText("😀")).toBeInTheDocument();

    // Click outside the popup
    fireEvent.mouseDown(document);

    // Verify if the popup is no longer displayed
    expect(screen.queryByText("😀")).not.toBeInTheDocument();
});

test("does not show popup if textarea is disabled", () => {
    (useTextAreaInternal as jest.Mock).mockReturnValue({
        textAreaDisabled: true,
        setTextAreaValue: mockSetTextAreaValue,
    });

    render(<EmojiButton />);

    const emojiButton = screen.getByRole("button", { name: /emoji button/i });
    // Click to open emoji popup
    fireEvent.mouseDown(emojiButton);
    
    // Check if the emoji popup is NOT displayed
    expect(screen.queryByText("😀")).not.toBeInTheDocument();
});
