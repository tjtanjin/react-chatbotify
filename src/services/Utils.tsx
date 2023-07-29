// default provided welcome flow if user does not pass in a flow to the chat bot
// todo: update welcome flow after documentation is done
const defaultFlow = {
	start: {
		message: "Hello there 👋, I am Tan Jin! Thank you for using React ChatBotify 😊 It seems you have yet to " + 
			"create a conversation flow. Do check out the guide below for a start..."
	}
}

export const getDefaultFlow = () => {
	return defaultFlow;
}

// boolean indicating if user is on desktop (otherwise treated as on mobile)
export const isDesktop = !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));