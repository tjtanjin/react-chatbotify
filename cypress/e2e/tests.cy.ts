/// <reference types="cypress" />

import path from "path";
import "cypress-file-upload";

describe("Chat Bot Test Suite", () => {
	before(() => {
		// Navigate to the page before running tests
		cy.visit("/");
	});

	it("Opens the chat window", () => {
		cy.get(".rcb-toggle-button").click();
    	cy.get(".rcb-window-open").should("exist");
	});

	it("Sends name and verifies bot reply", () => {
		cy.get(".rcb-chat-input-textarea").type("Tan Jin{enter}");
		cy.get(".rcb-bot-message").contains("Hey Tan Jin!").should("be.visible");
		cy.get(".rcb-bot-message").contains("Before we processed").should("be.visible");
	});

	it("Sensitive input should be masked", () => {
		cy.get(".rcb-chat-input-textarea").type("123456");
		cy.get('input[type="password"]').should('exist');
		cy.get(".rcb-chat-input-textarea").should('have.value',"123456");
		cy.get(".rcb-send-button").click();
		cy.get(".rcb-user-message").contains("******").should("be.visible");
	});

	it("Disabled chat input", () => {
		cy.get(".rcb-chat-input-textarea").type("Should not be able to type.");
		cy.get(".rcb-chat-input-textarea").should("have.value", "");
	});

	it("Clicks an option and verifies bot reply", () => {
		cy.get(".rcb-options").eq(1).click();
		cy.get(".rcb-bot-message").contains("I see you're a teen.").should("be.visible");
	});

	it("Sends wrong math answer and verifies bot reply", () => {
		cy.get(".rcb-chat-input-textarea").type("3{enter}");
		cy.get(".rcb-bot-message").contains("Your answer is incorrect, try again!").should("be.visible");
	});

	it("Sends correct math answer and verifies bot reply", () => {
		cy.get(".rcb-chat-input-textarea").type("2{enter}");
		cy.get(".rcb-bot-message").contains("Great Job! What is your favourite color?").should(
			"be.visible"
		);
	});

	it("Sends favorite color and verifies bot reply", () => {
		cy.get(".rcb-chat-input-textarea").type("red{enter}");
		cy.get(".rcb-bot-message").contains("Interesting! Pick any 2 pets below.").should("be.visible");
	});

	it("Selects insufficient checkboxes and verifies next button is disabled", () => {
		cy.get(".rcb-checkbox-row-container").eq(1).click();
		cy.get(".rcb-checkbox-next-button").should("have.css", "pointer-events").and("not.eq", "pointer");
	});

	it("Selects too many checkboxes and verifies error", () => {
		cy.get(".rcb-checkbox-row-container").eq(0).click();
		cy.get(".rcb-checkbox-row-container").eq(2).click();
		cy.get(".rcb-checkbox-mark")
			.eq(2)
			.should("have.css", "color", "rgba(0, 0, 0, 0)");
	});

	it("Selects correct checkboxes and verifies bot reply", () => {
		cy.get(".rcb-checkbox-next-button").click();
		cy.on("window:alert", (str) =>
			expect(str).to.equal('You picked: "Cat, Dog"!')
		);
		cy.get(".rcb-bot-message").contains("What is your height (cm)?").should("be.visible");
	});

	it("Sends wrong height and verifies bot reply", () => {
		cy.get(".rcb-chat-input-textarea").type("abc{enter}");
		cy.get(".rcb-bot-message").contains("Height needs to be a number!").should("be.visible");
	});

	it("Sends correct height and verifies bot reply", () => {
		cy.get(".rcb-chat-input-textarea").type("178.9{enter}");
		cy.get(".rcb-bot-message").contains("What's my favourite color?").should("be.visible");
	});

	it("Clicks hint button and handles alert", () => {
		cy.get(".secret-fav-color").click();
		cy.on("window:alert", (str) => expect(str).to.equal("black"));
	});

	it("Sends incorrect emoji guess and verifies bot reply", () => {
		cy.get(".rcb-emoji-button-enabled").click();
		cy.get(".rcb-emoji").should('exist').should('be.visible').first().click();
		cy.get(".rcb-send-button").click();
		cy.get(".rcb-chat-body-container").scrollTo('bottom', { duration: 1000 });
		cy.get(".rcb-bot-message").contains("Your answer is incorrect, try again!");
	});

	it("Sends correct color guess and verifies bot reply", () => {
		cy.get(".rcb-chat-input-textarea").scrollIntoView().should("be.visible");
		cy.get(".rcb-chat-input-textarea").type("black{enter}");
	});

	it("Closes chat window and verifies bot reply", () => {
		cy.get(".rcb-button-show").should("exist");
	});

	it("Reopens chat window and verifies bot reply", () => {
		cy.get(".rcb-toggle-button").click();
		cy.get(".rcb-bot-message").contains("I went into hiding but you found me!")
			.should("be.visible");
	});

	it("Send food and verifies bot reply", () => {
		cy.get(".bold").should('have.css', 'font-weight')
		.then((fontWeight) => +fontWeight).and('be.gte', 700)
		cy.get(".rcb-chat-input-textarea")
			.should("be.visible")
			.type("pasta{enter}");
		cy.get(".rcb-bot-message").contains("pasta? Interesting.").should("be.visible");
	});

	it("Send image and verifies bot reply", () => {
		const filePath = path.resolve("./assets/logo.png");
		cy.get(".rcb-attach-input").should("exist").attachFile(filePath);
		cy.get(".rcb-bot-message").should(
			"contain.text",
			"Thank you for sharing! See you again!"
		);
	});

	it("Sends goodbye, scrolls away, and verifies new message prompt", () => {
		cy.get(".rcb-chat-input-textarea").type("Goodbye!{enter}");
		cy.get(".rcb-chat-body-container").scrollTo("top");
		cy.get(".rcb-message-prompt-container").should("be.visible");
	});

	it("Scrolls to bottom on new message prompt click", () => {
		cy.get(".rcb-message-prompt-container").click();
		cy.get(".rcb-chat-body-container").should(($el) => {
			const scrollPosition = $el[0].scrollTop + $el[0].offsetHeight;
			const totalHeight = $el[0].scrollHeight;
			expect(scrollPosition).to.be.closeTo(totalHeight, 5);
		});
		cy.get(".rcb-bot-message").contains("You have reached the end of the conversation!")
			.should("be.visible");
	});

	it("Toggles notifications", () => {
		cy.get("[data-testid='rcb-notification-icon-svg']").click();
		cy.wait(100);
		cy.get("[data-testid='rcb-notification-icon-svg']").should('have.css', 'fill', 'rgb(232, 234, 237)'); 
	});

	it("Toggles audio", () => {
		cy.get("[data-testid='rcb-audio-icon-svg']").click();
		cy.wait(100);
		cy.get("[data-testid='rcb-audio-icon-svg']").should('have.css', 'fill', 'rgb(252, 236, 61)'); 
	});

	it("Toggles voice", () => {
		cy.get(".rcb-voice-button-disabled").click();
		cy.get(".rcb-voice-button-enabled").should("be.visible");
	});

	it("Views chat history and verifies message counts", () => {
		cy.reload();
		cy.get(".rcb-toggle-button").click();
		cy.get(".rcb-view-history-button").click();
		cy.get(".rcb-bot-message-container").should("have.length", 18);
		cy.get(".rcb-user-message-container").should("have.length", 13);
	});

	it("Verifies character limit", () => {
		cy.get("body").then((body) => {
			if (body.find(".rcb-chat-input-char-counter").length > 0) {
				cy.get(".rcb-chat-input-char-counter").then(($el) => {
					const charLimit = parseInt($el.text().split("/")[1], 10);
					const longString = "a".repeat(charLimit + 10);

					cy.get(".rcb-chat-input-textarea").type(longString);
					cy.get(".rcb-chat-input-textarea").should(
						"have.value",
						longString.substring(0, charLimit)
					);
				});
			} else {
				cy.log("Character counter does not exist, skipping char limit test.");
			}
		});
	});

	const themeId = "new-theme";
	const themeVersion = "1.0.0";
	const defaultExpiration = 3;
	const settings = {};
	const inlineStyles = {};
	const cssStylesText = "body { background-color: red; }";

	it("Should retrieve the theme if not expired", () => {
		cy.chatbotify.setCachedTheme(
			themeId,
			themeVersion,
			settings,
			inlineStyles,
			cssStylesText
		);

		const theme = cy.chatbotify.getCachedTheme(
			themeId,
			themeVersion,
			defaultExpiration
		);

		expect(theme).to.exist;
		expect(theme?.settings).to.deep.equal(settings);
		expect(theme?.inlineStyles).to.deep.equal(inlineStyles);
		expect(theme?.cssStylesText).to.equal(cssStylesText);
	});

	it("Should not retrieve the theme if expired", () => {
		cy.chatbotify.setCachedTheme(
			themeId,
			themeVersion,
			settings,
			inlineStyles,
			cssStylesText
		);

		cy.wait(4000).then(() => {

			const theme = cy.chatbotify.getCachedTheme(
				themeId,
				themeVersion,
				defaultExpiration
			);

			expect(theme).to.be.null;
		})
	});
});
