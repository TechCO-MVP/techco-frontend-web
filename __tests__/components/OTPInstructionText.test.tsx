import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OTPInstructionText } from "@/components/";
import { getDictionary } from "@/get-dictionary";

describe("OTPInstructionText Component", () => {
  it("should render the OTP instructions with the timer", async () => {
    const dictionary = await getDictionary("en");

    render(<OTPInstructionText dictionary={dictionary} />);

    expect(screen.getByTestId("otp-instructions")).toHaveTextContent(
      `${dictionary.otpPage.otpInstructions}`,
    );
    expect(screen.getByTestId("otp-instructions")).toHaveTextContent(
      `${dictionary.otpPage.otpTimerStart}`,
    );
    expect(screen.getByTestId("otp-instructions")).toHaveTextContent(
      `${dictionary.otpPage.otpTimerEnd}`,
    );
  });
});
