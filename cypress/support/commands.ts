// Custom command to access elements inside the shadow DOM of the chatbot
Cypress.Commands.add('getShadow', (selector) => {
	cy.get('#shadow-container-chatbot-id').shadow().find(selector);
});