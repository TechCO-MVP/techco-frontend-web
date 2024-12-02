import { getDictionary } from "@/get-dictionary";
import { Timer } from "@/components/Timer/Timer";
import React from "react";

interface OTPInstructionTextProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
}

/**
 *
 * A component that displays OTP instructions with a countdown timer.
 *
 */
export const OTPInstructionText: React.FC<
  Readonly<OTPInstructionTextProps>
> = ({ dictionary }) => {
  const strings = dictionary.signUp;
  return (
    <div>
      <p data-testid="otp-instructions">
        {strings.otpInstructions}
        {strings.otpTimerStart}
        {<Timer duration={120} />}
        {strings.otpTimerEnd}
      </p>
    </div>
  );
};
