import { Timer } from "@/components/Timer/Timer";
import React from "react";
import { Dictionary } from "@/types/i18n";

interface OTPInstructionTextProps {
  dictionary: Dictionary;
  onExpire?: () => void;
}

/**
 *
 * A component that displays OTP instructions with a countdown timer.
 *
 */
export const OTPInstructionText: React.FC<
  Readonly<OTPInstructionTextProps>
> = ({ dictionary, onExpire }) => {
  const { otpPage: i18n } = dictionary;
  return (
    <div>
      <p className="text-center" data-testid="otp-instructions">
        {i18n.otpInstructions}
        <span className="font-bold">
          {i18n.otpTimerStart}
          {<Timer onExpire={onExpire} duration={120} />}
          {i18n.otpTimerMinutes}
        </span>
        {i18n.otpTimerEnd}
      </p>
    </div>
  );
};
