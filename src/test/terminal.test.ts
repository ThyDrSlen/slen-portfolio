import { describe, it, expect, beforeEach } from "vitest";
import { executeCommand, createInitialState, UPTIME_PLACEHOLDER } from "@/lib/terminal";
import type { TerminalState } from "@/lib/terminal";
import { terminalConfig, virtualFs } from "@/content/system";

// Helper to extract the last output line(s) from a result
function lastOutput(state: TerminalState) {
  return state.output.at(-1);
}

function outputLines(state: TerminalState) {
  // Return all output lines that are not the echoed input prompt
  return state.output.filter((l) => l.type !== "input");
}

describe("executeCommand", () => {
  let initial: TerminalState;

  beforeEach(() => {
    initial = createInitialState();
  });

  // ── Empty / blank input ──────────────────────────────────────────────────

  describe("empty input", () => {
    it("returns the same state object when input is empty", () => {
      const result = executeCommand(initial, "");
      expect(result.state).toBe(initial);
    });

    it("returns the same state object when input is only whitespace", () => {
      const result = executeCommand(initial, "   ");
      expect(result.state).toBe(initial);
    });
  });

  // ── help ─────────────────────────────────────────────────────────────────

  describe("help", () => {
    it("returns a list of available commands", () => {
      const { state } = executeCommand(initial, "help");
      const lines = outputLines(state);
      expect(lines.length).toBeGreaterThan(0);
      // Every help line should mention a command name
      const allText = lines.map((l) => l.text).join("\n");
      expect(allText).toContain("ls");
      expect(allText).toContain("cd");
      expect(allText).toContain("cat");
      expect(allText).toContain("pwd");
      expect(allText).toContain("clear");
    });

    it("each help line is of type 'system'", () => {
      const { state } = executeCommand(initial, "help");
      const lines = outputLines(state);
      for (const line of lines) {
        expect(line.type).toBe("system");
      }
    });

    it("adds the command to history", () => {
      const { state } = executeCommand(initial, "help");
      expect(state.history).toContain("help");
    });

    it("echoes the prompt + input as an 'input' line", () => {
      const { state } = executeCommand(initial, "help");
      const inputLine = state.output.find((l) => l.type === "input");
      expect(inputLine).toBeDefined();
      expect(inputLine!.text).toBe(`${terminalConfig.prompt}help`);
    });
  });

  // ── pwd ──────────────────────────────────────────────────────────────────

  describe("pwd", () => {
    it("returns '~' as the initial working directory", () => {
      const { state } = executeCommand(initial, "pwd");
      const out = outputLines(state);
      expect(out).toHaveLength(1);
      expect(out[0].text).toBe("~");
      expect(out[0].type).toBe("output");
    });

    it("returns the updated cwd after cd", () => {
      const { state: afterCd } = executeCommand(initial, "cd work");
      const { state } = executeCommand(afterCd, "pwd");
      const out = outputLines(state);
      expect(out.at(-1)!.text).toBe("work");
    });
  });

  // ── ls ───────────────────────────────────────────────────────────────────

  describe("ls", () => {
    it("lists root-level entries from the virtual filesystem", () => {
      const { state } = executeCommand(initial, "ls");
      const out = outputLines(state);
      expect(out).toHaveLength(1);
      expect(out[0].type).toBe("output");
      // Root entries from virtualFs (excluding "~")
      const rootKeys = Object.keys(virtualFs).filter((k) => k !== "~");
      for (const key of rootKeys) {
        // Directories get a trailing slash, files don't — check the key itself is present
        expect(out[0].text).toContain(key);
      }
    });

    it("appends '/' to directory entries", () => {
      const { state } = executeCommand(initial, "ls");
      const out = outputLines(state);
      // 'work' is a directory in the virtual fs
      expect(out[0].text).toContain("work/");
    });

    it("does NOT append '/' to file entries", () => {
      const { state } = executeCommand(initial, "ls");
      const out = outputLines(state);
      // 'about' and 'resume' are string values (files)
      expect(out[0].text).toMatch(/\babout\b(?!\/)/);
    });

    it("lists contents of a subdirectory when given a path arg", () => {
      const { state } = executeCommand(initial, "ls work");
      const out = outputLines(state);
      expect(out).toHaveLength(1);
      expect(out[0].text).toContain("form-factor");
      expect(out[0].text).toContain("palo-alto");
    });

    it("returns an error for a non-existent directory", () => {
      const { state } = executeCommand(initial, "ls nonexistent");
      const out = outputLines(state);
      expect(out).toHaveLength(1);
      expect(out[0].type).toBe("error");
      expect(out[0].text).toContain("nonexistent");
    });

    it("adds the command to history", () => {
      const { state } = executeCommand(initial, "ls");
      expect(state.history).toContain("ls");
    });
  });

  // ── cd ───────────────────────────────────────────────────────────────────

  describe("cd", () => {
    it("changes cwd to 'work' and emits a navigate signal", () => {
      const result = executeCommand(initial, "cd work");
      expect(result.state.cwd).toBe("work");
      expect(result.navigate).toBe("/work");
    });

    it("changes cwd to 'about' and emits a navigate signal", () => {
      const result = executeCommand(initial, "cd about");
      expect(result.navigate).toBe("/about");
    });

    it("cd with no argument resets cwd to '~'", () => {
      const { state: inWork } = executeCommand(initial, "cd work");
      const result = executeCommand(inWork, "cd");
      expect(result.state.cwd).toBe("~");
    });

    it("cd ~ resets cwd to '~'", () => {
      const { state: inWork } = executeCommand(initial, "cd work");
      const result = executeCommand(inWork, "cd ~");
      expect(result.state.cwd).toBe("~");
    });

    it("cd .. from a subdirectory goes back to '~'", () => {
      const { state: inWork } = executeCommand(initial, "cd work");
      const result = executeCommand(inWork, "cd ..");
      expect(result.state.cwd).toBe("~");
    });

    it("cd .. at root stays at '~'", () => {
      const result = executeCommand(initial, "cd ..");
      expect(result.state.cwd).toBe("~");
    });

    it("returns an error for an invalid directory", () => {
      const result = executeCommand(initial, "cd /invalid");
      const out = outputLines(result.state);
      expect(out).toHaveLength(1);
      expect(out[0].type).toBe("error");
      expect(out[0].text).toContain("no such file or directory");
    });

    it("returns an error for a path that resolves to a file, not a directory", () => {
      const result = executeCommand(initial, "cd about");
      // 'about' has a navigate special case — let's use 'resume' which is just a file
      const result2 = executeCommand(initial, "cd resume");
      const out = outputLines(result2.state);
      expect(out[0].type).toBe("error");
    });

    it("adds the command to history", () => {
      const { state } = executeCommand(initial, "cd work");
      expect(state.history).toContain("cd work");
    });
  });

  // ── cat ──────────────────────────────────────────────────────────────────

  describe("cat", () => {
    it("returns the content of a top-level file", () => {
      const { state } = executeCommand(initial, "cat about");
      const out = outputLines(state);
      expect(out).toHaveLength(1);
      expect(out[0].type).toBe("output");
      expect(out[0].text).toBe(virtualFs.about as string);
    });

    it("returns the content of a nested file", () => {
      const { state } = executeCommand(initial, "cat work/form-factor");
      const out = outputLines(state);
      expect(out).toHaveLength(1);
      expect(out[0].type).toBe("output");
      expect(typeof out[0].text).toBe("string");
      expect(out[0].text.length).toBeGreaterThan(0);
    });

    it("returns an error for a nonexistent file", () => {
      const { state } = executeCommand(initial, "cat nonexistent.txt");
      const out = outputLines(state);
      expect(out).toHaveLength(1);
      expect(out[0].type).toBe("error");
      expect(out[0].text).toContain("No such file or directory");
    });

    it("returns an error when catting a directory", () => {
      const { state } = executeCommand(initial, "cat work");
      const out = outputLines(state);
      expect(out).toHaveLength(1);
      expect(out[0].type).toBe("error");
      expect(out[0].text).toContain("Is a directory");
    });

    it("returns an error when no operand is given", () => {
      const { state } = executeCommand(initial, "cat");
      const out = outputLines(state);
      expect(out).toHaveLength(1);
      expect(out[0].type).toBe("error");
      expect(out[0].text).toContain("missing file operand");
    });

    it("resolves relative paths from cwd", () => {
      const { state: inWork } = executeCommand(initial, "cd work");
      const { state } = executeCommand(inWork, "cat form-factor");
      const out = outputLines(state);
      expect(out.at(-1)!.type).toBe("output");
      expect(out.at(-1)!.text).toContain("Form Factor");
    });

    it("adds the command to history", () => {
      const { state } = executeCommand(initial, "cat about");
      expect(state.history).toContain("cat about");
    });
  });

  // ── clear ────────────────────────────────────────────────────────────────

  describe("clear", () => {
    it("returns an empty output array", () => {
      // First add some output
      const { state: withOutput } = executeCommand(initial, "help");
      expect(withOutput.output.length).toBeGreaterThan(0);

      const result = executeCommand(withOutput, "clear");
      expect(result.state.output).toHaveLength(0);
    });

    it("does NOT add 'clear' to history", () => {
      const result = executeCommand(initial, "clear");
      // clear uses { clear: true } but does NOT pass { history } so history is not updated
      expect(result.state.history).not.toContain("clear");
    });

    it("preserves the cwd", () => {
      const { state: inWork } = executeCommand(initial, "cd work");
      const result = executeCommand(inWork, "clear");
      expect(result.state.cwd).toBe("work");
    });
  });

  // ── whoami ───────────────────────────────────────────────────────────────

  describe("whoami", () => {
    it("returns visitor information", () => {
      const { state } = executeCommand(initial, "whoami");
      const out = outputLines(state);
      expect(out).toHaveLength(1);
      expect(out[0].type).toBe("output");
      expect(out[0].text).toContain("visitor");
    });

    it("mentions privacy / no tracking", () => {
      const { state } = executeCommand(initial, "whoami");
      const out = outputLines(state);
      expect(out[0].text.toLowerCase()).toContain("privacy");
    });

    it("adds the command to history", () => {
      const { state } = executeCommand(initial, "whoami");
      expect(state.history).toContain("whoami");
    });
  });

  // ── unknown command ──────────────────────────────────────────────────────

  describe("unknown command", () => {
    it("returns a 'command not found' error", () => {
      const { state } = executeCommand(initial, "frobnicator");
      const out = outputLines(state);
      expect(out).toHaveLength(1);
      expect(out[0].type).toBe("error");
      expect(out[0].text).toContain("command not found");
      expect(out[0].text).toContain("frobnicator");
    });

    it("suggests typing help", () => {
      const { state } = executeCommand(initial, "frobnicator");
      const out = outputLines(state);
      expect(out[0].text).toContain("help");
    });

    it("adds the unknown command to history", () => {
      const { state } = executeCommand(initial, "frobnicator");
      expect(state.history).toContain("frobnicator");
    });
  });

  // ── uptime ───────────────────────────────────────────────────────────────

  describe("uptime", () => {
    it("returns the uptime placeholder token", () => {
      const { state } = executeCommand(initial, "uptime");
      const out = outputLines(state);
      expect(out).toHaveLength(1);
      expect(out[0].text).toBe(UPTIME_PLACEHOLDER);
    });
  });

  // ── echo ─────────────────────────────────────────────────────────────────

  describe("echo", () => {
    it("echoes the argument back", () => {
      const { state } = executeCommand(initial, "echo hello world");
      const out = outputLines(state);
      expect(out).toHaveLength(1);
      expect(out[0].text).toBe("hello world");
      expect(out[0].type).toBe("output");
    });

    it("echoes an empty string when no argument given", () => {
      const { state } = executeCommand(initial, "echo");
      const out = outputLines(state);
      expect(out).toHaveLength(1);
      expect(out[0].text).toBe("");
    });
  });

  // ── history ──────────────────────────────────────────────────────────────

  describe("history", () => {
    it("lists previously executed commands in order", () => {
      const s1 = executeCommand(initial, "pwd").state;
      const s2 = executeCommand(s1, "ls").state;
      const { state } = executeCommand(s2, "history");
      const out = outputLines(state);
      // history now has: pwd, ls, history
      expect(out.map((l) => l.text)).toContain("1  pwd");
      expect(out.map((l) => l.text)).toContain("2  ls");
      expect(out.map((l) => l.text)).toContain("3  history");
    });
  });

  // ── neofetch ─────────────────────────────────────────────────────────────

  describe("neofetch", () => {
    it("returns multiple system info lines of type 'system'", () => {
      const { state } = executeCommand(initial, "neofetch");
      const out = outputLines(state);
      expect(out.length).toBeGreaterThan(0);
      for (const line of out) {
        expect(line.type).toBe("system");
      }
    });

    it("includes the hostname", () => {
      const { state } = executeCommand(initial, "neofetch");
      const allText = outputLines(state)
        .map((l) => l.text)
        .join("\n");
      expect(allText).toContain("slen.win");
    });
  });

  // ── easter eggs ──────────────────────────────────────────────────────────

  describe("easter eggs", () => {
    it("sudo returns permission denied", () => {
      const { state } = executeCommand(initial, "sudo");
      const out = outputLines(state);
      expect(out[0].type).toBe("system");
      expect(out[0].text).toContain("Permission denied");
    });

    it("vim returns a vim joke", () => {
      const { state } = executeCommand(initial, "vim");
      const out = outputLines(state);
      expect(out[0].type).toBe("system");
      expect(out[0].text.toLowerCase()).toContain("vim");
    });

    it("easter eggs are case-insensitive", () => {
      const lower = executeCommand(initial, "sudo");
      const upper = executeCommand(initial, "SUDO");
      const outLower = outputLines(lower.state).map((l) => l.text);
      const outUpper = outputLines(upper.state).map((l) => l.text);
      expect(outLower).toEqual(outUpper);
    });
  });

  // ── state immutability / chaining ────────────────────────────────────────

  describe("state management", () => {
    it("does not mutate the original state", () => {
      const snapshot = JSON.stringify(initial);
      executeCommand(initial, "ls");
      expect(JSON.stringify(initial)).toBe(snapshot);
    });

    it("history grows correctly across multiple commands", () => {
      const s1 = executeCommand(initial, "pwd").state;
      const s2 = executeCommand(s1, "ls").state;
      const s3 = executeCommand(s2, "whoami").state;
      expect(s3.history).toEqual(["pwd", "ls", "whoami"]);
    });

    it("output accumulates across commands", () => {
      const s1 = executeCommand(initial, "pwd").state;
      const s2 = executeCommand(s1, "ls").state;
      // Each command adds at least 1 input echo + 1 output line
      expect(s2.output.length).toBeGreaterThan(s1.output.length);
    });
  });

  // ── createInitialState ───────────────────────────────────────────────────

  describe("createInitialState", () => {
    it("starts with cwd '~'", () => {
      expect(createInitialState().cwd).toBe("~");
    });

    it("starts with empty history", () => {
      expect(createInitialState().history).toEqual([]);
    });

    it("starts with empty output", () => {
      expect(createInitialState().output).toEqual([]);
    });

    it("returns a fresh object each time", () => {
      const a = createInitialState();
      const b = createInitialState();
      expect(a).not.toBe(b);
    });
  });
});
