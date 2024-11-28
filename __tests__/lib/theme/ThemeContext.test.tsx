import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { ThemeProvider, useTheme } from "@/lib/theme/ThemeContext";

// Helper component to test `useTheme` hook
const TestComponent = () => {
  const { setTheme } = useTheme();
  return (
    <button onClick={() => setTheme({ background: "#000", primary: "#fff" })}>
      Change Theme
    </button>
  );
};

describe("ThemeContext", () => {
  beforeEach(() => {
    document.documentElement.style.cssText = "";
  });

  it("should provide `setTheme` function via context", () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    const button = screen.getByText("Change Theme");
    expect(button).toBeInTheDocument();

    button.click();
    expect(
      document.documentElement.style.getPropertyValue("--background"),
    ).toBe("#000");
    expect(document.documentElement.style.getPropertyValue("--primary")).toBe(
      "#fff",
    );
  });

  it("should throw an error if `useTheme` is used outside of `ThemeProvider`", () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrowErrorMatchingInlineSnapshot(
      `[Error: useTheme must be used within a ThemeProvider]`,
    );

    consoleErrorSpy.mockRestore();
  });

  it("should not overwrite unrelated styles when updating theme", () => {
    document.documentElement.style.setProperty("--custom", "value");

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    const button = screen.getByText("Change Theme");
    button.click();

    expect(document.documentElement.style.getPropertyValue("--custom")).toBe(
      "value",
    );
  });
});
