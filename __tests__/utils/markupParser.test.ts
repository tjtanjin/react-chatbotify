import { expect, it, describe, beforeEach, jest } from "@jest/globals";
import { parseMarkupMessage } from "../../src/utils/markupParser";

describe("", ()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
    });

    it("should be able to parse a plain string without tags", ()=>{
        const result = "This is a plain string";
        const message = parseMarkupMessage(result);

        expect(message).toEqual(["T", "h", "i", "s", " ", "i", "s", " ", "a", " ", "p", "l", "a", "i", "n", " ", "s", "t", "r", "i", "n", "g"]);
    });

    it("should be able to parse a plain string with tags", ()=>{
        const result = "<div>This is a plain string</div>";
        const message = parseMarkupMessage(result);

        expect(message).toEqual(["<div>", "T", "h", "i", "s", " ", "i", "s", " ", "a", " ", "p", "l", "a", "i", "n", " ", "s", "t", "r", "i", "n", "g", "</div>"]);
    });

    it("should be able to parse nested tags", ()=>{
        const result = "<div> This contains a <bold>Bold</bold> tag</div>";
        const message = parseMarkupMessage(result);

        expect(message).toEqual(["<div>", " ", "T", "h", "i", "s", " ", "c", "o", "n", "t", "a", "i", "n", "s", " ", "a", " ", "<bold>", "B", "o", "l", "d", "</bold>", " ", "t", "a", "g", "</div>"]);
    });

    it("should be able to parse attributes in tags", ()=>{
        const result = "<a href=`http://www.example.com`>Link</a>";
        const message= parseMarkupMessage(result);

        expect(message).toEqual(["<a href=`http://www.example.com`>", "L", "i", "n", "k", "</a>"] );
    });

    it("should be able to parse unclosed tags", ()=>{
        const result = "<div> This tag is unclosed";
        const message = parseMarkupMessage(result);

        expect(message).toEqual(["<div>", " ", "T", "h", "i", "s", " ", "t", "a", "g", " ", "i", "s", " ", "u", "n", "c", "l", "o", "s", "e", "d"] );
    });

    
})
