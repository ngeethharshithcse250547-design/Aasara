"use client";

import React, { useState, useRef, useEffect } from "react";
import { useProfile } from "../lib/profileContext";
import { t } from "../lib/i18n";
import { SCHEMES } from "../lib/data/schemes";
import Link from "next/link";

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  text: string;
  actions?: { label: string; href: string }[];
}

export function ChatbotDrawer() {
  const { profile, selectedSchemeId } = useProfile();
  const locale = profile.locale || "en";
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialMessage: ChatMessage = {
    id: 1,
    role: "assistant",
    text: "Namaste! I'm Scheme Sahayak. I can help you understand financial assistance, your matched scheme, required documents, loan calculations, and where to apply.",
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);

  const quickQuestions = [
    "Which scheme is right for me?",
    "What documents do I need?",
    "How much can I borrow?",
    "What is the interest rate?",
    "Where can I apply?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = { id: Date.now(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let responseText = "";
      let actions: { label: string; href: string }[] = [];

      const currentScheme = selectedSchemeId
        ? SCHEMES.find((s) => s.id === selectedSchemeId)
        : null;

      if (
        lowerText.includes("which scheme") ||
        lowerText.includes("eligible") ||
        lowerText.includes("right for me")
      ) {
        if (currentScheme) {
          responseText = `Based on your assessment, your current matched scheme is ${currentScheme.name} because your project amount and other answers satisfy the applicable rules.`;
          actions = [{ label: "View Results", href: "/results" }];
        } else {
          responseText =
            "Please complete the assessment first to find out which scheme is suitable for you.";
          actions = [{ label: "Start Assessment", href: "/assessment" }];
        }
      } else if (lowerText.includes("document")) {
        if (currentScheme) {
          responseText = `For the ${currentScheme.name}, you will generally need your Aadhaar, Caste Certificate, and project details. Check the Document Readiness page for a personalized checklist.`;
          actions = [{ label: "Document Readiness", href: "/readiness" }];
        } else {
          responseText =
            "To know exactly what documents you need, please complete the assessment first so we can match you to a scheme.";
          actions = [{ label: "Start Assessment", href: "/assessment" }];
        }
      } else if (
        lowerText.includes("how much") ||
        lowerText.includes("borrow") ||
        lowerText.includes("maximum") ||
        lowerText.includes("loan amount")
      ) {
        if (currentScheme) {
          responseText = `Under the ${
            currentScheme.name
          }, the maximum loan amount is ₹${currentScheme.maxLoanAmount.toLocaleString(
            "en-IN"
          )}.`;
          actions = [{ label: "Calculator", href: "/calculator" }];
        } else {
          responseText =
            "Maximum loan amounts vary by scheme. For example, Term Loan offers up to ₹45 Lakhs, while Micro Finance offers up to ₹1.25 Lakhs. Please complete the assessment to find your match.";
          actions = [{ label: "Start Assessment", href: "/assessment" }];
        }
      } else if (
        lowerText.includes("interest") ||
        lowerText.includes("rate")
      ) {
        if (currentScheme) {
          responseText = `The interest rate for the ${
            currentScheme.name
          } is typically ${(currentScheme.interestRate * 100).toFixed(
            1
          )}% per annum. ${currentScheme.rateNote || ""}`;
          actions = [{ label: "Calculator", href: "/calculator" }];
        } else {
          responseText =
            "Interest rates range from 6.5% to 15% depending on the specific scheme and channel partner. Please complete the assessment.";
          actions = [{ label: "Start Assessment", href: "/assessment" }];
        }
      } else if (
        lowerText.includes("where") ||
        lowerText.includes("apply") ||
        lowerText.includes("office")
      ) {
        responseText =
          "You can apply online through the PM-SURAJ portal or visit a verified state agency or partner bank in your state.";
        actions = [{ label: "Where to Apply", href: "/partners" }];
      } else if (
        lowerText.includes("repayment") ||
        lowerText.includes("long") ||
        lowerText.includes("duration")
      ) {
        if (currentScheme) {
          responseText = `For the ${currentScheme.name}, the maximum repayment period is ${currentScheme.maxRepaymentMonths} months, including a ${currentScheme.moratoriumMonths}-month moratorium.`;
          actions = [{ label: "Calculator", href: "/calculator" }];
        } else {
          responseText =
            "Repayment periods range from 36 to 144 months depending on the scheme.";
        }
      } else if (
        lowerText.includes("hello") ||
        lowerText.includes("hi") ||
        lowerText.includes("namaste")
      ) {
        responseText =
          "Namaste! How can I help you with your loan application today?";
      } else {
        responseText =
          "I don't have verified information about that yet. Please use the official scheme information or the relevant application channel.";
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", text: responseText, actions },
      ]);
    }, 600);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-forest px-5 py-3.5 text-sm font-extrabold text-white shadow-lg transition hover:bg-ink active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 min-h-[52px]"
        aria-label={t("chatbot.fab_label", locale)}
        id="chatbot-fab"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="hidden sm:inline">{t("chatbot.fab_label", locale)}</span>
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:justify-end sm:p-4">
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div
            className="relative w-full sm:w-[400px] h-[85vh] sm:h-[600px] rounded-t-3xl sm:rounded-3xl bg-white shadow-xl flex flex-col overflow-hidden animate-slide-up"
            role="dialog"
            aria-modal="true"
            aria-label={t("chatbot.title", locale)}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4 shrink-0 bg-white">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-forest text-lg font-black text-white">
                  S
                </span>
                <div>
                  <h2 className="text-sm font-extrabold text-ink">
                    {t("chatbot.title", locale)}
                  </h2>
                  <span className="text-[11px] text-ink/60">
                    Rule-Grounded Assistant
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-xl text-ink/50 hover:bg-sand hover:text-ink transition"
                aria-label="Close chat"
              >
                <span className="text-xl font-bold">✕</span>
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-5 py-6 bg-cream/30 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[85%] ${
                    msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 text-[13px] leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "bg-forest text-white rounded-br-none"
                        : "bg-white border border-ink/10 text-ink rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {msg.actions.map((action, i) => (
                        <Link
                          key={i}
                          href={action.href}
                          onClick={() => setIsOpen(false)}
                          className="rounded-lg bg-forest/10 px-3 py-1.5 text-[11px] font-bold text-forest transition hover:bg-forest hover:text-white"
                        >
                          {action.label} →
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Quick Questions (only show if latest message is from assistant) */}
              {messages[messages.length - 1].role === "assistant" && (
                <div className="flex flex-wrap gap-2 mt-4 pt-2">
                  {quickQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(q)}
                      className="rounded-full border border-forest/30 bg-white px-3 py-1.5 text-[11px] font-semibold text-forest shadow-sm transition hover:bg-forest hover:text-white"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-ink/10 px-4 py-3 bg-white shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(inputText);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your question..."
                  className="flex-1 rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:border-forest focus:outline-none min-h-[48px]"
                  aria-label="Chat input"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-forest text-white disabled:opacity-50 transition"
                  aria-label="Send message"
                >
                  <span className="text-lg">↑</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
