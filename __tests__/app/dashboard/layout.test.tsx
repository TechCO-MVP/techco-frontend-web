import { render, screen } from "@testing-library/react";
import DashboardLayout from "@/app/[lang]/dashboard/layout";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Locale } from "@/i18n-config";
import { Suspense } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/lib/store/index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationProvider } from "@/lib/notification-provider";
// Mock the TopBar component
const mockCookieGet = vi.fn();
vi.mock("next/headers", () => ({
  cookies: () => ({
    get: mockCookieGet,
  }),
}));
vi.mock("@/components/TopBar/TopBar", () => ({
  TopBar: vi.fn(() => <div data-testid="mocked-topbar">Mocked TopBar</div>),
}));

const queryClient = new QueryClient();
describe("DashboardLayout", () => {
  beforeEach(() => {
    // Stub the environment variable
    vi.stubEnv("NEXT_PUBLIC_WEBSOCKET_URL", "wss://localhost");
  });

  afterEach(() => {
    // Restore all environment variables to their original values
    vi.unstubAllEnvs();
  });
  const renderWithProviders = (ui: React.ReactNode) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <Provider store={makeStore()}>{ui}</Provider>
        </NotificationProvider>
      </QueryClientProvider>,
    );
  };
  it("should use the stubbed NEXT_PUBLIC_WEBSOCKET_URL", () => {
    expect(process.env.NEXT_PUBLIC_WEBSOCKET_URL).toBe("wss://localhost");
  });
  it("renders the layout with children and the TopBar component", async () => {
    mockCookieGet.mockReturnValue({ value: "mock-token" });
    const mockChildren = <div data-testid="mock-children">Mock Children</div>;
    const params = { lang: "en" as Locale };

    renderWithProviders(
      <Suspense>
        <DashboardLayout params={Promise.resolve(params)}>
          {mockChildren}
        </DashboardLayout>
        ,
      </Suspense>,
    );

    const child = await screen.findByTestId("mock-children");
    expect(child).toBeInTheDocument();

    // Assert the layout structure
    const mainElement = screen.getByRole("main");
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass(
      "mx-auto flex w-full max-w-[90%] flex-1 overflow-hidden py-4",
    );
  });
});
