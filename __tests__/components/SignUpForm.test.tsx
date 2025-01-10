import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SignUpForm } from "@/components/SignUpForm/SignUpForm";
import { getDictionary } from "@/get-dictionary";
import { Dictionary } from "@/types/i18n";
import { paths } from "@/lib/paths";
import mockRouter from "next-router-mock";
import { Provider } from "react-redux";
import { makeStore } from "@/lib/store/index";
vi.mock(
  "next/navigation",
  async () => await vi.importActual("next-router-mock"),
);

vi.mock("@/actions", () => ({
  signUp: vi.fn(async (data) => {
    return {
      success: true,
      data,
    };
  }),
  signIn: vi.fn(async (data) => {
    return { session: data };
  }),
}));

let dictionary: Dictionary;
describe("SignUpForm (Integration Tests)", () => {
  beforeEach(async () => {
    dictionary = await getDictionary("es");
    vi.clearAllMocks();
  });

  const renderWithRedux = (ui: React.ReactNode) => {
    return render(<Provider store={makeStore()}>{ui}</Provider>);
  };

  it("renders the form correctly", async () => {
    renderWithRedux(<SignUpForm dictionary={dictionary} />);

    expect(
      screen.getByText(dictionary.signUp.welcomeTitle),
    ).toBeInTheDocument();
    expect(
      screen.getByText(dictionary.signUp.welcomeMessage),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(dictionary.signUp.emailLabel),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(dictionary.signUp.companyLabel),
    ).toBeInTheDocument();
    expect(
      screen.getByText(dictionary.signUp.createAccountLabel),
    ).toBeInTheDocument();
  });

  it("disables the submit button when the form is invalid", () => {
    renderWithRedux(<SignUpForm dictionary={dictionary} />);
    const submitButton = screen.getByTestId("signup-submit-button");
    expect(submitButton).toBeDisabled();
  });

  it("displays validation errors when inputs are empty", async () => {
    renderWithRedux(<SignUpForm dictionary={dictionary} />);

    fireEvent.change(screen.getByTestId("signup-email-input"), {
      target: { value: "invalid.com" },
    });

    await waitFor(() => {
      expect(
        screen.getByText(dictionary.validationErrors.emailError),
      ).toBeInTheDocument();
    });
  });

  it("successfully submits the form when inputs are valid", async () => {
    const { signUp } = await import("@/actions");

    renderWithRedux(<SignUpForm dictionary={dictionary} />);

    fireEvent.change(screen.getByTestId("signup-name-input"), {
      target: { value: "User" },
    });

    fireEvent.change(screen.getByTestId("signup-email-input"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("signup-company-input"), {
      target: { value: "Test Corp" },
    });

    const trigger = screen.getByTestId("country-select-trigger");
    fireEvent.click(trigger);

    await waitFor(async () => {
      await fireEvent.change(
        screen.getByPlaceholderText(dictionary.signUp.countrySearchPlaceholder),
        {
          target: { value: "Spain" },
        },
      );
      await fireEvent.click(screen.getByText("🇪🇸 Spain"));
    });

    const companySizeSelect = screen.getByTestId("signup-company-select");
    fireEvent.click(companySizeSelect);
    const option = screen.getByRole("option", { name: "Entre 1 y 10" });
    fireEvent.click(option);

    const companyRoleSelect = screen.getByTestId("signup-role-select");
    fireEvent.click(companyRoleSelect);
    const role = screen.getByRole("option", { name: "Talent Recruiter" });
    fireEvent.click(role);
    const submitButton = screen.getByTestId("signup-submit-button");
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(signUp).toHaveBeenCalledWith({
        email: "test@example.com",
        name: "User",
        company: "Test Corp",
        country: "spain",
        companySize: "A",
        role: "Talent Recruiter",
      });
      expect(mockRouter.pathname).toBe(`/${paths.codeValidationSignUp()}`);
    });
  });
});
