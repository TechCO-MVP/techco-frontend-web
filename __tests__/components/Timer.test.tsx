import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { Timer } from "@/components/";

describe("Timer Component", () => {
  it("should render the timer with the correct initial time", () => {
    render(<Timer duration={120} />);
    expect(screen.getByText("02:00")).toBeInTheDocument();
  });

  it("should count down and call onExpire when time reaches zero", () => {
    vi.useFakeTimers();
    const onExpire = vi.fn();

    render(<Timer duration={3} onExpire={onExpire} />);

    expect(screen.getByText("00:03")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText("00:02")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onExpire).toHaveBeenCalledTimes(1);
    expect(screen.getByText("00:00")).toBeInTheDocument();

    vi.useRealTimers();
  });

  it("should stop decrementing when unmounted", () => {
    vi.useFakeTimers();
    const onExpire = vi.fn();

    const { unmount } = render(<Timer duration={5} onExpire={onExpire} />);
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    unmount();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(onExpire).not.toHaveBeenCalled();

    vi.useRealTimers();
  });
});
