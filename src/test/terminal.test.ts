import { describe, expect, it } from "../../node_modules/vitest/dist/index.js";
import { easterEggs, terminalHelp, terminalConfig, virtualFs } from "@/content/system";
import {
  createInitialState,
  executeCommand,
  type TerminalLine,
  type TerminalState,
} from "@/lib/terminal";

function getNonInputLines(state: TerminalState): TerminalLine[] {
  return state.output.filter((line) => line.type !== "input");
}

function getLastNonInputLine(state: TerminalState): TerminalLine | undefined {
  return getNonInputLines(state).at(-1);
}

describe("executeCommand", () => {
  it("returns help output with the expected commands", () => {
    const result = executeCommand(createInitialState(), "help");
    const lines = getNonInputLines(result.state);

    expect(lines).toHaveLength(Object.keys(terminalHelp).length);
    expect(lines.map((line) => line.text)).toEqual(
      expect.arrayContaining([
        expect.stringContaining("help"),
        expect.stringContaining("ls"),
        expect.stringContaining("cd"),
        expect.stringContaining("cat"),
        expect.stringContaining("echo"),
      ])
    );
  });

  it("lists the root directory from home", () => {
    const result = executeCommand(createInitialState(), "ls");
    const line = getLastNonInputLine(result.state);

    expect(line).toEqual({ text: "about  work/  resume", type: "output" });
  });

  it("changes cwd when cd points to a valid directory", () => {
    const result = executeCommand(createInitialState(), "cd work");

    expect(result.state.cwd).toBe("work");
    expect(result.navigate).toBe("/work");
    expect(result.state.history).toEqual(["cd work"]);
  });

  it("returns an error when cd points to an invalid directory", () => {
    const result = executeCommand(createInitialState(), "cd missing-dir");

    expect(result.state.cwd).toBe("~");
    expect(getLastNonInputLine(result.state)).toEqual({
      text: "cd: no such file or directory: missing-dir",
      type: "error",
    });
  });

  it("returns to home when cd has no arguments", () => {
    const state: TerminalState = {
      ...createInitialState(),
      cwd: "work",
    };

    const result = executeCommand(state, "cd");

    expect(result.state.cwd).toBe("~");
    expect(getNonInputLines(result.state)).toEqual([]);
  });

  it("returns file contents for cat on a valid file", () => {
    const result = executeCommand(createInitialState(), "cat about");

    expect(getLastNonInputLine(result.state)).toEqual({
      text: virtualFs.about,
      type: "output",
    });
  });

  it("returns an error for cat on a missing file", () => {
    const result = executeCommand(createInitialState(), "cat missing-file");

    expect(getLastNonInputLine(result.state)).toEqual({
      text: "cat: missing-file: No such file or directory",
      type: "error",
    });
  });

  it("returns an error for cat on a directory", () => {
    const result = executeCommand(createInitialState(), "cat work");

    expect(getLastNonInputLine(result.state)).toEqual({
      text: "cat: work: Is a directory",
      type: "error",
    });
  });

  it("echoes argument text", () => {
    const result = executeCommand(createInitialState(), "echo hello terminal");

    expect(getLastNonInputLine(result.state)).toEqual({
      text: "hello terminal",
      type: "output",
    });
  });

  it("echo with no arguments returns an empty output line", () => {
    const result = executeCommand(createInitialState(), "echo");

    expect(getLastNonInputLine(result.state)).toEqual({ text: "", type: "output" });
  });

  it("history includes the current command when prior history is empty", () => {
    const result = executeCommand(createInitialState(), "history");

    expect(getNonInputLines(result.state)).toEqual([{ text: "1  history", type: "system" }]);
  });

  it("clear removes prior terminal output", () => {
    const populated = executeCommand(createInitialState(), "help").state;
    const cleared = executeCommand(populated, "clear");

    expect(populated.output.length).toBeGreaterThan(0);
    expect(cleared.state.output).toEqual([]);
  });

  it("returns the expected whoami output", () => {
    const result = executeCommand(createInitialState(), "whoami");

    expect(getLastNonInputLine(result.state)).toEqual({
      text: "visitor -- browsing slen.win from [no tracking, we respect privacy]",
      type: "output",
    });
  });

  it("prints the current working directory", () => {
    const state: TerminalState = {
      ...createInitialState(),
      cwd: "work",
    };

    const result = executeCommand(state, "pwd");

    expect(getLastNonInputLine(result.state)).toEqual({ text: "work", type: "output" });
  });

  it("returns a command-not-found error for unknown commands", () => {
    const result = executeCommand(createInitialState(), "foobar");

    expect(getLastNonInputLine(result.state)).toEqual({
      text: "command not found: foobar. Type 'help' for available commands.",
      type: "error",
    });
  });

  it("handles empty input without changing state", () => {
    const state = createInitialState();
    const result = executeCommand(state, "   ");

    expect(result.state).toBe(state);
    expect(result.navigate).toBeUndefined();
    expect(result.state.output).toEqual([]);
    expect(result.state.history).toEqual([]);
  });

  it.each<[string, string]>([
    ["sudo", easterEggs.sudo[0]],
    ["vim", easterEggs.vim[0]],
    ["coffee", easterEggs.coffee[0]],
    ["matrix", easterEggs.matrix[0]],
  ])("returns easter egg output for %s", (command: string, expected: string) => {
    const result = executeCommand(createInitialState(), command);

    expect(getLastNonInputLine(result.state)).toEqual({ text: expected, type: "system" });
  });

  it("prefixes input lines with the configured prompt", () => {
    const result = executeCommand(createInitialState(), "echo hi");

    expect(result.state.output[0]).toEqual({
      text: `${terminalConfig.prompt}echo hi`,
      type: "input",
    });
  });
});
