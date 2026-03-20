"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const WORD_LISTS = {
  code: [
    "function", "const", "return", "async", "await", "import", "export",
    "interface", "type", "class", "extends", "implements", "promise",
    "callback", "middleware", "endpoint", "payload", "schema", "query",
    "mutation", "resolver", "handler", "controller", "service", "module",
    "deploy", "pipeline", "container", "cluster", "instance", "proxy",
    "socket", "stream", "buffer", "cache", "index", "config", "runtime",
    "compiler", "parser", "token", "node", "thread", "process", "daemon",
    "binary", "stack", "queue", "graph", "tree", "hash", "table",
    "debug", "trace", "error", "warning", "fatal", "panic", "recover",
    "goroutine", "channel", "mutex", "struct", "enum", "trait", "generic",
    "iterator", "closure", "lambda", "reduce", "filter", "transform",
    "serialize", "encode", "decode", "encrypt", "verify", "validate",
    "monitor", "metrics", "latency", "throughput", "uptime", "replica",
    "shard", "partition", "consensus", "failover", "circuit", "breaker",
    "kubectl", "docker", "grpc", "protobuf", "webhook", "cron", "nginx",
  ],
};

function shuffleWords(count: number): string[] {
  const words = [...WORD_LISTS.code];
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }
  return words.slice(0, count);
}

export function TypingTest() {
  const WORD_COUNT = 25;
  const TIME_LIMIT = 30;

  const [words, setWords] = useState<string[]>(() => shuffleWords(WORD_COUNT));
  const [input, setInput] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [charStates, setCharStates] = useState<("correct" | "incorrect" | "pending")[][]>(
    () => shuffleWords(WORD_COUNT).map((w) => w.split("").map(() => "pending"))
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  // Derived values (no effect needed)
  const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
  const wpm = elapsed > 0 && correctChars > 0 ? Math.round(correctChars / 5 / (elapsed / 60)) : 0;

  const initTest = useCallback(() => {
    const newWords = shuffleWords(WORD_COUNT);
    setWords(newWords);
    setCharStates(newWords.map((w) => w.split("").map(() => "pending")));
    setInput("");
    setWordIndex(0);
    setCharIndex(0);
    setStarted(false);
    setFinished(false);
    setStartTime(0);
    setCorrectChars(0);
    setTotalChars(0);
    setElapsed(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const secs = (now - startTime) / 1000;
        setElapsed(secs);

        if (secs >= TIME_LIMIT) {
          setFinished(true);
          if (timerRef.current) clearInterval(timerRef.current);
        }
      }, 100);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, finished, startTime]);

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (finished) return;

    if (!started) {
      setStarted(true);
      setStartTime(Date.now());
    }

    if (e.key === "Tab") {
      e.preventDefault();
      initTest();
      setTimeout(() => inputRef.current?.focus(), 0);
      return;
    }

    const currentWord = words[wordIndex];
    if (!currentWord) return;

    if (e.key === " ") {
      e.preventDefault();
      if (charIndex > 0) {
        // Move to next word
        setWordIndex((prev) => prev + 1);
        setCharIndex(0);
        setInput("");

        if (wordIndex + 1 >= words.length) {
          setFinished(true);
          if (timerRef.current) clearInterval(timerRef.current);
        }
      }
      return;
    }

    if (e.key === "Backspace") {
      if (charIndex > 0) {
        setCharIndex((prev) => prev - 1);
        setCharStates((prev) => {
          const next = prev.map((w) => [...w]);
          if (next[wordIndex]) {
            next[wordIndex][charIndex - 1] = "pending";
          }
          return next;
        });
        setInput((prev) => prev.slice(0, -1));
      }
      return;
    }

    if (e.key.length === 1) {
      if (charIndex >= currentWord.length) return;

      const isCorrect = e.key === currentWord[charIndex];
      setTotalChars((prev) => prev + 1);
      if (isCorrect) setCorrectChars((prev) => prev + 1);

      setCharStates((prev) => {
        const next = prev.map((w) => [...w]);
        if (next[wordIndex]) {
          next[wordIndex][charIndex] = isCorrect ? "correct" : "incorrect";
        }
        return next;
      });

      setCharIndex((prev) => prev + 1);
      setInput((prev) => prev + e.key);
    }
  };

  const timeLeft = Math.max(0, Math.ceil(TIME_LIMIT - elapsed));

  return (
    <div
      className="typing-test"
      ref={containerRef}
      onClick={handleFocus}
      data-testid="typing-test"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-6)",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-3)" }}>
          <span
            className="mono"
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-accent)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            typing test
          </span>
          <span
            className="mono"
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-text-muted)",
            }}
          >
            {TIME_LIMIT}s &middot; code words
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
          <span
            className="mono glow"
            style={{ fontSize: "var(--text-lg)", fontWeight: 600 }}
          >
            {started ? `${timeLeft}s` : `${TIME_LIMIT}s`}
          </span>
          <button className="typing-reset" onClick={(e) => { e.stopPropagation(); initTest(); setTimeout(() => inputRef.current?.focus(), 0); }}>
            reset
          </button>
        </div>
      </div>

      <input
        ref={inputRef}
        className="typing-test-input"
        value={input}
        onChange={() => {}}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        aria-label="Typing test input"
      />

      <div className="typing-test-words">
        {!started && !finished && (
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "var(--text-sm)",
              marginBottom: "var(--space-4)",
            }}
          >
            click here and start typing &middot; tab to reset
          </p>
        )}
        {words.map((word, wi) => (
          <span key={wi} style={{ marginRight: "0.75em", display: "inline" }}>
            {word.split("").map((char, ci) => {
              const state = charStates[wi]?.[ci] ?? "pending";
              const isCursor = wi === wordIndex && ci === charIndex && !finished;
              return (
                <span
                  key={ci}
                  className={`${state} ${isCursor ? "current" : ""}`}
                >
                  {char}
                </span>
              );
            })}
          </span>
        ))}
      </div>

      {(started || finished) && (
        <div className="typing-test-stats">
          <div>
            <div className="stat-value">{wpm}</div>
            <div className="stat-label">wpm</div>
          </div>
          <div>
            <div className="stat-value">{accuracy}%</div>
            <div className="stat-label">accuracy</div>
          </div>
          <div>
            <div className="stat-value">
              {wordIndex}/{words.length}
            </div>
            <div className="stat-label">words</div>
          </div>
          {finished && (
            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
              }}
            >
              <button
                className="typing-reset"
                onClick={(e) => {
                  e.stopPropagation();
                  initTest();
                  setTimeout(() => inputRef.current?.focus(), 0);
                }}
              >
                try again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
