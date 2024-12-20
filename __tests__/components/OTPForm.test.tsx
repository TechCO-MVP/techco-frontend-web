import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Provider } from "react-redux";
import { OTPForm } from "@/components/OTPForm/OTPForm";
import { makeStore } from "@/lib/store";
import { Dictionary } from "@/types/i18n";
import { getDictionary } from "@/get-dictionary";
import mockRouter from "next-router-mock";

vi.mock(
  "next/navigation",
  async () => await vi.importActual("next-router-mock"),
);

vi.mock("@/actions", () => ({
  verifyCode: vi.fn(async () => ({
    success: true,
    message: "Code verified",
  })),
  signIn: vi.fn(async () => ({
    session: "mock-session-token",
    message: "New code sent!",
  })),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock ResizeObserver globally
vi.stubGlobal(
  "ResizeObserver",
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
);

const renderWithRedux = (ui: React.ReactNode) => {
  const store = makeStore();
  store.dispatch({
    type: "auth/setAuthState",
    payload: { email: "test@example.com", session: "mock-session" },
  });
  return render(<Provider store={store}>{ui}</Provider>);
};

let dictionary: Dictionary;

describe("OTPForm (Integration Tests)", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    dictionary = await getDictionary("es");
    mockRouter.setCurrentUrl("/code");
  });

  afterEach(() => {
    cleanup(); // Clean up after each test to avoid memory leaks
  });

  it("renders the form correctly", () => {
    renderWithRedux(<OTPForm dictionary={dictionary} />);

    expect(
      screen.getByText(dictionary.otpPage.formHeading),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(dictionary.otpPage.otpInputLabel),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: dictionary.otpPage.otpResendCode }),
    ).toBeDisabled();
  });

  it("successfully submits the form when the OTP is correct", async () => {
    const { verifyCode } = await import("@/actions");

    renderWithRedux(<OTPForm dictionary={dictionary} />);

    fireEvent.change(screen.getByTestId("otp-code-input"), {
      target: { value: "123456" },
    });

    await waitFor(() => {
      expect(verifyCode).toHaveBeenCalledWith({
        email: "test@example.com",
        session: "mock-session",
        code: "123456",
      });
      expect(mockRouter.pathname).toBe("/");
    });
  });

  it("displays an error message when submission fails", async () => {
    vi.mocked((await import("@/actions")).verifyCode).mockResolvedValueOnce({
      success: false,
      message: "Invalid OTP code",
    });

    renderWithRedux(<OTPForm dictionary={dictionary} />);

    fireEvent.change(screen.getByTestId("otp-code-input"), {
      target: { value: "654321" },
    });

    await waitFor(() => {
      expect(screen.getByText("Invalid OTP code")).toBeInTheDocument();
    });
  });
});
