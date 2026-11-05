import { describe, it, expect, beforeEach } from "vitest";
import { submitPracticalTask, evaluatePracticalTask } from "@/data/mockCourses";
import API from "@/services/api";

describe("Assessment Scoring & Retake Logic", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should NOT blindly give 70% to short or gibberish answers", () => {
    // Short gibberish
    const res1 = evaluatePracticalTask("course-1", "prac-1-1", "asdf");
    expect(res1.grade).toBeLessThan(70);
    expect(res1.passed).toBe(false);

    // Random irrelevant text >= 15 chars
    const res2 = evaluatePracticalTask("course-1", "prac-1-1", "this is completely random nonsense text without answers");
    expect(res2.grade).toBeLessThan(70);
    expect(res2.passed).toBe(false);

    // Completely wrong topic for Course 2
    const res3 = evaluatePracticalTask("course-2", "prac-2-1", "i like chocolate ice cream very much");
    expect(res3.grade).toBeLessThan(70);
    expect(res3.passed).toBe(false);
  });

  it("should score >= 70% and pass ONLY if the student answers with correct criteria", () => {
    // Course 1 Task 1: Title, Arial, 16pt, Bold, Center
    const goodAnswerWord = "Created heading 'Digimitra Digital School Project' in Arial font, size 16pt, formatted Bold and Center aligned.";
    const evalWord = evaluatePracticalTask("course-1", "prac-1-1", goodAnswerWord);
    expect(evalWord.grade).toBeGreaterThanOrEqual(70);
    expect(evalWord.passed).toBe(true);

    // Course 1 Task 2: Subscript H2O, Superscript mc2, Yellow highlight
    const goodAnswerFormula = "Applied subscript for H2O chemical formula, superscript for E=mc2 exponent, and highlighted with yellow color.";
    const evalFormula = evaluatePracticalTask("course-1", "prac-1-2", goodAnswerFormula);
    expect(evalFormula.grade).toBeGreaterThanOrEqual(70);
    expect(evalFormula.passed).toBe(true);

    // Course 2 Task 1: 5 Computer parts + descriptions
    const goodAnswerParts = "Identified 5 parts: Monitor to display output, Keyboard to type, Mouse to click, CPU the brain that processes data, and Speakers for sound audio.";
    const evalParts = evaluatePracticalTask("course-2", "prac-2-1", goodAnswerParts);
    expect(evalParts.grade).toBeGreaterThanOrEqual(70);
    expect(evalParts.passed).toBe(true);
  });

  it("should NOT add task to completedPracticals if student scores less than 70%", async () => {
    const userId = "test-student-fail";
    const res = await API.post("/progress/practical-submit", {
      courseId: "course-1",
      practicalId: "prac-1-1",
      submissionText: "random bad answer without any formatting"
    });

    expect(res.status).toBe(200);
    expect(res.data.result.grade).toBeLessThan(70);
    expect(res.data.result.passed).toBe(false);
    expect(res.data.progress.completedPracticals).not.toContain("prac-1-1");
  });

  it("should allow a failed student to retake and pass when they answer correctly", async () => {
    const userId = "test-student-retake";
    localStorage.setItem("userInfo", JSON.stringify({ _id: userId, name: "Student Retake" }));

    // 1st attempt: bad answer -> fails
    const failRes = submitPracticalTask("course-1", "prac-1-1", "just a bad attempt", userId);
    expect(failRes.result.grade).toBeLessThan(70);
    expect(failRes.result.passed).toBe(false);
    expect(failRes.progressItem.completedPracticals).not.toContain("prac-1-1");

    // 2nd attempt (Retake): correct answer -> passes!
    const passRes = submitPracticalTask(
      "course-1",
      "prac-1-1",
      "Created title 'Digimitra Digital School Project' in Arial font, size 16pt, Bold, Center aligned on the page.",
      userId
    );

    expect(passRes.result.grade).toBeGreaterThanOrEqual(70);
    expect(passRes.result.passed).toBe(true);
    expect(passRes.progressItem.completedPracticals).toContain("prac-1-1");
    expect(passRes.progressItem.practicalSubmissions["prac-1-1"].passed).toBe(true);
  });
});
