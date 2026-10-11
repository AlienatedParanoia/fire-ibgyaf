"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Flame, Loader2, RotateCcw } from "lucide-react";
import { ChatMarkdown } from "./chat-markdown";
import { cn } from "@/lib/utils";

type Message = { id: number; text: string; sender: "user" | "bot" };

const WELCOME: Message = {
  id: 0,
  sender: "bot",
  text: "Hey! 👋 I'm the **F.I.R.E Assistant**. Ask me about clubs, competitions or announcements.\n\n- *What STEM clubs can I join?*\n- *Which competitions close this month?*\n- *Tell me about the Film Club*",
};

/** Floating Gemini-powered assistant. Needs a signed-in user (the API route enforces it too). */
export function Chatbot({ signedIn }: { signedIn: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([WELCOME]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  React.useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 220);
    return () => clearTimeout(t);
  }, [open]);

  const push = (m: Omit<Message, "id">) => setMessages((prev) => [...prev, { ...m, id: Date.now() + prev.length }]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    if (!signedIn) {
      push({ sender: "bot", text: "Please [log in](/login) to chat with the assistant." });
      return;
    }
    const history = messages
      .filter((m) => m.id !== 0)
      .slice(-10)
      .map((m) => ({ sender: m.sender, text: m.text }));
    push({ sender: "user", text });
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };
      push({ sender: "bot", text: res.ok && data.reply ? data.reply : data.error ?? "Something went wrong. Try again!" });
    } catch {
      push({ sender: "bot", text: "I couldn't reach the server. Check your connection and try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close assistant" : "Open assistant"}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-paper shadow-lg transition-shadow hover:shadow-xl"
      >
        {open ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="F.I.R.E Assistant"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-5 z-50 flex h-[520px] max-h-[calc(100vh-8rem)] w-[380px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border-[1.5px] border-ink/15 bg-panel shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-ink/10 px-4 py-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ember/10 text-ember">
                <Flame className="h-4 w-4" fill="currentColor" />
              </span>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-ink">F.I.R.E Assistant</h3>
                <p className="text-[11px] text-ink-faint">AI-generated · double-check important details</p>
              </div>
              <button
                onClick={() => {
                  setMessages([WELCOME]);
                  setInput("");
                }}
                title="Reset chat"
                aria-label="Reset chat"
                className="rounded-md p-1.5 text-ink-faint transition-colors hover:bg-paper hover:text-ink"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m) => (
                <div key={m.id} className={cn("flex", m.sender === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[90%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed",
                      m.sender === "user" ? "rounded-br-sm bg-ink text-paper" : "rounded-bl-sm bg-paper text-ink"
                    )}
                  >
                    {m.sender === "user" ? m.text : <ChatMarkdown text={m.text} />}
                  </div>
                </div>
              ))}
              {busy && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-xl rounded-bl-sm bg-paper px-3.5 py-2.5 text-sm text-ink-faint">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send();
              }}
              className="flex items-center gap-2 border-t border-ink/10 p-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={500}
                disabled={busy}
                placeholder={signedIn ? "Ask about clubs, competitions…" : "Log in to chat"}
                className="flex-1 rounded-lg border border-ink/12 bg-paper px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-ember"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-paper transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
