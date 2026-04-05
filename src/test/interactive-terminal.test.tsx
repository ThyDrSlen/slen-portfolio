import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InteractiveTerminal } from "@/components/home/InteractiveTerminal";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("InteractiveTerminal", () => {
  it("renders terminal with input and suggestion buttons", () => {
    render(<InteractiveTerminal />);

    expect(screen.getByTestId("terminal-input")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "help" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "neofetch" })).toBeInTheDocument();
  });

  it("executes a command and shows output", () => {
    render(<InteractiveTerminal />);

    const input = screen.getByTestId("terminal-input");
    fireEvent.change(input, { target: { value: "help" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(screen.getByTestId("terminal-output")).toHaveTextContent("Show this help message");
  });

  it("clears terminal with Ctrl+L", () => {
    render(<InteractiveTerminal />);

    const input = screen.getByTestId("terminal-input");
    fireEvent.change(input, { target: { value: "help" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByTestId("terminal-output")).toHaveTextContent("Show this help message");

    fireEvent.keyDown(input, { key: "l", ctrlKey: true });

    expect(screen.getByTestId("terminal-output")).not.toHaveTextContent("Show this help message");
  });

  it("navigates command history with arrow keys", () => {
    render(<InteractiveTerminal />);

    const input = screen.getByTestId("terminal-input");
    fireEvent.change(input, { target: { value: "help" } });
    fireEvent.keyDown(input, { key: "Enter" });
    fireEvent.keyDown(input, { key: "ArrowUp" });

    expect(input).toHaveValue("help");
  });

  it("shows tab completions", () => {
    render(<InteractiveTerminal />);

    const input = screen.getByTestId("terminal-input");
    fireEvent.change(input, { target: { value: "he" } });
    fireEvent.keyDown(input, { key: "Tab" });

    expect(input).toHaveValue("help");
  });
});
