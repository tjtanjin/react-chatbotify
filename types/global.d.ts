import { EventHandler } from "react";

declare global {
	interface Navigator {
		virtualKeyboard?: VirtualKeyboard;
	}

	/**
	 * Represents the virtual keyboard API, which extends the browser's navigator object.
	 * 
	 * Note: VirtualKeyboard is not natively supported by TypeScript. The implementation 
	 * provided here is based on the proposed specification available at 
	 * {@link https://w3c.github.io/virtual-keyboard/#dom-navigator-virtualkeyboard}.
	 */
	interface VirtualKeyboard extends EventTarget {
		hide(): void
		show(): void;
		boundingRect: DOMRect;
		overlaysContent: boolean;
		ongeometrychange: EventHandler;
	}
}
