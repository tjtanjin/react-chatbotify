
import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import MediaDisplay from "../../../src/components/ChatBotBody/MediaDisplay/MediaDisplay";
import { useSettingsContext } from "../../../src/context/SettingsContext";
import { useStylesContext } from "../../../src/context/StylesContext";

// Mock the contexts
jest.mock("../../../src/context/SettingsContext", () => ({
	useSettingsContext: jest.fn(),
}));

jest.mock("../../../src/context/StylesContext", () => ({
	useStylesContext: jest.fn(),
}));

const mockSettingsContext = {
	settings: {
		general: { primaryColor: "#000000" },
		userBubble: { showAvatar: true },
	}
};

const mockStylesContext = {
	styles: {
		mediaDisplayContainerStyle: { border: "1px solid red" }
	}
};

// Helper function to render MediaDisplay with mocked contexts
const renderMediaDisplay = (file: File, fileType: string, fileUrl: string | null) => {
	(useSettingsContext as jest.Mock).mockReturnValue(mockSettingsContext);
	(useStylesContext as jest.Mock).mockReturnValue(mockStylesContext);
	render(<MediaDisplay file={file} fileType={fileType} fileUrl={fileUrl} />);
};

describe("MediaDisplay", () => {
	it("renders an image correctly when fileType is 'image'", () => {
		const file = new File(["dummy content"], "tanjin.png", { type: "image/png" });
		renderMediaDisplay(file, "image", "https://react-chatbot.com/tanjin.png");

		const imageElement = screen.getByRole("img");
		expect(imageElement).toBeInTheDocument();
		expect(imageElement).toHaveAttribute("src", "https://react-chatbot.com/tanjin.png");

		const container = screen.getByTestId("media-display-image-container");
		expect(container).toHaveStyle({
			backgroundColor: "#000000",
			maxWidth: "65%",
			border: "1px solid red",
		});
	});

	it("renders a video correctly when fileType is 'video'", () => {
		const file = new File(["dummy content"], "tanjin.mp4", { type: "video/mp4" });
		renderMediaDisplay(file, "video", "https://react-chatbot.com/tanjin.mp4");

		const videoContainer = screen.getByTestId("media-display-video-container");
		expect(videoContainer).toBeInTheDocument();

		const sourceElement = videoContainer.querySelector("source");
		expect(sourceElement).toBeInTheDocument();
		expect(sourceElement).toHaveAttribute("src", "https://react-chatbot.com/tanjin.mp4");
		expect(sourceElement).toHaveAttribute("type", "video/mp4");
	});

	it("renders audio correctly when fileType is 'audio'", () => {
		const file = new File(["dummy content"], "tanjin.mp3", { type: "audio/mp3" });
		renderMediaDisplay(file, "audio", "https://react-chatbot.com/tanjin.mp3");

		const audioContainer = screen.getByTestId("media-display-audio-container");
		expect(audioContainer).toBeInTheDocument();

		const sourceElement = audioContainer.querySelector("source");
		expect(sourceElement).toBeInTheDocument();
		expect(sourceElement).toHaveAttribute("src", "https://react-chatbot.com/tanjin.mp3");
		expect(sourceElement).toHaveAttribute("type", "audio/mp3");
	});

	it("renders nothing if fileUrl is null", () => {
		const file = new File(["dummy content"], "tanjin.png", { type: "image/png" });
		renderMediaDisplay(file, "image", null);

		expect(screen.queryByRole("img")).not.toBeInTheDocument();
		expect(screen.queryByRole("video")).not.toBeInTheDocument();
		expect(screen.queryByRole("audio")).not.toBeInTheDocument();
	});
});