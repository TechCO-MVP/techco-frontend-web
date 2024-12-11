import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Heading } from "@/components/Typography/Heading";

describe("Heading", () => {
  it("renders default heading level 1", () => {
    render(<Heading>Test Heading</Heading>);

    const heading = screen.getByText("Test Heading");

    expect(heading.tagName).toBe("H1");
    expect(heading).toHaveClass("text-4xl font-bold");
  });

  it("renders the correct heading level when level is specified", () => {
    render(<Heading level={2}>Heading Level 2</Heading>);

    const heading = screen.getByText("Heading Level 2");

    expect(heading.tagName).toBe("H2");
    expect(heading).toHaveClass("text-3xl font-semibold");
  });

  it("applies custom class names", () => {
    render(<Heading className="custom-class">Custom Class Heading</Heading>);

    const heading = screen.getByText("Custom Class Heading");

    expect(heading).toHaveClass("custom-class");
  });

  it("renders heading level 3 with correct styles", () => {
    render(<Heading level={3}>Heading Level 3</Heading>);

    const heading = screen.getByText("Heading Level 3");

    expect(heading.tagName).toBe("H3");
    expect(heading).toHaveClass("text-2xl font-medium");
  });

  it("renders heading level 4 with correct styles", () => {
    render(<Heading level={4}>Heading Level 4</Heading>);

    const heading = screen.getByText("Heading Level 4");

    expect(heading.tagName).toBe("H4");
    expect(heading).toHaveClass("text-xl font-medium");
  });

  it("combines default and custom classes correctly", () => {
    render(
      <Heading level={2} className="custom-class text-red-500">
        Combined Classes
      </Heading>,
    );

    const heading = screen.getByText("Combined Classes");

    expect(heading).toHaveClass("text-3xl font-semibold");
    expect(heading).toHaveClass("custom-class");
    expect(heading).toHaveClass("text-red-500");
  });
});
