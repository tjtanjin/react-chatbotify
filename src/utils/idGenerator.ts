/**
 * Generates a secure uuid using crypto.randomUUID (or fallback to crypto.getRandomValues).
 */
export const generateSecureUUID = () => {
	try {
		// Check if crypto.randomUUID is available and in a secure context
		if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
			return crypto.randomUUID();
		} else {
			throw new Error("crypto.randomUUID not available");
		}
	} catch (error) {
		// fallback to use crypto.getRandomValues for secure randomness
		if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
			return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
				const r = crypto.getRandomValues(new Uint8Array(1))[0] % 16;
				const v = c === "x" ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		} else {
			throw new Error("crypto.getRandomValues is also not available");
		}
	}
}