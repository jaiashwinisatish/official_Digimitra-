import { describe, it, expect, beforeEach } from "vitest";
import { createCertificatePDF } from "@/utils/certificatePdf";
import API from "@/services/api";
import { saveUserProgress, INITIAL_MOCK_COURSES } from "@/data/mockCourses";

describe("Certificate PDF Generation Flow", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should create a valid PDF blob with certificate metadata", () => {
    const pdfBlob = createCertificatePDF({
      studentName: "Sneha Patil",
      studentClass: "Class 9th",
      courseTitle: "Introduction to Computers",
      certificateId: "CERT-DIGI-123456-C1",
      completionDate: "November 5, 2026",
    });

    expect(pdfBlob).toBeDefined();
    expect(pdfBlob instanceof Blob).toBe(true);
    expect(pdfBlob.size).toBeGreaterThan(1000); // Standard PDF has header, fonts, drawing commands
    expect(pdfBlob.type).toBe("application/pdf");
  });

  it("should reject certificate download if course is not 100% completed", async () => {
    const user = { _id: "user-test-1", name: "Student 1", studentClass: "Class 9th" };
    localStorage.setItem("userInfo", JSON.stringify(user));

    await expect(API.get("/certificate/course-1")).rejects.toMatchObject({
      response: {
        status: 403,
        data: {
          message: expect.stringContaining("locked"),
        },
      },
    });
  });

  it("should return a PDF blob from API.get('/certificate/:id') when course is 100% completed", async () => {
    const user = { _id: "user-test-2", name: "Rohan Kadam", studentClass: "Class 10th" };
    localStorage.setItem("userInfo", JSON.stringify(user));

    const course = INITIAL_MOCK_COURSES[0];
    const totalLessons = course.lessons?.map((l: any) => l._id || l.id) || [];
    const totalPracticals = course.practicalTasks?.map((p: any) => p._id || p.id) || [];

    // Mark 100% complete
    saveUserProgress(user._id, [
      {
        courseId: course._id,
        completedLessons: totalLessons,
        completedPracticals: totalPracticals,
        progressPercentage: 100,
        lastWatchedLessonId: totalLessons[0],
        lastWatchedTime: 600,
      },
    ]);

    const res = await API.get(`/certificate/${course._id}`);
    expect(res.status).toBe(200);
    expect(res.data).toBeDefined();
    expect(res.data instanceof Blob).toBe(true);
    expect(res.data.type).toBe("application/pdf");
    expect(res.data.size).toBeGreaterThan(1000);
  });
});

