export const sendMessageToAI = async (message) => {
  const res = await fetch("http://127.0.0.1:8000/api/ai/chat/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    throw new Error("AI request failed");
  }

  const data = await res.json();
  return data.reply;
};