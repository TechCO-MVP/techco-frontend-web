import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useForm, FormProvider } from "react-hook-form";
import { FormCombobox } from "@/components/FormCombobox/FormCombobox";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

vi.stubGlobal(
  "ResizeObserver",
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
);

Element.prototype.scrollIntoView = vi.fn();

const SignUpSchema = z.object({
  country: z.string().min(1, "Country is required"),
});

const getErrorMessage = vi.fn((msg?: string) => msg || "Error");

function TestForm({
  defaultValues = { country: "" },
}: {
  defaultValues?: z.infer<typeof SignUpSchema>;
}) {
  const form = useForm<z.infer<typeof SignUpSchema>>({
    mode: "onChange",
    resolver: zodResolver(SignUpSchema),
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
        <FormCombobox
          testId="country-select-trigger"
          name="country"
          label="Country"
          placeholder="Select your country"
          searchPlaceholder="Search countries"
          noResultsMessage="No results found"
          control={control}
          errors={errors}
          dirtyFields={dirtyFields}
          getErrorMessage={getErrorMessage}
          options={[
            { value: "united-states", label: "United States" },
            { value: "spain", label: "Spain" },
            { value: "germany", label: "Germany" },
          ]}
        />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}

describe("FormCombobox", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders combobox with correct label and placeholder", () => {
    render(<TestForm />);

    expect(screen.getByText("Country")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveTextContent(
      "Select your country",
    );
  });

  it("opens the dropdown when the trigger is clicked", async () => {
    render(<TestForm />);
    const trigger = screen.getByTestId("country-select-trigger");

    fireEvent.click(trigger);

    expect(await screen.findByText("United States")).toBeInTheDocument();
    expect(await screen.findByText("Spain")).toBeInTheDocument();
    expect(await screen.findByText("Germany")).toBeInTheDocument();
  });

  it("selects an item when clicked", async () => {
    render(<TestForm />);
    const trigger = screen.getByTestId("country-select-trigger");

    fireEvent.click(trigger);

    const option = screen.getByText("Spain");
    fireEvent.click(option);

    expect(trigger).toHaveTextContent("Spain");
  });

  it("shows validation error when no item is selected", async () => {
    render(<TestForm />);
    const submitButton = screen.getByText("Submit");

    fireEvent.click(submitButton);

    expect(await screen.findByText("Country is required")).toBeInTheDocument();
  });

  it("applies correct styles when a valid item is selected", async () => {
    render(<TestForm />);
    const trigger = screen.getByTestId("country-select-trigger");

    fireEvent.click(trigger);
    fireEvent.click(screen.getByText("Spain"));

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
      const trigger = screen.getByTestId("country-select-trigger");
      expect(trigger).toHaveClass("border-red-500", { exact: false });
      expect(trigger).toHaveClass("focus-visible:ring-red-500", {
        exact: false,
      });
    });
  });

  it("calls getErrorMessage when there is an error", async () => {
    render(<TestForm />);
    const submitButton = screen.getByText("Submit");

    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(getErrorMessage).toHaveBeenCalledWith("Country is required");
    });
  });

  it("filters items when searching", async () => {
    render(<TestForm />);
    const trigger = screen.getByTestId("country-select-trigger");

    fireEvent.click(trigger);

    const searchInput = screen.getByPlaceholderText("Search countries");
    await fireEvent.change(searchInput, { target: { value: "Spain" } });
    await waitFor(async () => {
      expect(await screen.findByText("Spain")).toBeInTheDocument();
      expect(screen.queryByText("United States")).not.toBeInTheDocument();
      expect(screen.queryByText("Germany")).not.toBeInTheDocument();
    });
  });

  it("displays no results when no items match the search", async () => {
    render(<TestForm />);
    const trigger = screen.getByTestId("country-select-trigger");

    fireEvent.click(trigger);

    const searchInput = screen.getByPlaceholderText("Search countries");
    fireEvent.change(searchInput, { target: { value: "Nonexistent Country" } });

    expect(await screen.findByText("No results found")).toBeInTheDocument();
  });
});
