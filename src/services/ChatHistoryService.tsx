import { createElement, isValidElement, Dispatch, SetStateAction, ReactNode, CSSProperties } from "react";
import ReactDOMServer from "react-dom/server";

import ChatHistoryLineBreak from "../components/ChatHistoryLineBreak/ChatHistoryLineBreak";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import { Message } from "../types/Message";
import { Options } from "../types/Options";

/**
 * Updates the messages array with a new message appended at the end and saves chat history if enabled.
 * 
 * @param setMessages setter for updating messages
 * @param message message to append
 * @param botOptions options provided to the bot
 */
const updateMessages = (setMessages: Dispatch<SetStateAction<Message[]>>, message: Message, botOptions: Options) => {
	setMessages((prevMessages) => [...prevMessages, message]);

	if (botOptions.chatHistory?.disabled) {
		return;
	}

	const historyStorageKey = botOptions.chatHistory?.storageKey as string;
	let chatHistory = getChatHistory(historyStorageKey);
	if (chatHistory == null) {
		chatHistory = [];
	}

	const parsedMessage = parseMessageToString(message);
	chatHistory.push(parsedMessage);
	if (chatHistory.length > (botOptions.chatHistory?.maxEntries as number)) {
		chatHistory.shift();
	}

	localStorage.setItem(historyStorageKey, JSON.stringify(chatHistory));
}

/**
 * Retrieves chat history.
 * 
 * @param historyStorageKey key used to identify chat history stored in local storage
 */
const getChatHistory = (historyStorageKey: string) => {
	const chatHistory = localStorage.getItem(historyStorageKey);
	if (chatHistory != null) {
		try {
			return JSON.parse(chatHistory);
		} catch {
			return null;
		}
	}
	return null;
}

/**
 * Parses message into string for chat history storage.
 * 
 * @param message message to parse
 */
const parseMessageToString = (message: Message) => {
	if (isValidElement(message.content)) {
		const clonedMessage = structuredClone({
			content: ReactDOMServer.renderToString(message.content),
			type: message.type,
			isUser: message.isUser
		});
		return clonedMessage;
	}

	return message;
}

/**
 * Loads chat history into the chat window for user view.
 * 
 * @param botOptions options provided to the bot
 * @param chatHistory chat history to show
 * @param setMessages setter for updating messages
 * @param setIsLoadingChatHistory setter for updating load progress
 * @param setTextAreaDisabled setter for enabling/disabling user text area
 */
const loadChatHistory = (botOptions: Options, chatHistory: string, setMessages: Dispatch<SetStateAction<Message[]>>, 
	setIsLoadingChatHistory: Dispatch<SetStateAction<boolean>>,
	setTextAreaDisabled: Dispatch<SetStateAction<boolean>>) => {

	if (chatHistory != null) {
		try {
			setMessages((prevMessages) => {
				const loaderMessage = {
					content: <LoadingSpinner/>,
					type: "object",
					isUser: false,
					isHistory: true,
					timestamp: null
				}
				prevMessages.shift();
				return [loaderMessage, ...prevMessages];
			});

			const parsedMessages = JSON.parse(chatHistory).map((message: Message) => {
				if (message.type === "object") {
					const element = renderHTML(message.content as string, botOptions);
					return { ...message, content: element };
				}
				return message;
			});

			setTimeout(() => {
				setMessages((prevMessages) => {
					prevMessages.shift();
					const lineBreakMessage = {
						content: <ChatHistoryLineBreak/>,
						type: "object",
						isUser: false
					}
					return [...parsedMessages, lineBreakMessage, ...prevMessages];
				});
				setIsLoadingChatHistory(false);
				setTextAreaDisabled(botOptions.chatInput?.disabled || false);
			}, 500)
		} catch {
			// remove chat history on error (to address corrupted storage values)
			localStorage.removeItem(botOptions.chatHistory?.storageKey as string);
		}
	}
}

/**
 * Renders html string to a react node.
 * 
 * @param html string to render
 * @param botOptions options provided to the bot
 */
