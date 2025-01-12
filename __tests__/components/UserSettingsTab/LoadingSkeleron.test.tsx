import { render } from "@testing-library/react";
import LoadingSkeleton from "@/components/UserSettingsTab/LoadingSkeleton";
import { describe, it, expect } from "vitest";

describe("LoadingSkeleton", () => {
  it("renders correctly", () => {
    const { container } = render(<LoadingSkeleton />);
    expect(container).toMatchSnapshot();
  });
});
