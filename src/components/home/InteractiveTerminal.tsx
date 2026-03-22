"use client";

import {
  type CSSProperties,
  type KeyboardEvent,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { terminalConfig } from "@/content/system";
import {
  UPTIME_PLACEHOLDER,
  createInitialState,
  executeCommand,
  getCompletions,
  type TerminalLine,
  type TerminalState,
} from "@/lib/terminal";

type TerminalAction = {
  type: "replace";
  state: TerminalState;
};

function reducer(_: TerminalState, action: TerminalAction) {
  return action.state;
}

function createMountedState(): TerminalState {
  return {
    ...createInitialState(),
    output: [
      { text: terminalConfig.motd, type: "system" },
      ...terminalConfig.welcomeMessage.map<TerminalLine>((text) => ({
        text,
        type: text ? "system" : "output",
      })),
    ],
  };
}

function formatUptime(startedAt: number) {
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  return `up ${minutes} minute${minutes === 1 ? "" : "s"}, ${seconds} second${seconds === 1 ? "" : "s"}`;
}

function getLineStyle(type: TerminalLine["type"]): CSSProperties {
  if (type === "input") {
    return { color: "var(--color-text)" };
  }

  if (type === "error") {
    return { color: "var(--color-error)" };
  }

  if (type === "system") {
    return { color: "var(--color-text-muted)" };
  }

  return { color: "var(--color-accent)", textShadow: "0 0 10px color-mix(in srgb, var(--color-accent) 30%, transparent)" };
}

export function InteractiveTerminal() {
  const [state, dispatch] = useReducer(reducer, undefined, createMountedState);
  const [input, setInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [draftInput, setDraftInput] = useState("");
  const [completionIndex, setCompletionIndex] = useState(0);
  const [completionSeed, setCompletionSeed] = useState("");
  const [isCursorVisible, setIsCursorVisible] = useState(true);
  const startedAtRef = useRef(0);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const completions = useMemo(() => getCompletions(input, state), [input, state]);

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  useEffect(() => {
    const node = outputRef.current;

    if (!node) {
      return;
    }

    node.scrollTop = node.scrollHeight;
  });

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIsCursorVisible((visible) => !visible);
    }, 530);

    return () => window.clearInterval(interval);
  }, []);

  const resetCompletion = (nextInput?: string) => {
    setCompletionSeed(nextInput ?? "");
    setCompletionIndex(0);
  };

  const applyResult = (command: string) => {
    const result = executeCommand(state, command);
    const nextState: TerminalState = {
      ...result.state,
      output: result.state.output.map((line) =>
        line.text === UPTIME_PLACEHOLDER
          ? { ...line, text: formatUptime(startedAtRef.current) }
          : line
      ),
    };

    dispatch({ type: "replace", state: nextState });
    setInput("");
    setHistoryIndex(null);
    setDraftInput("");
    resetCompletion();

    if (result.navigate) {
      window.location.href = result.navigate;
    }
  };

  const handleHistoryNavigation = (direction: "up" | "down") => {
    if (state.history.length === 0) {
      return;
    }

    if (direction === "up") {
      const nextIndex = historyIndex === null ? state.history.length - 1 : Math.max(0, historyIndex - 1);

      if (historyIndex === null) {
        setDraftInput(input);
      }

      setHistoryIndex(nextIndex);
      setInput(state.history[nextIndex] ?? "");
      resetCompletion(state.history[nextIndex] ?? "");
      return;
    }

    if (historyIndex === null) {
      return;
    }

    const nextIndex = historyIndex + 1;

    if (nextIndex >= state.history.length) {
      setHistoryIndex(null);
      setInput(draftInput);
      resetCompletion(draftInput);
      return;
    }

    setHistoryIndex(nextIndex);
    setInput(state.history[nextIndex] ?? "");
    resetCompletion(state.history[nextIndex] ?? "");
  };

  const handleCompletion = () => {
    const seed = completionSeed && completionSeed !== input ? input : completionSeed || input;
    const nextCompletions = seed === input ? completions : getCompletions(seed, state);

    if (nextCompletions.length === 0) {
      return;
    }

    const nextIndex = seed === input ? completionIndex % nextCompletions.length : 0;
    const nextValue = nextCompletions[nextIndex] ?? input;

    setInput(nextValue);
    setCompletionSeed(seed);
    setCompletionIndex((nextIndex + 1) % nextCompletions.length);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      applyResult(input);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      handleHistoryNavigation("up");
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      handleHistoryNavigation("down");
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      handleCompletion();
      return;
    }

    if (event.key.toLowerCase() === "l" && event.ctrlKey) {
      event.preventDefault();
      applyResult("clear");
    }
  };

  return (
    <section className="section" style={{ marginTop: "var(--space-16)" }}>
      <div className="container">
        <div
          data-testid="interactive-terminal"
          style={{
            background: "radial-gradient(circle at top, color-mix(in srgb, var(--color-accent) 10%, transparent), transparent 42%), var(--color-bg-elevated)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "0 28px 80px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.03)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--space-4)",
              padding: "var(--space-4) var(--space-5)",
              borderBottom: "1px solid var(--color-border)",
              background: "linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01))",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <span style={{ width: "0.7rem", height: "0.7rem", borderRadius: "999px", background: "#ff5f57" }} />
                <span style={{ width: "0.7rem", height: "0.7rem", borderRadius: "999px", background: "#febc2e" }} />
                <span style={{ width: "0.7rem", height: "0.7rem", borderRadius: "999px", background: "#28c840" }} />
              </div>
              <span
                className="mono"
                style={{
                  color: "var(--color-text)",
                  fontSize: "var(--text-sm)",
                  letterSpacing: "0.08em",
                }}
              >
                visitor@slen.win
              </span>
            </div>
            <span
              className="mono"
              style={{ color: "var(--color-text-muted)", fontSize: "var(--text-xs)" }}
            >
              {state.cwd}
            </span>
          </div>

          <div
            data-testid="terminal-output"
            ref={outputRef}
            style={{
              maxHeight: "28rem",
              overflowY: "auto",
              padding: "var(--space-5)",
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-sm)",
              lineHeight: 1.7,
              color: "var(--color-accent)",
            }}
          >
            {state.output.map((line, index) => (
              <div
                key={`${line.type}-${index}-${line.text}`}
                style={{
                  ...getLineStyle(line.type),
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  minHeight: "1.4em",
                }}
              >
                {line.text || " "}
              </div>
            ))}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                marginTop: state.output.length > 0 ? "var(--space-2)" : 0,
              }}
            >
              <span style={{ color: "var(--color-accent)", flexShrink: 0 }}>
                {terminalConfig.prompt}
              </span>
              <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    whiteSpace: "pre",
                    overflow: "hidden",
                    color: "var(--color-text)",
                    pointerEvents: "none",
                  }}
                >
                  <span>{input}</span>
                  <span
                    style={{
                      width: "0.58rem",
                      height: "1.15em",
                      marginLeft: input ? "0.1rem" : 0,
                      background: "var(--color-accent)",
                      opacity: isCursorVisible ? 1 : 0,
                      boxShadow: "0 0 12px color-mix(in srgb, var(--color-accent) 40%, transparent)",
                      transition: "opacity 120ms linear",
                    }}
                  />
                </div>
                <input
                  data-testid="terminal-input"
                  ref={inputRef}
                  value={input}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    setInput(nextValue);
                    setHistoryIndex(null);
                    setDraftInput(nextValue);
                    resetCompletion(nextValue);
                  }}
                  onKeyDown={handleKeyDown}
                  autoCapitalize="off"
                  autoCorrect="off"
                  autoComplete="off"
                  spellCheck={false}
                  aria-label="Terminal input"
                  style={{
                    width: "100%",
                    border: 0,
                    outline: 0,
                    background: "transparent",
                    color: "transparent",
                    caretColor: "transparent",
                    font: "inherit",
                    padding: 0,
                    margin: 0,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
