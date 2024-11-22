import {
	saveChatHistory,
	loadChatHistory,
	getHistoryMessages,
	setHistoryMessages,
	clearHistoryMessages,
	setHistoryStorageValues,
} from "../../src/services/ChatHistoryService";
import { Message } from "../../src/types/Message";
import { Settings } from "../../src/types/Settings";

jest.useFakeTimers();

describe("ChatHistoryService", () => {

	const mockMessage: Message = {
		id: "1",
		sender: "USER",
		content: "Hello good sir!",
		type: "text",
		timestamp: "2021-01-01T00:00:00Z",
	};

	const mockSettings: Settings = {
		chatHistory: {
			storageType: "LOCAL_STORAGE",
			storageKey: "rcb-history",
			maxEntries: 30,
			disabled: false,
			autoLoad: false,
		},
	};

	// Setup
	beforeAll(() => {
		global.Storage.prototype.setItem = jest.fn();
		global.Storage.prototype.getItem = jest.fn();
		global.Storage.prototype.removeItem = jest.fn();
	});

	
	beforeEach(() => {
		jest.clearAllMocks();
	});

	// teardown
	afterAll(() => {
		jest.restoreAllMocks();
	});

	describe("saveChatHistory", () => {
		it("should not save history if disabled", async () => {
			const settings = {
				...mockSettings,
				chatHistory: { ...mockSettings.chatHistory, disabled: true },
			};

			setHistoryStorageValues(settings);
			await saveChatHistory([mockMessage]);
			expect(localStorage.setItem).not.toHaveBeenCalled();
		});

		it("should save history if not disabled", async () => {
			setHistoryStorageValues(mockSettings);
			await saveChatHistory([mockMessage]);
			
			expect(localStorage.setItem).toHaveBeenCalled();
		});

		it("should handle empty message array without errors", async () => {
			setHistoryStorageValues(mockSettings);
			await saveChatHistory([]);
			expect(localStorage.setItem).toHaveBeenCalled();
		});

		it("should limit the number of messages saved according to maxEntries", async () => {
			const maxEntriesSettings = {
				...mockSettings,
				chatHistory: 
				{ ...mockSettings.chatHistory,
					maxEntries: 1 
				},
			};
			setHistoryStorageValues(maxEntriesSettings);

			const extraMessage = { ...mockMessage, id: "2" };
			await saveChatHistory([mockMessage, extraMessage]);

			const savedData = JSON.parse((localStorage.setItem as jest.Mock).mock.calls[0][1]);
			expect(savedData).toHaveLength(1);
			expect(savedData[0].id).toBe("2");
		});
	});

	describe("loadChatHistory", () => {
		it("should load history and display messages", () => {
			const setMessages = jest.fn();
			const setIsLoadingChatHistory = jest.fn();
			
			// Mock the div element for chatBodyRef
			const divElement = document.createElement("div");
			Object.defineProperty(divElement, "scrollHeight", { value: 1000 });
			divElement.scrollTop = 500;
		
			const chatBodyRef = {
				current: divElement
			};
		
			loadChatHistory(
				mockSettings,
				{},
				[mockMessage],
				setMessages,
				chatBodyRef,
				1000,
				setIsLoadingChatHistory
			);
		
			// Fast-forward until all timers have been executed
			jest.runAllTimers();
		
			expect(setMessages).toHaveBeenCalled();
			expect(setIsLoadingChatHistory).toHaveBeenCalledWith(false);
		});

		it("should handle corrupted data by clearing it from storage", () => {
			localStorage.setItem("rcb-history", "not_json_format");
	
			const setMessages = jest.fn();
			const setIsLoadingChatHistory = jest.fn();
			const chatBodyRef = { current: document.createElement("div") };
	
			// verify it doesn't throw
			expect(() =>
				loadChatHistory(
					mockSettings,
					{},
					[],
					setMessages,
					chatBodyRef,
					1000,
					setIsLoadingChatHistory
				)
			).not.toThrow();
		});

		it("does not do anything if chat history is null", () => {
			const setMessages = jest.fn();
			const setIsLoadingChatHistory = jest.fn();
			const chatBodyRef = { current: document.createElement("div") };
	
			loadChatHistory(
				mockSettings,
				{},
				null as unknown as Message[],
				setMessages,
				chatBodyRef,
				1000,
				setIsLoadingChatHistory
			);
	
			expect(setMessages).not.toHaveBeenCalled();
		});

		it("handles errors gracefully and removes chat history on error", () => {
			const setMessages = ()=> { throw new Error("Error setting messages"); };
			const setIsLoadingChatHistory = jest.fn();
			const chatBodyRef = { current: document.createElement("div") };
	
			loadChatHistory(
				mockSettings,
				{},
				[],
				setMessages,
				chatBodyRef,
				1000,
				setIsLoadingChatHistory
			);
	
			expect(localStorage.removeItem).toHaveBeenCalledWith(mockSettings.chatHistory?.storageKey);
		});
	});

	describe("clearHistoryMessages", () => {
		it("should clear history messages", () => {
			clearHistoryMessages();

			expect(localStorage.removeItem).toHaveBeenCalledWith("rcb-history");
		});
	});

	describe("setHistoryStorageValues", () => {
		it("should set storage values correctly", () => {
			setHistoryStorageValues(mockSettings);

			expect(localStorage.getItem).toHaveBeenCalledWith("rcb-history");
		});

		it("should handle invalid storage type by defaulting to local storage", () => {
			const invalidSettings = { 
				...mockSettings, chatHistory: 
				{ ...mockSettings.chatHistory, storageType: "INVALID_TYPE" } 
			};

			setHistoryStorageValues(invalidSettings);

			// Defaults to localStorage
			expect(localStorage.getItem).toHaveBeenCalledWith("rcb-history");  
		});

		it("should set sessionStorage when storageType is SESSION_STORAGE", () => {
			const sessionSettings = {
				...mockSettings,
				chatHistory: { 
					...mockSettings.chatHistory,
					storageType: "SESSION_STORAGE" 
				},
			};
			setHistoryStorageValues(sessionSettings);

			expect(sessionStorage.getItem).toHaveBeenCalledWith("rcb-history");
		});
	});

	describe("getHistoryMessages", () => {
		it("should retrieve history messages", () => {
			setHistoryStorageValues(mockSettings);

			const historyMessages = getHistoryMessages();
			expect(historyMessages).toEqual([]);
		});
	});

	describe("setHistoryMessages", () => {
		it("should set history messages", () => {
			setHistoryStorageValues(mockSettings);
			setHistoryMessages([mockMessage]);

			expect(localStorage.setItem).toHaveBeenCalledWith(
				"rcb-history",
				JSON.stringify([mockMessage])
			);
		});
	});
});
