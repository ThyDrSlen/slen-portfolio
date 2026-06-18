"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TypingTest } from "@/components/TypingTest";
import { REVEAL_TYPING_TEST_EVENT } from "@/components/home/InteractiveTerminal";

export function TypingTestGate() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const focusTypingDeck = useCallback(() => {
    window.requestAnimationFrame(() => {
      const section = sectionRef.current;
      section?.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(() => {
        section
          ?.querySelector<HTMLInputElement>('[aria-label="Typing test input"]')
          ?.focus();
      }, 260);
    });
  }, []);

  useEffect(() => {
    const revealTypingTest = () => {
      setIsUnlocked(true);
      focusTypingDeck();
    };

    window.addEventListener(REVEAL_TYPING_TEST_EVENT, revealTypingTest);
    return () => window.removeEventListener(REVEAL_TYPING_TEST_EVENT, revealTypingTest);
  }, [focusTypingDeck]);

  useEffect(() => {
    if (isUnlocked) {
      focusTypingDeck();
    }
  }, [focusTypingDeck, isUnlocked]);

  if (!isUnlocked) return null;

  return (
    <section
      ref={sectionRef}
      data-testid="typing-test-section"
      style={{ marginBottom: "var(--space-12)" }}
    >
      <div className="container">
        <TypingTest />
      </div>
    </section>
  );
}
