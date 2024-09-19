import { defineConfig } from "cypress";

export default defineConfig({
	e2e: {
		baseUrl: "http://localhost:3000",
		testIsolation: false,
		defaultCommandTimeout: 4000,
	},
});
