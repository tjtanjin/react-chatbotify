import React, { createContext, useState } from 'react';
import { SettingsProvider } from '../../src/context/SettingsContext';
import { StylesProvider } from '../../src/context/StylesContext';
import { ToastsProvider } from '../../src/context/ToastsContext';
import { BotRefsProvider } from '../../src/context/BotRefsContext';
import { BotStatesProvider } from '../../src/context/BotStatesContext';
import { PathsProvider } from '../../src/context/PathsContext';
import { MessagesProvider } from '../../src/context/MessagesContext';
import { ChatBotProviderContextType } from '../../src/context/ChatBotContext';
import { Settings } from '../../src/types/Settings';
import { Styles } from '../../src/types/Styles';
import { DefaultStyles } from '../../src/constants/internal/DefaultStyles';
import { MockDefaultSettings } from './constants';

/**
 * Defines the structure for TestChatBotProvider's props.
 */
type TestChatBotProviderProps = {
  children: React.ReactNode;
  initialSettings?: Partial<Settings>;
  initialStyles?: Partial<Styles>;
  // Add other initial states or props as needed
};
// Create a context to detect whether ChatBotProvider is present
const ChatBotContext = createContext<ChatBotProviderContextType | undefined>(undefined);

/**
 * TestChatBotProvider component that wraps children with all necessary context providers.
 */
const TestChatBotProvider: React.FC<TestChatBotProviderProps> = ({
	children,
	initialSettings = MockDefaultSettings,
	initialStyles = DefaultStyles,
}) => {
	// Initialize settings state
	const [settings, setSettings] = useState<Settings>(initialSettings);
	
	// Initialize styles state
	const [styles, setStyles] = useState<Styles>(initialStyles);

	return (
		<ChatBotContext.Provider value={{ loadConfig: jest.fn() }}>
			<SettingsProvider settings={settings} setSettings={setSettings}>
				<StylesProvider styles={styles} setStyles={setStyles}>
					<ToastsProvider>
						<BotRefsProvider botIdRef={{ current: '' }} flowRef={{ current: {} }}>
							<PathsProvider>
								<BotStatesProvider settings={{ ...initialSettings }}>
									<MessagesProvider>
										{children}
									</MessagesProvider>
								</BotStatesProvider>
							</PathsProvider>
						</BotRefsProvider>
					</ToastsProvider>
				</StylesProvider>
			</SettingsProvider>
		</ChatBotContext.Provider>
	);
};

export { TestChatBotProvider };
