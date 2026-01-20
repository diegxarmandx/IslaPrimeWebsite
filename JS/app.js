const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const resetBtn = document.getElementById("resetBtn");

// Simple session ID (good enough for demo)
const sessionId = crypto.randomUUID();

function addMessage(text, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);

  const bubble = document.createElement("span");
  bubble.textContent = text;

  messageDiv.appendChild(bubble);
  chatBox.appendChild(messageDiv);

  chatBox.scrollTop = chatBox.scrollHeight;
}
function addWelcomeMessage() {
  addMessage(
    "¡Bienvenido al asistente de materiales y acarreo de Isla Prime! " +
    "Si no estás seguro de qué materiales usar para tu proyecto, no te preocupes. " +
    "Te orientaré paso a paso según lo que estés construyendo o preparando. " +
    "Para comenzar, dime: ¿qué tipo de proyecto tienes en mente (por ejemplo, construcción de vivienda, nivelación de terreno o relleno)?",
    
  );
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  userInput.value = "";

  try {
    const response = await fetch("https://isla-prime-ai-backend.onrender.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message,
        sessionId
      })
    });

    const data = await response.json();
    addMessage(data.reply, "assistant");

  } catch (error) {
    addMessage("Error connecting to the assistant.", "assistant");
    console.error(error);
  }
}

resetBtn.addEventListener("click", () => {
  // Reload the page to fully reset UI and session.
  // This avoids reassigning the `sessionId` which is declared `const`.
  window.location.reload();
});

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

addWelcomeMessage();