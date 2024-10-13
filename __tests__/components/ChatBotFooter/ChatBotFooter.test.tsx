import React from "react";

import { expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/jest-globals";

import ChatBotFooter from "../../../src/components/ChatBotFooter/ChatBotFooter"

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

		<ChatBotFooter buttons={buttons}></ChatBotFooter>

	);
};


describe("ChatBotFooter Component", () => {
	it("renders the chatbotfooter container component", () => {
		const buttons = [
			<button key="mock-button-1" role="button">Mock Button 1</button>,
			<button key="mock-button-2" role="button">Mock Button 2</button>
		];
		renderChatBotFooter({ buttons })

		const footerContainer = screen.getByTestId("chatbot-footer-container");
		expect(footerContainer).toBeInTheDocument();

		const footerbuttons =screen.getAllByRole("button");
		expect(footerbuttons).toHaveLength(2);
		expect(footerbuttons[0]).toBeInTheDocument();
		expect(footerbuttons[1]).toBeInTheDocument();

		const icon = footerContainer.querySelector("span");
		expect(icon).toBeInTheDocument();
	})


});