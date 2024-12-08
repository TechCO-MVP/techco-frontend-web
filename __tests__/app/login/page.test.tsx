import { render, screen } from "@testing-library/react";
import Login from "@/app/[lang]/login/page";
import { describe, it, expect } from "vitest";

describe("Login Page", () => {
  it("renders the login form correctly", () => {
    render(<Login />);

    // Check if essential elements are rendered
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute(
      "href",
      "/signup",
    );
  });
});
