import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "Tell me about yourself",
  "What are your key skills?",
  "What projects are you most proud of?",
  "Are you open to new opportunities?",
];

export function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi there! I'm an AI assistant representing Abu Hasnayen Zillanee. Feel free to ask me anything about his background, skills, projects, or experience!",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, open]);

  const chatMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      const res = await apiRequest("POST", "/api/chat", {
        message: userMessage,
        history: messages,
      });
      return res.json() as Promise<{ reply: string }>;
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting right now. Please try again shortly or reach out directly at hasnayen3072@gmail.com.",
        },
      ]);
    },
  });

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || chatMutation.isPending) return;
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    chatMutation.mutate(trimmed);
  };

  return (
    <>
      {/* Chat Panel */}
      {open && (
        <div
          data-testid="chat-panel"
          className="fixed bottom-20 right-4 md:right-6 z-50 w-[340px] md:w-[380px] flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
          style={{ maxHeight: "520px" }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-4 bg-primary text-primary-foreground">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-serif font-semibold text-sm leading-tight">Chat with Abu's AI</p>
              <p className="text-xs text-primary-foreground/70">Representing Abu Hasnayen Zillanee</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-primary-foreground/80">Online</span>
            </div>
            <Button
              data-testid="button-close-chat"
              size="icon"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-primary-foreground h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: 0, maxHeight: "320px" }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                data-testid={`chat-message-${i}`}
                className={`flex gap-2 chat-bubble-in ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-secondary text-secondary-foreground rounded-tl-sm"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-accent" />
                  </div>
                )}
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="flex gap-2 items-center">
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="bg-secondary rounded-2xl rounded-tl-sm px-3.5 py-2.5">
                  <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  data-testid={`suggested-question-${q.slice(0, 10).replace(/\s+/g, "-")}`}
                  onClick={() => sendMessage(q)}
                  className="text-xs px-2.5 py-1 rounded-full border border-primary/30 text-primary bg-primary/5 transition-colors hover:bg-primary/10"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-border flex gap-2 bg-background">
            <input
              ref={inputRef}
              data-testid="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Ask me anything..."
              className="flex-1 text-sm bg-secondary rounded-lg px-3 py-2 outline-none border-0 placeholder:text-muted-foreground"
            />
            <Button
              data-testid="button-send-chat"
              size="icon"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || chatMutation.isPending}
              className="flex-shrink-0"
            >
              {chatMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        data-testid="button-toggle-chat"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-4 right-4 md:right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg transition-transform active:scale-95 hover:scale-105"
        style={{ boxShadow: "0 4px 24px hsl(199 89% 42% / 0.4)" }}
      >
        {open ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center text-[9px] text-white font-bold">
            AI
          </span>
        )}
      </button>
    </>
  );
}
