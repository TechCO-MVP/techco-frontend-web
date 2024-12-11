import { describe, it, expect, vi } from "vitest";
import { signUp } from "@/actions/sign-up";
import { SignUpFormData } from "@/lib/schemas";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("signUp", () => {
  it("returns form data as expected", async () => {
    const formData: SignUpFormData = {
      email: "test@example.com",
      company: "Test Corp",
      country: "Spain",
      companySize: "Small",
      role: "Developer",
    };

    const result = await signUp(formData);

    // Check if the function returns the correct data
    expect(result).toEqual(formData);
  });
});
