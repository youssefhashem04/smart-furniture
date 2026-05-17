import { useEffect, useRef, useState } from "react";
import { IoChatbubbleOutline } from "react-icons/io5";

export default function AIChatWidget() {

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeChat, setActiveChat] = useState(null);

  const token = localStorage.getItem("token");

  const messagesEndRef = useRef(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  useEffect(() => {
    if (open) scrollToBottom();
  }, [messages, loading, open]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userText }
    ]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userText,
          session_id: activeChat,
        }),
      });

      const data = await res.json();

      if (data.session_id) {
        setActiveChat(data.session_id);
      }

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.reply }
      ]);

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Error connecting to AI 😢" }
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* ===================== */}
      {/* FLOATING BUTTON */}
      {/* ===================== */}
      <button
        className="ai-fab"
        onClick={() => setOpen(!open)}
      >
        <div className="ai-icon">
          <IoChatbubbleOutline size={24} />
          <span>AI</span>
        </div>
      </button>

      {/* ===================== */}
      {/* CHAT WINDOW */}
      {/* ===================== */}
      {open && (
        <div className={`ai-chat ${open ? "open" : ""}`}>

          {/* HEADER */}
          <div className="ai-header">
            <span>✨ AI Assistant</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          {/* MESSAGES */}
          <div className="ai-messages">

            {messages.map((m, i) => (
              <div
                key={i}
                className={`msg ${m.role}`}
              >
                {m.text}
              </div>
            ))}

            {loading && (
              <div className="msg ai">
                AI is thinking...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div className="ai-input">

            <input
              type="text"
              value={input}
              placeholder="Ask anything..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && sendMessage()
              }
            />

            <button onClick={sendMessage}>
              Send
            </button>

          </div>

        </div>
      )}
    </>
  );
}