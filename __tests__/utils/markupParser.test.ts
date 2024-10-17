import { expect, it, describe, beforeEach, jest } from "@jest/globals";
import { parseMarkupMessage, stripHtml } from "../../src/utils/markupParser";

describe("parseMarkupMessage", ()=>{
	beforeEach(()=>{
		jest.clearAllMocks();
	});

	it("should be able to parse a plain string without tags", ()=>{
		const result = "This is a plain string";
		const message = parseMarkupMessage(result);

		expect(message).toEqual(
			["T", "h", "i", "s", " ", "i", "s", " ", "a", " ", "p", "l", "a", "i", "n", " ", 
				"s", "t", "r", "i", "n", "g"]
		);
	});

	it("should be able to parse a plain string with tags", ()=>{
		const result = "<div>This is a plain string</div>";
		const message = parseMarkupMessage(result);

		expect(message).toEqual(["<div>", "T", "h", "i", "s", " ", "i", "s", " ", "a", " ", "p", 
			"l", "a", "i", "n", " ", "s", "t", "r", "i", "n", "g", "</div>"]);
	});

	it("should be able to parse nested tags", ()=>{
		const result = "<div> This contains a <bold>Bold</bold> tag</div>";
		const message = parseMarkupMessage(result);

		expect(message).toEqual(["<div>", " ", "T", "h", "i", "s", " ", "c", "o", "n", "t", "a", "i", 
			"n", "s", " ", "a", " ", "<bold>", "B", "o", "l", "d", "</bold>", " ", "t", "a", "g", "</div>"]);
	});

	it("should be able to parse attributes in tags", ()=>{
		const result = "<a href=`http://www.example.com`>Link</a>";
		const message= parseMarkupMessage(result);

		expect(message).toEqual(["<a href=`http://www.example.com`>", "L", "i", "n", "k", "</a>"] );
	});

	it("should be able to parse unclosed tags", ()=>{
		const result = "<div> This tag is unclosed";
		const message = parseMarkupMessage(result);

		expect(message).toEqual(["<div>", " ", "T", "h", "i", "s", " ", "t", "a", "g", " ", "i", "s", 
			" ", "u", "n", "c", "l", "o", "s", "e", "d"] );
	});
    
});

describe("stripHtml", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should return the same string when no tags are present", () => {
		const html = "This is a plain string";
		const result = stripHtml(html);
		expect(result).toEqual("This is a plain string");
	});

	it("should remove a single HTML tag", () => {
		const html = "<div>This is a plain string</div>";
		const result = stripHtml(html);
		expect(result).toEqual("This is a plain string");
	});

	it("should remove nested HTML tags", () => {
		const html = "<div>This contains a <strong>bold</strong> word</div>";
		const result = stripHtml(html);
		expect(result).toEqual("This contains a bold word");
	});

	it("should remove multiple tags with attributes", () => {
		const html = "<a href='http://example.com'>Link</a> to <span style='color: red;'>some text</span>";
		const result = stripHtml(html);
		expect(result).toEqual("Link to some text");
	});

	it("should handle unclosed tags gracefully", () => {
		const html = "<div>Unclosed tag";
		const result = stripHtml(html);
		expect(result).toEqual("Unclosed tag");
	});

	it("should return an empty string when input is empty", () => {
		const html = "";
		const result = stripHtml(html);
		expect(result).toEqual("");
	});
});
