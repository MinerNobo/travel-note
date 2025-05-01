import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Index from "./index";

vi.mock("@tarojs/components", () => {
  return {
    View: ({ className, children }: { className?: string; children?: React.ReactNode }) => (
      <div className={className}>{children}</div>
    ),
    Text: ({ children }: { children?: React.ReactNode }) => <span>{children}</span>,
  };
});

vi.mock("@tarojs/taro", () => {
  return {
    useLoad: (callback: () => void) => {
      vi.fn(callback);
    },
  };
});

describe("Index", () => {
  it("renders hello world text", () => {
    render(<Index />);
    expect(screen.getByText(/Hello world!/i)).toBeInTheDocument();
  });

  it("has the correct class name", () => {
    render(<Index />);
    const element = screen.getByText(/Hello world!/i).parentElement;
    expect(element).toHaveClass("index");
  });
});
