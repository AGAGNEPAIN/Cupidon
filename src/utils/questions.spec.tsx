import { describe, it, expect } from "vitest";
import { QUESTIONS } from "./questions";

describe("QUESTIONS data", () => {
  it("should have at least one question", () => {
    expect(QUESTIONS.length).toBeGreaterThan(0);
  });

  it("should have required properties for all questions", () => {
    QUESTIONS.forEach((q) => {
      expect(q).toHaveProperty("titleText");
      expect(q).toHaveProperty("yes");
      expect(q).toHaveProperty("no");
      expect(typeof q.showBebou).toBe("boolean");
    });
  });

  it("should have the first question tagged with showBebou", () => {
    expect(QUESTIONS[0].showBebou).toBe(true);
  });
});
