declare namespace Cypress {
	interface Chainable<Subject = any> {
		/**
		* Custom command to access elements inside the chatbot's shadow DOM.
		*
		* @param selector The selector for the element inside the shadow DOM.
		*/
		getShadow(selector: string): Chainable<Subject>;
	}
}