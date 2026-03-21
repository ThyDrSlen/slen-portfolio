import {
  easterEggs,
  neofetchOutput,
  terminalConfig,
  terminalHelp,
  virtualFs,
} from "@/content/system";

export type TerminalLine = {
  text: string;
  type: "input" | "output" | "error" | "system";
};

export type TerminalState = {
  cwd: string;
  history: string[];
  output: TerminalLine[];
};

const UPTIME_PLACEHOLDER = "__TERMINAL_UPTIME__";
const COMMANDS = Object.keys(terminalHelp);

type TerminalResult = {
  state: TerminalState;
  navigate?: string;
};

export function createInitialState(): TerminalState {
  return {
    cwd: "~",
    history: [],
    output: [],
  };
}

function formatEntries(entries: string[], currentPath?: string) {
  return entries.map((entry) => {
    const value = currentPath ? readPath(`${currentPath}/${entry}`) : virtualFs[entry];
    return typeof value === "string" ? entry : `${entry}/`;
  });
}

function normalizePath(path: string, cwd: string) {
  const trimmed = path.trim().replace(/^\/+/, "").replace(/\/$/, "");

  if (!trimmed || trimmed === "~") {
    return "~";
  }

  if (trimmed === "..") {
    return cwd === "~" ? "~" : "~";
  }

  if (trimmed.startsWith("~/")) {
    return trimmed.slice(2);
  }

  if (cwd !== "~" && !trimmed.includes("/")) {
    return `${cwd}/${trimmed}`;
  }

  return trimmed;
}

function readPath(path: string) {
  const normalized = normalizePath(path, "~");

  if (normalized === "~") {
    return virtualFs;
  }

  const segments = normalized.split("/").filter(Boolean);
  let current: string | Record<string, string | Record<string, string>> = virtualFs;

  for (const segment of segments) {
    if (typeof current !== "object" || !(segment in current)) {
      return undefined;
    }

    current = current[segment];
  }

  return current;
}

function listForCwd(cwd: string) {
  if (cwd === "~") {
    return formatEntries(Object.keys(virtualFs).filter((key) => key !== "~"));
  }

  const current = readPath(cwd);

  if (!current || typeof current === "string") {
    return [];
  }

  return formatEntries(Object.keys(current), cwd);
}

function withOutput(
  state: TerminalState,
  input: string,
  lines: TerminalLine[],
  options?: { cwd?: string; history?: string[]; clear?: boolean; navigate?: string }
): TerminalResult {
  const nextOutput: TerminalLine[] = options?.clear
    ? []
    : [...state.output, { text: `${terminalConfig.prompt}${input}`, type: "input" }, ...lines];

  return {
    state: {
      cwd: options?.cwd ?? state.cwd,
      history: options?.history ?? state.history,
      output: nextOutput,
    },
    navigate: options?.navigate,
  };
}

function resolvePathOptions(cwd: string) {
  const rootEntries = Object.keys(virtualFs).filter((key) => key !== "~");
  const current = cwd === "~" ? undefined : readPath(cwd);
  const scopedEntries = current && typeof current !== "string" ? Object.keys(current) : [];

  const currentPrefix = cwd === "~" ? "" : `${cwd}/`;

  return Array.from(
    new Set([
      "~",
      "..",
      ...rootEntries,
      ...rootEntries.map((entry) => `~/${entry}`),
      ...scopedEntries,
      ...scopedEntries.map((entry) => `${currentPrefix}${entry}`),
    ])
  ).sort();
}

