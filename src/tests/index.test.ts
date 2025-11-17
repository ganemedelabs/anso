import color from "../index";

describe("anso", () => {
    describe("static colors", () => {
        it("should apply red color", () => {
            const result = color.red("hello");
            expect(result).toContain("\x1b[");
            expect(result).toContain("hello");
        });

        it("should apply bold style", () => {
            const result = color.bold("text");
            expect(result).toContain("\x1b[1m");
        });

        it("should apply background colors", () => {
            const result = color.bgBlue("text");
            expect(result).toContain("\x1b[");
        });

        it("should reset after styling", () => {
            const result = color.green("text");
            expect(result).toContain("\x1b[39m");
        });
    });

    describe("hex colors", () => {
        it("should handle 6-digit hex colors", () => {
            const result = color.FF5733("text");
            expect(typeof result).toBe("string");
            expect(result).toContain("text");
        });

        it("should handle 3-digit hex colors", () => {
            const result = color.F57("text");
            expect(typeof result).toBe("string");
            expect(result).toContain("text");
        });

        it("should handle hex via function call", () => {
            const styler = color("FF5733");
            const result = styler("text");
            expect(result).toContain("text");
        });

        it("should reject invalid hex colors", () => {
            const result = color.GGGGGG("text");
            expect(result).toBe("text");
        });
    });

    describe("chaining and composition", () => {
        it("should support chaining styles", () => {
            const result = color.bold(color.red("text"));
            expect(result).toContain("text");
        });
    });

    describe("edge cases", () => {
        it("should handle empty strings", () => {
            const result = color.red("");
            expect(typeof result).toBe("string");
        });

        it("should handle special characters", () => {
            const result = color.blue("hello\nworld");
            expect(result).toContain("hello\nworld");
        });
    });
});
