const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const resetBtn = document.getElementById('resetBtn');

const sessionId = crypto.randomUUID();

function addMessage(text, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', sender);

  const bubble = document.createElement('span');
  bubble.textContent = text;

  messageDiv.appendChild(bubble);
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function addWelcomeMessage() {
  addMessage(
    '¡Bienvenido al asistente de materiales y acarreo de Isla Prime! Si no estás seguro de qué materiales usar para tu proyecto, te orientaré paso a paso. Para comenzar: ¿qué tipo de proyecto tienes en mente?',
    'assistant'
  );
}

function setSendingState(isSending) {
  sendBtn.disabled = isSending;
  sendBtn.textContent = isSending ? 'Sending...' : 'Send';
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, 'user');
  userInput.value = '';
  setSendingState(true);
  addMessage('Thinking through your project details...', 'status');

  try {
    const response = await fetch('https://isla-prime-ai-backend.onrender.com/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        sessionId
      })
    });

    const data = await response.json();
    removeLastStatusMessage();
    addMessage(data.reply, 'assistant');
  } catch (error) {
    removeLastStatusMessage();
    addMessage('Error connecting to the assistant. Please try again in a moment.', 'assistant');
    console.error(error);
  } finally {
    setSendingState(false);
  }
}

function removeLastStatusMessage() {
  const statusMessages = chatBox.querySelectorAll('.message.status');
  const lastStatus = statusMessages[statusMessages.length - 1];
  if (lastStatus) {
    lastStatus.remove();
  }
}

resetBtn.addEventListener('click', () => {
  window.location.reload();
});

sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

addWelcomeMessage();
