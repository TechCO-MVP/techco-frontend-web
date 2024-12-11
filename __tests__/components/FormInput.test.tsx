import { render, screen, fireEvent } from "@testing-library/react";
import { FormInput } from "@/components/FormInput/FormInput";
import { describe, it, expect, vi } from "vitest";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const SignUpFormSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const getErrorMessage = vi.fn((msg?: string) => msg || "Error");

function TestForm({
  defaultValues = { email: "" },
}: {
  defaultValues?: z.infer<typeof SignUpFormSchema>;
}) {
  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(SignUpFormSchema),
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
        <FormInput
          name="email"
          label="Email"
          placeholder="Enter your email"
          type="email"
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

describe("FormInput", () => {
  it("renders input with correct label and placeholder", () => {
    render(<TestForm />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
  });

  it("shows validation error when email is invalid", async () => {
    render(<TestForm />);
    const input = screen.getByPlaceholderText("Enter your email");
    fireEvent.change(input, { target: { value: "invalid-email" } });
    fireEvent.blur(input);

    expect(
      await screen.findByText("Invalid email address"),
    ).toBeInTheDocument();
  });

  it("does not show error when email is valid", async () => {
    render(<TestForm />);
    const input = screen.getByPlaceholderText("Enter your email");
    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.blur(input);

    expect(screen.queryByText("Invalid email address")).not.toBeInTheDocument();
  });

  it("applies correct styles when input is valid", async () => {
    render(<TestForm />);
    const input = screen.getByPlaceholderText("Enter your email");
    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.blur(input);

    expect(input).toHaveClass("border-green-500 focus-visible:ring-green-500");
  });

  it("applies correct styles when input is invalid", async () => {
    render(<TestForm />);
    const input = screen.getByPlaceholderText("Enter your email");

    fireEvent.change(input, { target: { value: "invalid-email" } });

    fireEvent.blur(input);
    expect(
      await screen.findByText("Invalid email address"),
    ).toBeInTheDocument();
    expect(input).toHaveClass("border-red-500", { exact: false });
    expect(input).toHaveClass("focus-visible:ring-red-500", { exact: false });
  });

  it("calls the getErrorMessage function when there is an error", async () => {
    render(<TestForm />);
    const input = screen.getByPlaceholderText("Enter your email");

    fireEvent.change(input, { target: { value: "invalid-email" } });
    fireEvent.blur(input);

    expect(getErrorMessage).toHaveBeenCalledWith("Invalid email address");
  });
});
