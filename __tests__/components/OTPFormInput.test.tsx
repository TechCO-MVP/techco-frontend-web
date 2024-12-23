import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useForm, FormProvider } from "react-hook-form";
import { OTPFormInput } from "@/components/OTPFormInput/OTPFormInput";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const OTPFormSchema = z.object({
  otp: z
    .string()
    .regex(/^\d{4}$/, "Invalid OTP format")
    .min(4, "OTP must be 4 digits"),
});

const getErrorMessage = vi.fn((msg?: string) => msg || "Error");

function TestForm({
  defaultValues = { otp: "" },
}: {
  defaultValues?: z.infer<typeof OTPFormSchema>;
}) {
  const form = useForm<z.infer<typeof OTPFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(OTPFormSchema),
    defaultValues,
  });

  const {
    control,
    formState: { errors, dirtyFields },
    handleSubmit,
  } = form;

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(() => {})}
        className="mb-4 flex w-full max-w-md flex-col items-center"
      >
        <OTPFormInput
          name="otp"
          label="Enter OTP"
          testId="otp-input"
          maxLength={4}
          control={control}
          errors={errors}
          dirtyFields={dirtyFields}
          getErrorMessage={getErrorMessage}
        />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}

describe("OTPFormInput", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders input with correct label and slots", () => {
    render(<TestForm />);

    const label = screen.getByText("Enter OTP");
    expect(label).toBeInTheDocument();

    // Check if all slots are rendered
    const slots = screen.getAllByTestId("otp-input");
    expect(slots).toHaveLength(1);
  });

  it("accepts user input in the OTP slots", async () => {
    render(<TestForm />);

    const otpInput = screen.getByTestId("otp-input");
    fireEvent.change(otpInput, { target: { value: "1234" } });

    expect(otpInput).toHaveValue("1234");
  });

  it("shows validation error when OTP is invalid", async () => {
    render(<TestForm />);

    const otpInput = screen.getByTestId("otp-input");
    const submitButton = screen.getByText("Submit");

    fireEvent.change(otpInput, { target: { value: "12a4" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid OTP format")).toBeInTheDocument();
    });
  });

  it("applies correct styles when OTP is valid", async () => {
    const { container } = render(<TestForm />);

    const otpInput = screen.getByTestId("otp-input");
    fireEvent.change(otpInput, { target: { value: "1234" } });

    await waitFor(() => {
      const validSlot = container.querySelector(".border-green-500");
      expect(validSlot).toBeInTheDocument();
    });
  });

  it("applies correct styles when OTP is invalid", async () => {
    const { container } = render(<TestForm />);

    const otpInput = screen.getByTestId("otp-input");
    fireEvent.change(otpInput, { target: { value: "abcd" } });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      const invalidSlot = container.querySelector(".border-red-500");
      expect(invalidSlot).toBeInTheDocument();
    });
  });

  it("calls getErrorMessage when OTP validation fails", async () => {
    render(<TestForm />);

    const otpInput = screen.getByTestId("otp-input");
    fireEvent.change(otpInput, { target: { value: "abcd" } });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(getErrorMessage).toHaveBeenCalledWith("Invalid OTP format");
    });
  });

  it("displays no error when OTP is valid", async () => {
    render(<TestForm />);

    const otpInput = screen.getByTestId("otp-input");
    fireEvent.change(otpInput, { target: { value: "1234" } });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText("Invalid OTP format")).not.toBeInTheDocument();
    });
  });
});
