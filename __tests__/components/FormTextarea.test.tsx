import { render, screen, fireEvent } from "@testing-library/react";
import { FormTextarea } from "@/components/FormTextarea/FormTextarea";
import { describe, it, expect, vi } from "vitest";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const SignUpFormSchema = z.object({
  description: z.string().min(5, "Invalid description"),
});

const getErrorMessage = vi.fn((msg?: string) => msg || "Error");

function TestForm({
  defaultValues = { description: "" },
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
        <FormTextarea
          testId="description-input"
          name="description"
          label="Email"
          placeholder="Enter your description"
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

describe("FormTextarea", () => {
  it("renders input with correct label and placeholder", () => {
    render(<TestForm />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your description"),
    ).toBeInTheDocument();
  });

  it("shows validation error when description is invalid", async () => {
    render(<TestForm />);
    const input = screen.getByPlaceholderText("Enter your description");
    fireEvent.change(input, { target: { value: "inv" } });
    fireEvent.blur(input);

    expect(await screen.findByText("Invalid description")).toBeInTheDocument();
  });

  it("does not show error when description is valid", async () => {
    render(<TestForm />);
    const input = screen.getByPlaceholderText("Enter your description");
    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.blur(input);

    expect(screen.queryByText("Invalid description")).not.toBeInTheDocument();
  });

  it("applies correct styles when input is valid", async () => {
    render(<TestForm />);
    const input = screen.getByPlaceholderText("Enter your description");
    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.blur(input);

    expect(input).toHaveClass("border-green-500 focus-visible:ring-green-500");
  });

  it("applies correct styles when input is invalid", async () => {
    render(<TestForm />);
    const input = screen.getByPlaceholderText("Enter your description");

    fireEvent.change(input, { target: { value: "inv" } });

    fireEvent.blur(input);
    expect(await screen.findByText("Invalid description")).toBeInTheDocument();
    expect(input).toHaveClass("border-red-500", { exact: false });
    expect(input).toHaveClass("focus-visible:ring-red-500", { exact: false });
  });

  it("calls the getErrorMessage function when there is an error", async () => {
    render(<TestForm />);
    const input = screen.getByPlaceholderText("Enter your description");

    fireEvent.change(input, { target: { value: "inv" } });
    fireEvent.blur(input);

    expect(getErrorMessage).toHaveBeenCalledWith("Invalid description");
  });
});
