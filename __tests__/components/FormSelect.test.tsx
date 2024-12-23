import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FormSelect } from "@/components/FormSelect/FormSelect";
import { describe, it, expect, vi } from "vitest";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const SignUpFormSchema = z.object({
  country: z.string().min(1, "Country is required"),
});

const getErrorMessage = vi.fn((msg?: string) => msg || "Error");

function TestForm({
  defaultValues = { country: "" },
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
        <FormSelect
          testId="country-select"
          name="country"
          label="Country"
          placeholder="Select your country"
          control={control}
          errors={errors}
          dirtyFields={dirtyFields}
          getErrorMessage={getErrorMessage}
          options={[
            { value: "us", label: "United States" },
            { value: "es", label: "Spain" },
            { value: "de", label: "Germany" },
          ]}
        />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}

describe("FormSelect", () => {
  it("renders the select component with correct label and placeholder", () => {
    render(<TestForm />);
    expect(screen.getByText("Country")).toBeInTheDocument();
    expect(screen.getByText("Select your country")).toBeInTheDocument();
  });

  it("shows validation error when no country is selected", async () => {
    render(<TestForm />);
    const submitButton = screen.getByText("Submit");

    fireEvent.click(submitButton);

    expect(await screen.findByText("Country is required")).toBeInTheDocument();
  });

  it("does not show error when a country is selected", async () => {
    render(<TestForm />);

    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);

    const option = screen.getByRole("option", { name: "Spain" });
    fireEvent.click(option);

    expect(screen.queryByText("Country is required")).not.toBeInTheDocument();
  });

  it("applies correct styles when a valid country is selected", async () => {
    render(<TestForm />);
    const trigger = screen.getByRole("combobox");

    fireEvent.click(trigger);
    const option = screen.getByRole("option", { name: "Spain" });
    fireEvent.click(option);

    await waitFor(() => {
      expect(trigger).toHaveClass(
        "border-green-500 focus-visible:ring-green-500",
        {
          exact: false,
        },
      );
    });
  });

  it("applies correct styles when there is an error", async () => {
    render(<TestForm />);
    const submitButton = screen.getByText("Submit");

    fireEvent.click(submitButton);

    await waitFor(() => {
      const formControl = screen.getByRole("combobox");
      expect(formControl).toHaveClass("border-red-500", { exact: false });
      expect(formControl).toHaveClass("focus-visible:ring-red-500", {
        exact: false,
      });
    });
  });

  it("calls the getErrorMessage function when there is an error", async () => {
    render(<TestForm />);
    const submitButton = screen.getByText("Submit");

    fireEvent.click(submitButton);

    expect(getErrorMessage).toHaveBeenCalledWith("Country is required");
  });
});
