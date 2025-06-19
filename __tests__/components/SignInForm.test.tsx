import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SignInForm } from "@/components/SignInForm/SignInForm";
import mockRouter from "next-router-mock";
import { paths } from "@/lib/paths";
import { Dictionary } from "@/types/i18n";
import { getDictionary } from "@/get-dictionary";
import { Provider } from "react-redux";
import { makeStore } from "@/lib/store/index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

vi.mock(
  "next/navigation",
  async () => await vi.importActual("next-router-mock"),
);

vi.mock("@/actions", () => ({
  signIn: vi.fn(async (data) => {
    return { session: data };
  }),
}));

let dictionary: Dictionary;

describe("SignInForm (Integration Tests)", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    dictionary = await getDictionary("es");

    mockRouter.setCurrentUrl("/");
  });

  const renderWithProviders = (ui: React.ReactNode) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <Provider store={makeStore()}>{ui}</Provider>
      </QueryClientProvider>,
    );
  };

  it("renders the form correctly", () => {
    renderWithProviders(<SignInForm dictionary={dictionary} />);
    expect(screen.getByText(dictionary.signIn.formTitle)).toBeInTheDocument();
    expect(
      screen.getByText(dictionary.signIn.formDescription),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(dictionary.signIn.emailLabel),
    ).toBeInTheDocument();
    expect(
      screen.getByText(dictionary.signIn.continueBtnText),
    ).toBeInTheDocument();
  });

  it("disables the submit button when the form is invalid", () => {
    renderWithProviders(<SignInForm dictionary={dictionary} />);

    const submitButton = screen.getByRole("button", {
      name: dictionary.signIn.continueBtnText,
    });

    expect(submitButton).toBeDisabled();
  });

  it("displays validation errors when inputs are empty or invalid", async () => {
    renderWithProviders(<SignInForm dictionary={dictionary} />);

    fireEvent.change(screen.getByTestId("signup-email-input"), {
      target: { value: "invalid-email" },
    });

    await waitFor(() => {
      expect(
        screen.getByText(dictionary.validationErrors.emailError),
      ).toBeInTheDocument();
    });
  });

  it("successfully submits the form when inputs are valid", async () => {
    const { signIn } = await import("@/actions");

    renderWithProviders(<SignInForm dictionary={dictionary} />);

    fireEvent.change(screen.getByTestId("signup-email-input"), {
      target: { value: "test@example.com" },
    });

    const submitButton = screen.getByRole("button", {
      name: dictionary.signIn.continueBtnText,
    });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(mockRouter.pathname).toBe(`/${paths.codeValidation()}`);
    });
  });

  it("renders the 'Create Account' link", () => {
    renderWithProviders(<SignInForm dictionary={dictionary} />);

    const link = screen.getByRole("link", {
      name: dictionary.signIn.createAccountLabel,
    });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "signup");
  });
});
