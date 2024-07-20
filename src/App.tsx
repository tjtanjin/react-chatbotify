import ChatBot from "./components/ChatBot";
import { Flow } from "./types/Flow";
import { BlockParams } from "./types/BlockParams";

function App() {

	// Serves as an example flow used during the development phase - covers all possible attributes in a block.
	// restore to default state before running selenium tests (or update the test cases if necessary)!
	const flow: Flow = {
		start: {
			message: "Hello! What is your name?",
			path: "ask_age_group",
		},
		ask_age_group: {
			message: (params: BlockParams) => `Hey ${params.userInput}! Nice to meet you, what is your age group?`,
			options: ["child", "teen", "adult"],
			chatDisabled: true,
			path: () => "ask_math_question",
		},
		ask_math_question: {
			message: (params: BlockParams) => {
				if (params.prevPath == "incorrect_answer") {
					return;
				}
				return `I see you're a ${params.userInput}. Let's do a quick test! What is 1 + 1?`
			},
			path: (params: BlockParams) => {
				if (params.userInput != "2") {
					return "incorrect_answer"
				} else {
					return "ask_favourite_color";
				}
			},
		},
		ask_favourite_color: {
			message: "Great Job! What is your favourite color?",
			path: "ask_favourite_pet"
		},
		ask_favourite_pet: {
			message: "Interesting! Pick any 2 pets below.",
			checkboxes: {items: ["Dog", "Cat", "Rabbit", "Hamster"], min:2, max: 2},
			function: (params: BlockParams) => alert(`You picked: ${JSON.stringify(params.userInput)}!`),
			path: "ask_height",
		},
		ask_height: {
			message: "What is your height (cm)?",
			path: (params: BlockParams) => {
				if (isNaN(Number(params.userInput))) {
					params.injectMessage("Height needs to be a number!");
					return;
				}
				return "ask_weather";
			}
		},
		ask_weather: {
			message: (params: BlockParams) => {
				if (params.prevPath == "incorrect_answer") {
					return;
				}
				return "What's my favourite color? Click the button below to find out my answer!"
			},
			render: (
				<div style={{
					width: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					marginTop: 10
				}}>
					<button 
						className="secret-fav-color"
						onClick={() => alert("black")}>
						Click me!
					</button>
				</div>
			),
			path: (params: BlockParams) => {
				if (params.userInput.toLowerCase() != "black") {
					return "incorrect_answer"
				} else {
					params.openChat(false);
					return "close_chat";
				}
			},
		},
		close_chat: {
			message: "I went into hiding but you found me! Ok tell me, what's your favourite food?",
			path: "ask_image"
		},
		ask_image: {
			message: (params: BlockParams) => `${params.userInput}? Interesting. Could you share an image of that?`,
			file: (params: BlockParams) => console.log(params.files),
			path: "end"
		},
		end: {
			message: "Thank you for sharing! See you again!",
			path: "loop"
		},
		loop: {
			message: "You have reached the end of the conversation!",
			path: "loop"
		},
		incorrect_answer: {
			message: "Your answer is incorrect, try again!",
			transition: {duration: 0},
			path: (params: BlockParams) => params.prevPath
		},
	}

	return (
		<div className="App">
			<header className="App-header">
				<div style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: `calc(20vh)`}}>
					<ChatBot
						flow={flow}
						settings={{
							audio: {disabled: false},
							chatInput: {botDelay: 1000},
							userBubble: {showAvatar: true},
							botBubble: {showAvatar: true},
							voice: {disabled: false}
						}}
					></ChatBot>
				</div>
			</header>
		</div>
	);
}

export default App;