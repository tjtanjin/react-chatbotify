import React, { MutableRefObject } from "react";

import { expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/jest-globals";

import { useBotRefsContext, BotRefsProvider } from "../../src/context/BotRefsContext";
import { Flow } from "../../src/types/Flow";

// mocks component for consuming the BotRefsContext
const TestComponent = () => {
	const {
		botIdRef,
		flowRef,
		inputRef,
		streamMessageMap,
		chatBodyRef,
		paramsInputRef,
		keepVoiceOnRef,
		audioContextRef,
		audioBufferRef,
		gainNodeRef,
		prevInputRef,
	} = useBotRefsContext();

	return (
		<div>
			<p data-testid="botIdRef">botIdRef: {botIdRef.current?.toString()}</p>
			<p data-testid="flowRef">flowRef: {flowRef.current.toString()}</p>
			<p data-testid="inputRef">inputRef: {inputRef.current ? "input exists" : "no input"}</p>
			<p data-testid="streamMessageMap">streamMessageMap size: {streamMessageMap.current.size}</p>
			<p data-testid="chatBodyRef">chatBodyRef: {chatBodyRef.current ? "chat body exists" : "no chat body"}</p>
			<p data-testid="paramsInputRef">paramsInputRef: {paramsInputRef.current}</p>
			<p data-testid="keepVoiceOnRef">keepVoiceOnRef: {keepVoiceOnRef.current.toString()}</p>
			<p data-testid="audioContextRef">
				audioContextRef: {audioContextRef.current ? "audio context exists" : "no audio context"}
			</p>
			<p data-testid="audioBufferRef">
				audioBufferRef: {audioBufferRef.current ? "audio buffer exists" : "no audio buffer"}
			</p>
			<p data-testid="gainNodeRef">gainNodeRef: {gainNodeRef.current ? "gain node exists" : "no gain node"}</p>
			<p data-testid="prevInputRef">prevInputRef: {prevInputRef.current}</p>
		</div>
	);
};

describe("BotRefsContext", () => {
	it("provides the correct default values", () => {
		// defines values for botid and flow
		const botIdRef: MutableRefObject<string> = { current: "chatbot-id" };
		const flowRef: MutableRefObject<Flow> = { current: {} };

		render(
			<BotRefsProvider botIdRef={botIdRef} flowRef={flowRef}>
				<TestComponent />
			</BotRefsProvider>
		);

		// checks expected ref values
		expect(screen.getByTestId("botIdRef")).toHaveTextContent(`botIdRef: ${botIdRef.current.toString()}`);
		expect(screen.getByTestId("flowRef")).toHaveTextContent(`flowRef: ${flowRef.current.toString()}`);
		expect(screen.getByTestId("inputRef")).toHaveTextContent("inputRef: no input");
		expect(screen.getByTestId("streamMessageMap")).toHaveTextContent("streamMessageMap size: 0");
		expect(screen.getByTestId("chatBodyRef")).toHaveTextContent("chatBodyRef: no chat body");
		expect(screen.getByTestId("paramsInputRef")).toHaveTextContent("paramsInputRef:");
		expect(screen.getByTestId("keepVoiceOnRef")).toHaveTextContent("keepVoiceOnRef: false");
		expect(screen.getByTestId("audioContextRef")).toHaveTextContent("audioContextRef: no audio context");
		expect(screen.getByTestId("audioBufferRef")).toHaveTextContent("audioBufferRef: no audio buffer");
		expect(screen.getByTestId("gainNodeRef")).toHaveTextContent("gainNodeRef: no gain node");
		expect(screen.getByTestId("prevInputRef")).toHaveTextContent("prevInputRef:");
	});

	it("provides the correct initialized values", () => {
		// defines values for botid and flow
		const botIdRef: MutableRefObject<string> = { current: "chatbot-id-1" };
		const flowRef: MutableRefObject<Flow> = {
			current: {start: {message: "Hello! "}},
		};

		render(
			<BotRefsProvider botIdRef={botIdRef} flowRef={flowRef}>
				<TestComponent />
			</BotRefsProvider>
		);

		// checks expected ref values
		expect(screen.getByTestId("botIdRef")).toHaveTextContent(`botIdRef: ${botIdRef.current.toString()}`);
		expect(screen.getByTestId("flowRef")).toHaveTextContent(`flowRef: ${flowRef.current.toString()}`);
		expect(screen.getByTestId("inputRef")).toHaveTextContent("inputRef: no input");
		expect(screen.getByTestId("streamMessageMap")).toHaveTextContent("streamMessageMap size: 0");
		expect(screen.getByTestId("chatBodyRef")).toHaveTextContent("chatBodyRef: no chat body");
		expect(screen.getByTestId("paramsInputRef")).toHaveTextContent("paramsInputRef:");
		expect(screen.getByTestId("keepVoiceOnRef")).toHaveTextContent("keepVoiceOnRef: false");
		expect(screen.getByTestId("audioContextRef")).toHaveTextContent("audioContextRef: no audio context");
		expect(screen.getByTestId("audioBufferRef")).toHaveTextContent("audioBufferRef: no audio buffer");
		expect(screen.getByTestId("gainNodeRef")).toHaveTextContent("gainNodeRef: no gain node");
		expect(screen.getByTestId("prevInputRef")).toHaveTextContent("prevInputRef:");
	});

	it("allows updating refs and reflects changes in the context", () => {
		// defines values for botid and flow
		const botIdRef: MutableRefObject<string> = { current: "chatbot-id-2" };
		const flowRef: MutableRefObject<Flow> = {
			current: {start: {message: "Hello! "}},
		};

		const { rerender } = render(
			<BotRefsProvider botIdRef={botIdRef} flowRef={flowRef}>
				<TestComponent />
			</BotRefsProvider>
		);

		// verifies initial values
		expect(screen.getByTestId("botIdRef")).toHaveTextContent(`botIdRef: ${botIdRef.current.toString()}`);
		expect(screen.getByTestId("flowRef")).toHaveTextContent(`flowRef: ${flowRef.current.toString()}`);

		// updates refs
		botIdRef.current = "updated-chatbot-id-2";
		flowRef.current = {start: {message: "Goodbye!"}};

		// rerenders for updated values
		rerender(
			<BotRefsProvider botIdRef={botIdRef} flowRef={flowRef}>
				<TestComponent />
			</BotRefsProvider>
		);

		// checks expected ref values
		expect(screen.getByTestId("botIdRef")).toHaveTextContent(`botIdRef: ${botIdRef.current.toString()}`);
		expect(screen.getByTestId("flowRef")).toHaveTextContent(`flowRef: ${flowRef.current.toString()}`);
		expect(screen.getByTestId("inputRef")).toHaveTextContent("inputRef: no input");
		expect(screen.getByTestId("streamMessageMap")).toHaveTextContent("streamMessageMap size: 0");
		expect(screen.getByTestId("chatBodyRef")).toHaveTextContent("chatBodyRef: no chat body");
		expect(screen.getByTestId("paramsInputRef")).toHaveTextContent("paramsInputRef:");
		expect(screen.getByTestId("keepVoiceOnRef")).toHaveTextContent("keepVoiceOnRef: false");
		expect(screen.getByTestId("audioContextRef")).toHaveTextContent("audioContextRef: no audio context");
		expect(screen.getByTestId("audioBufferRef")).toHaveTextContent("audioBufferRef: no audio buffer");
		expect(screen.getByTestId("gainNodeRef")).toHaveTextContent("gainNodeRef: no gain node");
		expect(screen.getByTestId("prevInputRef")).toHaveTextContent("prevInputRef:");
	});
});