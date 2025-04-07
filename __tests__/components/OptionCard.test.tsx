import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { OptionCard } from "@/components/OptionCard/OptionCard";
import { LucideUser } from "lucide-react";

describe("OptionCard", () => {
  const baseProps = {
    icon: <LucideUser data-testid="icon" />,
    title: "Example Title",
    description: "This is a short description.",
    selectBtnLabel: "Select Me",
  };

  it("renders the icon, title, description, and button", () => {
    render(<OptionCard {...baseProps} />);

    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByText("Example Title")).toBeInTheDocument();
    expect(
      screen.getByText("This is a short description."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Select Me" }),
    ).toBeInTheDocument();
  });

  it("renders the details if provided", () => {
    render(<OptionCard {...baseProps} details="Extra details here." />);

    expect(screen.getByText("Extra details here.")).toBeInTheDocument();
  });

  it("does not render details if not provided", () => {
    render(<OptionCard {...baseProps} />);

    expect(screen.queryByText("Extra details here.")).not.toBeInTheDocument();
  });

  it("calls the onClick handler when the button is clicked", () => {
    const handleClick = vi.fn();
    render(<OptionCard {...baseProps} onClick={handleClick} />);

    const button = screen.getByRole("button", { name: "Select Me" });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalled();
  });
});
