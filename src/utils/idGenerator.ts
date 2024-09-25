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
		}

		// fallback to crypto.randomBytes (Node.js environment)
		try {
			return import("crypto").then(nodeCrypto => {
				const getRandomValues = (arr: Uint8Array) => nodeCrypto.randomFillSync(arr);
				const buffer = new Uint8Array(16);
				getRandomValues(buffer);
			
				// Set version (4) and variant (2) bits
				buffer[6] = (buffer[6] & 0x0f) | 0x40;
				buffer[8] = (buffer[8] & 0x3f) | 0x80;
			
				// Convert to hex string and format as UUID
				const hex = Array.from(buffer, (b) => b.toString(16).padStart(2, "0")).join("");
				return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}
					-${hex.slice(16, 20)}-${hex.slice(20)}`;
			});
		} catch {
			throw new Error("Neither crypto.randomUUID, crypto.getRandomValues, nor randomBytes are available");
		}
	}
}