import { useState } from "react";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Bonjour 👋 Comment puis-je vous aider ?" }
  ]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const newMessages = [
      ...messages,
      { role: "user", content: input }
    ];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      });

      const data = await res.json();

      setMessages([
        ...newMessages,
        { role: "assistant", content: data.reply || "Aucune réponse." }
      ]);
    } catch (e) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Erreur serveur." }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.chat}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background: m.role === "user" ? "#DCF8C6" : "#F1F1F1"
            }}
          >
            {m.content}
          </div>
        ))}
        {loading && <div style={styles.loading}>…</div>}
      </div>

      <div style={styles.inputBox}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Écrivez votre question…"
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>
          Envoyer
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    maxWidth: 420,
    margin: "0 auto",
    fontFamily: "sans-serif"
  },
  chat: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    padding: 12,
    border: "1px solid #ddd",
    borderRadius: 8,
    height: 400,
    overflowY: "auto",
    background: "#fff"
  },
  message: {
    padding: "8px 12px",
    borderRadius: 16,
    maxWidth: "80%",
    fontSize: 14
  },
  loading: {
    fontSize: 12,
    color: "#999"
  },
  inputBox: {
    display: "flex",
    gap: 8,
    marginTop: 8
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 14,
    borderRadius: 8,
    border: "1px solid #ccc"
  },
  button: {
    padding: "0 16px",
    borderRadius: 8,
    border: "none",
    background: "#000",
    color: "#fff",
    cursor: "pointer"
  }
};