export function executeCommand(state: TerminalState, input: string): TerminalResult {
  const trimmedInput = input.trim();

  if (!trimmedInput) {
    return { state };
  }

  const history = [...state.history, trimmedInput];
  const loweredInput = trimmedInput.toLowerCase();
  const directEgg = easterEggs[loweredInput];

  if (directEgg) {
    return withOutput(
      state,
      trimmedInput,
      directEgg.map((text) => ({ text, type: "system" })),
      { history }
    );
  }

  const [commandToken] = trimmedInput.split(/\s+/);
  const command = commandToken.toLowerCase();
  const argText = trimmedInput.slice(commandToken.length).trim();
  const commandEgg = easterEggs[command];

  if (commandEgg) {
    return withOutput(
      state,
      trimmedInput,
      commandEgg.map((text) => ({ text, type: "system" })),
      { history }
    );
  }

  switch (command) {
    case "help": {
      const lines = Object.entries(terminalHelp).map(([name, description]) => ({
        text: `${name.padEnd(10, " ")} ${description}`,
        type: "system" as const,
      }));

      return withOutput(state, trimmedInput, lines, { history });
    }
    case "ls": {
      const target = argText ? readPath(normalizePath(argText, state.cwd)) : undefined;

      if (argText && (!target || typeof target === "string")) {
        return withOutput(
          state,
          trimmedInput,
          [{ text: `ls: cannot access '${argText}': No such directory`, type: "error" }],
          { history }
        );
      }

      const entries = argText
        ? formatEntries(Object.keys(target as Record<string, string>), normalizePath(argText, state.cwd))
        : listForCwd(state.cwd);

      return withOutput(
        state,
        trimmedInput,
        [{ text: entries.join("  "), type: "output" }],
        { history }
      );
    }
    case "cd": {
      if (!argText) {
        return withOutput(state, trimmedInput, [], { cwd: "~", history });
      }

      if (argText === "..") {
        return withOutput(state, trimmedInput, [], { cwd: "~", history });
      }

      if (argText === "~") {
        return withOutput(state, trimmedInput, [], { cwd: "~", history });
      }

      if (argText === "about") {
        return withOutput(state, trimmedInput, [], { history, navigate: "/about" });
      }

      if (argText === "work") {
        return withOutput(state, trimmedInput, [], {
          cwd: "work",
          history,
          navigate: "/work",
        });
      }

      const targetPath = normalizePath(argText, state.cwd);
      const target = readPath(targetPath);

      if (!target || typeof target === "string") {
        return withOutput(
          state,
          trimmedInput,
          [{ text: `cd: no such file or directory: ${argText}`, type: "error" }],
          { history }
        );
      }

      return withOutput(state, trimmedInput, [], { cwd: targetPath, history });
    }
    case "cat": {
      if (!argText) {
        return withOutput(
          state,
          trimmedInput,
          [{ text: "cat: missing file operand", type: "error" }],
          { history }
        );
      }

      const target = readPath(normalizePath(argText, state.cwd));

      if (!target) {
        return withOutput(
          state,
          trimmedInput,
          [{ text: `cat: ${argText}: No such file or directory`, type: "error" }],
          { history }
        );
      }

      if (typeof target !== "string") {
        return withOutput(
          state,
          trimmedInput,
          [{ text: `cat: ${argText}: Is a directory`, type: "error" }],
          { history }
        );
      }

      return withOutput(state, trimmedInput, [{ text: target, type: "output" }], { history });
    }
    case "pwd":
      return withOutput(state, trimmedInput, [{ text: state.cwd, type: "output" }], { history });
    case "whoami":
      return withOutput(
        state,
        trimmedInput,
        [
          {
            text: "visitor -- browsing slen.win from [no tracking, we respect privacy]",
            type: "output",
          },
        ],
        { history }
      );
    case "neofetch":
      return withOutput(
        state,
        trimmedInput,
        neofetchOutput.map((text) => ({ text, type: "system" })),
        { history }
      );
    case "uptime":
      return withOutput(state, trimmedInput, [{ text: UPTIME_PLACEHOLDER, type: "output" }], {
        history,
      });
    case "history":
      return withOutput(
        state,
        trimmedInput,
        history.map((entry, index) => ({ text: `${index + 1}  ${entry}`, type: "system" })),
        { history }
      );
    case "clear":
      return withOutput(state, trimmedInput, [], { clear: true });
    case "echo":
      return withOutput(state, trimmedInput, [{ text: argText, type: "output" }], { history });
    default:
      return withOutput(
        state,
        trimmedInput,
        [{ text: `command not found: ${command}. Type 'help' for available commands.`, type: "error" }],
        { history }
      );
  }
}

export function getCompletions(partial: string, state: TerminalState): string[] {
  const value = partial.trimStart();

  if (!value) {
    return COMMANDS;
  }

  const segments = value.split(/\s+/);
  const command = segments[0]?.toLowerCase() ?? "";

  if (segments.length === 1 && !partial.endsWith(" ")) {
    return COMMANDS.filter((name) => name.startsWith(command));
  }

  if (!["cd", "cat", "ls"].includes(command)) {
    return [];
  }

  const currentArg = partial.endsWith(" ") ? "" : segments.at(-1) ?? "";

  return resolvePathOptions(state.cwd)
    .filter((option) => option.startsWith(currentArg))
    .map((option) => `${command} ${option}`);
}

export { UPTIME_PLACEHOLDER };
