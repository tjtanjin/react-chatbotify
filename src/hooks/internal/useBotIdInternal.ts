import { useCallback } from "react";

import { useBotRefsContext } from "../../context/BotRefsContext";

/**
 * Internal custom hook for managing bot id.
 */
export const useBotIdInternal = () => {
	// handles bot refs
	const { botIdRef } = useBotRefsContext();

	/**
	 * Retrieves the id for the chatbot.
	 */
	const getBotId = useCallback(() => {
		return botIdRef.current;
	}, [botIdRef]);
	
	return {
		getBotId
	};
}