const renderHTML = (html: string, botOptions: Options): ReactNode[] => {
	const parser = new DOMParser();
	const parsedHtml = parser.parseFromString(html, "text/html");
	const nodes = Array.from(parsedHtml.body.childNodes);
  
	const renderNodes: ReactNode[] = nodes.map((node, index) => {
		if (node.nodeType === Node.TEXT_NODE) {
			return node.textContent;
		} else {
			const tagName = (node as Element).tagName.toLowerCase();
			let attributes = Array.from((node as Element).attributes).reduce((acc, attr) => {
				const attributeName = attr.name.toLowerCase();
				if (attributeName === "style") {
					const styleProperties = attr.value.split(";").filter(property => property.trim() !== "");
					const styleObject: { [key: string]: string } = {};
					styleProperties.forEach(property => {
						const [key, value] = property.split(":").map(part => part.trim());
						const reactCompliantKey = key.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
						styleObject[reactCompliantKey] = value;
					});
					acc[attributeName] = styleObject;
				} else {
					acc[attributeName] = attr.value;
				}
				return acc;
			}, {} as { [key: string]: string | CSSProperties });

			const classList = (node as Element).classList;
			if (botOptions.botBubble?.showAvatar) {
				attributes = addStyleToContainers(classList, attributes);
			}
			attributes = addStyleToOptions(classList, attributes, botOptions);
			attributes = addStyleToCheckboxRows(classList, attributes, botOptions);
			attributes = addStyleToCheckboxNextButton(classList, attributes, botOptions);
			const children = renderHTML((node as Element).innerHTML, botOptions);
			return createElement(tagName, { key: index, ...attributes }, children);
		}
	});
  
	return renderNodes;
};

/**
 * Add styles (that were lost when saving to history) to options container/checkbox container.
 * 
 * @param classList array of classes the element has
 * @param attributes current attributes the element has
 */
const addStyleToContainers = (classList: DOMTokenList, attributes: {[key: string]: string | CSSProperties}) => {
	if (classList.contains("rcb-options-container") || classList.contains("rcb-checkbox-container")) {
		attributes["style"] = {
			...(attributes["style"] as CSSProperties),
			marginLeft: "50px"
		}
	}
	return attributes;
}

/**
 * Add styles (that were lost when saving to history) to options.
 * 
 * @param classList array of classes the element has
 * @param attributes current attributes the element has
 * @param botOptions options provided to the bot
 */
const addStyleToOptions = (classList: DOMTokenList, attributes: {[key: string]: string | CSSProperties},
	botOptions: Options) => {
	if (classList.contains("rcb-options")) {
		attributes["style"] = {
			...(attributes["style"] as CSSProperties),
			color: botOptions.botOptionStyle?.color as string || botOptions.theme?.primaryColor,
			borderColor: botOptions.botOptionStyle?.color as string || botOptions.theme?.primaryColor,
			cursor: `url(${botOptions.theme?.actionDisabledIcon}), auto`
		}
	}
	return attributes;
}

/**
 * Add styles (that were lost when saving to history) to checkbox rows.
 * 
 * @param classList array of classes the element has
 * @param attributes current attributes the element has
 * @param botOptions options provided to the bot
 */
const addStyleToCheckboxRows = (classList: DOMTokenList, attributes: {[key: string]: string | CSSProperties},
	botOptions: Options) => {
	if (classList.contains("rcb-checkbox-row-container")) {
		attributes["style"] = {
			...(attributes["style"] as CSSProperties),
			color: botOptions.botCheckboxRowStyle?.color as string || botOptions.theme?.primaryColor,
			borderColor: botOptions.botCheckboxRowStyle?.color as string || botOptions.theme?.primaryColor,
			cursor: `url(${botOptions.theme?.actionDisabledIcon}), auto`
		}
	}
	return attributes;
}

/**
 * Add styles (that were lost when saving to history) to checkbox next button.
 * 
 * @param classList array of classes the element has
 * @param attributes current attributes the element has
 * @param botOptions options provided to the bot
 */
const addStyleToCheckboxNextButton = (classList: DOMTokenList, attributes: {[key: string]: string | CSSProperties},
	botOptions: Options) => {
	if (classList.contains("rcb-checkbox-next-button")) {
		attributes["style"] = {
			...(attributes["style"] as CSSProperties),
			color: botOptions.botCheckboxNextStyle?.color as string || botOptions.theme?.primaryColor,
			borderColor: botOptions.botCheckboxNextStyle?.color as string || botOptions.theme?.primaryColor,
			cursor: `url(${botOptions.theme?.actionDisabledIcon}), auto`
		}
	}
	return attributes;
}

export {
	updateMessages,
	loadChatHistory
}