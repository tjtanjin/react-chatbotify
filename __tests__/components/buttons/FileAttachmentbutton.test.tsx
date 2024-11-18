import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import FileAttachmentButton from "../../../src/components/Buttons/FileAttachmentButton/FileAttachmentButton";
import { TestChatBotProvider } from "../../__mocks__/TestChatBotContext";
import { useMessagesInternal } from "../../../src/hooks/internal/useMessagesInternal";
import { useSubmitInputInternal } from "../../../src/hooks/internal/useSubmitInputInternal";
import { usePathsInternal } from "../../../src/hooks/internal/usePathsInternal";
import { getMediaFileDetails } from "../../../src/utils/mediaFileParser";
import { useBotRefsContext } from "../../../src/context/BotRefsContext";

jest.mock("../../../src/hooks/internal/useMessagesInternal", () => ({
	useMessagesInternal: jest.fn(),
}));
jest.mock("../../../src/hooks/internal/useSubmitInputInternal", () => ({
	useSubmitInputInternal: jest.fn(),
}));
jest.mock("../../../src/hooks/internal/usePathsInternal", () => ({
	usePathsInternal: jest.fn(),
}));
jest.mock("../../../src/utils/mediaFileParser", () => ({
	getMediaFileDetails: jest.fn(),
}));
jest.mock("../../../src/context/BotRefsContext", () => ({
	...jest.requireActual("../../../src/context/BotRefsContext"),
	BotRefsProvider: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="bot-refs-provider">{children}</div>
	),
	useBotRefsContext: jest.fn(() => ({
		botIdRef: { current: "testBotId" },
		flowRef: { current: { currentPath: { file: jest.fn() } } },
	})),
}));

/**
 * Helper function to render FileAttachmentButton with specific initial settings.
 * @param blockAllowsAttachment Whether the block allows attachment
 * @param showMediaDisplay Whether media display is enabled
 */
const renderFileAttachmentButton = (blockAllowsAttachment: boolean, showMediaDisplay: boolean) => {
	const initialSettings = {
		fileAttachment: {
			sendFileName: true,
			multiple: true,
			accept: ".jpg,.png",
			showMediaDisplay: showMediaDisplay,
			icon: "attachment-icon-url",
			iconDisabled: "attachment-icon-disabled-url",
		},
		general: {
			actionDisabledIcon: "disabled-icon-url",
		},
		ariaLabel: {
			fileAttachmentButton: "upload file",
		},
	};
	const initialStyles = {
		fileAttachmentButtonStyle: { cursor: "pointer" },
		fileAttachmentButtonDisabledStyle: { cursor: "not-allowed" },
		fileAttachmentIconStyle: { backgroundImage: "url(icon.png)" },
		fileAttachmentIconDisabledStyle: { backgroundImage: "url(disabled-icon.png)" },
	};

	return render(
		<TestChatBotProvider initialSettings={initialSettings} initialStyles={initialStyles}>
			<FileAttachmentButton />
		</TestChatBotProvider>
	);
};

describe("FileAttachmentButton Component", () => {
	const mockInjectMessage = jest.fn();
	const mockHandleSubmitText = jest.fn();
  
	beforeEach(() => {
		jest.clearAllMocks();
  
		(useMessagesInternal as jest.Mock).mockReturnValue({
			injectMessage: mockInjectMessage,
		});
  
		(useSubmitInputInternal as jest.Mock).mockReturnValue({
			handleSubmitText: mockHandleSubmitText,
		});

		(usePathsInternal as jest.Mock).mockReturnValue({
			blockAllowsAttachment: true,
			getCurrPath: jest.fn().mockReturnValue("currentPath"),
			getPrevPath: jest.fn().mockReturnValue("previousPath"),
			goToPath: jest.fn(),
		});

		(getMediaFileDetails as jest.Mock).mockResolvedValue({
			fileType: "image",
			fileUrl: "http://example.com/test.png",
		});
	});
  
	it("renders with correct aria-label and initial state when attachment is allowed", () => {
		renderFileAttachmentButton(true, true);
  
		const button = screen.getByRole("button", { name: "upload file" });
		expect(button).toBeInTheDocument();
		expect(button).toHaveClass("rcb-attach-button-enabled");
  
		const input = screen.getByRole("file");
		expect(input).toBeEnabled();
		expect(input).toHaveAttribute("type", "file");
		expect(input).toHaveAttribute("multiple");
		expect(input).toHaveAttribute("accept", ".jpg,.png");
	});
  
	it("renders with disabled state when attachment is not allowed", () => {
		(usePathsInternal as jest.Mock).mockReturnValueOnce({
			blockAllowsAttachment: false,
			getCurrPath: jest.fn(),
			getPrevPath: jest.fn(),
			goToPath: jest.fn(),
		});
		renderFileAttachmentButton(false, true);
  
		const input = screen.getByRole("file");
		expect(input).toBeDisabled();
  
		const button = screen.getByRole("button", { name: "upload file" });
		expect(button).toHaveClass("rcb-attach-button-disabled");
	});

	it("displays correct icon for enabled state", () => {
		renderFileAttachmentButton(true, true);
    
		const icon = screen.getByRole("button", { name: "upload file" });
		expect(icon).toBeInTheDocument();
		expect(icon).toHaveClass("rcb-attach-button-enabled");
	});

	it("displays correct icon for disabled state", () => {
		(usePathsInternal as jest.Mock).mockReturnValueOnce({
			blockAllowsAttachment: false,
			getCurrPath: jest.fn(),
			getPrevPath: jest.fn(),
			goToPath: jest.fn(),
		});
    
		renderFileAttachmentButton(false, true);
    
		const icon = screen.getByRole("button", { name: "upload file" });
		expect(icon).toBeInTheDocument();
		expect(icon).toHaveClass("rcb-attach-button-disabled");
	});

	it("does not proceed when getCurrPath returns null", () => {
		(usePathsInternal as jest.Mock).mockReturnValueOnce({
			blockAllowsAttachment: true,
			getCurrPath: jest.fn().mockReturnValue(null),
			getPrevPath: jest.fn(),
			goToPath: jest.fn(),
		});
      
		renderFileAttachmentButton(true, true);
      
		const input = screen.getByRole("file");
		const file = new File(["test content"], "test.png", { type: "image/png" });
      
		fireEvent.change(input, { target: { files: [file] } });
      
		expect(mockHandleSubmitText).not.toHaveBeenCalled();
		expect(mockInjectMessage).not.toHaveBeenCalled();
	});

	it("handles file upload and calls the appropriate functions", async () => {
		const mockFileHandler = jest.fn();
		const mockFlow = { currentPath: { file: mockFileHandler } };
    
		(useBotRefsContext as jest.Mock).mockReturnValueOnce({
			...jest.requireMock("../../../src/context/BotRefsContext").useBotRefsContext(),
			flowRef: { current: mockFlow },
			inputRef: { current: { value: "test input" } },
		});
    
		renderFileAttachmentButton(true, true);
    
		const input = screen.getByRole("file");
		const file = new File(["test content"], "test.png", { type: "image/png" });
    
		fireEvent.change(input, { target: { files: [file] } });
    
		await new Promise((resolve) => setTimeout(resolve, 0));
    
		expect(mockFileHandler).toHaveBeenCalled();
		expect(mockFileHandler).toHaveBeenCalledWith(
			expect.objectContaining({
				userInput: "test input",
				files: [file],
			})
		);
	});
});
