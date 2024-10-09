import React from "react";

import { expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/jest-globals";

import ChatBotFooter from "../../../src/components/ChatBotFooter/ChatBotFooter"
import { TestChatBotProvider } from "../../__mocks__/TestChatBotContext";
import AudioButton from "../../../src/components/Buttons/AudioButton/AudioButton";
import EmojiButton from "../../../src/components/Buttons/EmojiButton/EmojiButton";
/**
 * Helper function to render AudioButton with different settings.
 *
 * @param initialSettings initial settings for the TestChatBotProvider
 */
/**
 * Contains footer buttons and text.
 * 
 * @param buttons list of buttons to render in the footer
 */


const renderChatBotFooter = ({ buttons }: { buttons: JSX.Element[] }) => {
	return render(
		<TestChatBotProvider>
			<ChatBotFooter buttons={buttons}></ChatBotFooter>
		</TestChatBotProvider>
	);
};


describe("ChatBotFooter Component", () => {
	it("renders the chatbotfooter container component", () => {
		const buttons = [
			<AudioButton key="audio-button" />,
			<EmojiButton key="emoji-button" />,
		];
		renderChatBotFooter({ buttons })

		const footerContainer = screen.getByTestId("chatbot-footer-container");
		expect(footerContainer).toBeInTheDocument();

		expect(screen.getByLabelText("toggle audio")).toBeInTheDocument();
		expect(screen.getByLabelText("emoji picker")).toBeInTheDocument();

		const icon = footerContainer.querySelector("span");
		expect(icon).toBeInTheDocument();
	})


});