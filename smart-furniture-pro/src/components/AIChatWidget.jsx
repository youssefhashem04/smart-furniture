import { useEffect, useRef, useState } from "react";
import { IoChatbubbleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function AIChatWidget() {

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeChat, setActiveChat] = useState(null);

  const token = localStorage.getItem("token");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

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
    setProducts([]);

    try {

      const res = await fetch("http://127.0.0.1:8000/api/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
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

      if (Array.isArray(data.products)) {
        setProducts(data.products);
      }

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Network error 😢" }
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* FLOAT BUTTON */}
      <button className="ai-fab" onClick={() => setOpen(!open)}>
        <IoChatbubbleOutline size={24} />
        <span>AI</span>
      </button>

      {/* CHAT */}
      {open && (
        <div className="ai-chat open">

          {/* HEADER */}
          <div className="ai-header">
            <span>✨ AI Assistant</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          {/* MESSAGES */}
          <div className="ai-messages">

            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>
                {m.text}
              </div>
            ))}

            {loading && (
              <div className="msg ai">
                AI is thinking...
              </div>
            )}

            {/* ========================= */}
            {/* PRODUCTS (HOME STYLE FIX) */}
            {/* ========================= */}
            {products.length > 0 && (
              <div className="products-grid ai-products">

                {products.map((p) => (
                  <div
                    key={p.id}
                    className="product-card"
                    onClick={() => navigate(`/product/${p.id}`)}
                    style={{ cursor: "pointer" }}
                  >

                    {/* IMAGE (same as Home ProductCard) */}
                    {p.image && (
                      <img
                        src={`http://127.0.0.1:8000${p.image}`}
                        alt={p.name}
                        className="product-image"
                      />
                    )}

                    <h3>{p.name}</h3>

                    <p className="product-category">
                      {p.category}
                    </p>

                    <p className="product-price">
                      {p.price} EGP
                    </p>

                    

                  </div>
                ))}

              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div className="ai-input">

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask anything..."
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