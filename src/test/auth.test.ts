import { describe, it, expect, beforeEach } from "vitest";
import API from "@/services/api";

describe("Student Registration and Authentication Flow", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should successfully register a student even when remote auth is unavailable", async () => {
    const studentData = {
      name: "Sneha Patil",
      email: "sneha@example.com",
      mobile: "9876543210",
      studentClass: "Class 9th",
      password: "password123",
      languagePreference: "en",
    };

    const res = await API.post("/auth/register", studentData);
    expect(res.status).toBe(200);
    expect(res.data).toBeDefined();
    expect(res.data.name).toBe("Sneha Patil");
    expect(res.data.email).toBe("sneha@example.com");
    expect(res.data.mobile).toBe("9876543210");
    expect(res.data.studentClass).toBe("Class 9th");
    expect(res.data.role).toBe("student");
    expect(res.data.token).toBeDefined();

    // Verify stored in localStorage
    const savedUsers = JSON.parse(localStorage.getItem("digimitra_users") || "[]");
    expect(savedUsers.length).toBe(1);
    expect(savedUsers[0].email).toBe("sneha@example.com");
    expect(savedUsers[0].name).toBe("Sneha Patil");
  });

  it("should reject registration if email is already registered", async () => {
    const studentData = {
      name: "Sneha Patil",
      email: "sneha@example.com",
      mobile: "9876543210",
      studentClass: "Class 9th",
      password: "password123",
      languagePreference: "en",
    };

    // First registration
    await API.post("/auth/register", studentData);

    // Second registration with same email (even with different casing)
    await expect(
      API.post("/auth/register", { ...studentData, email: "SNEHA@EXAMPLE.COM" })
    ).rejects.toMatchObject({
      response: {
        data: {
          message: expect.stringContaining("already exists"),
        },
      },
    });
  });

  it("should allow the registered student to log in successfully (case-insensitive email)", async () => {
    const studentData = {
      name: "Rohan Kadam",
      email: "rohan@example.com",
      mobile: "9876543211",
      studentClass: "Class 10th",
      password: "securePassword123",
      languagePreference: "mr",
    };

    await API.post("/auth/register", studentData);

    // Login with uppercase/mixed case email
    const loginRes = await API.post("/auth/login", {
      email: "Rohan@Example.com ",
      password: "securePassword123",
    });

    expect(loginRes.status).toBe(200);
    expect(loginRes.data.name).toBe("Rohan Kadam");
    expect(loginRes.data.email).toBe("rohan@example.com");
  });

  it("should fail login with invalid password", async () => {
    const studentData = {
      name: "Rohan Kadam",
      email: "rohan@example.com",
      mobile: "9876543211",
      studentClass: "Class 10th",
      password: "securePassword123",
      languagePreference: "mr",
    };

    await API.post("/auth/register", studentData);

    await expect(
      API.post("/auth/login", {
        email: "rohan@example.com",
        password: "wrongPassword",
      })
    ).rejects.toMatchObject({
      response: {
        data: {
          message: expect.stringContaining("Invalid email or password"),
        },
      },
    });
  });

  it("should enroll student into a course and update storage", async () => {
    const regRes = await API.post("/auth/register", {
      name: "Amit Shinde",
      email: "amit@example.com",
      mobile: "9876543212",
      studentClass: "Class 8th",
      password: "password123",
    });

    // Mock session user in localStorage
    localStorage.setItem("userInfo", JSON.stringify(regRes.data));

    const enrollRes = await API.post("/courses/course-3/enroll", { courseId: "course-3" });
    expect(enrollRes.status).toBe(200);

    const updatedUserInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    expect(updatedUserInfo.enrolledCourses).toContain("course-3");
  });
});

