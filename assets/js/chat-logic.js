/* ==========================================
   🐠 CHAT LOGIC - The Memory Stream Quest
   ========================================== */

// Chat State
const chatState = {
    messages: [],
    userMessages: [],
    totalWordCount: 0,
    targetWordCount: 25,
    isComplete: false,
    isTyping: false
};

// Bot Messages Queue
const botResponses = {
    initial: [
        "Assalamualaikum kana, anggap saja ini zaky dalam bentuk ikan :v.",
        "barakallah fi ilmik, btw btwwwwww cerita dulu donggg",
        "Ceritain dong satu momen paling asik, seru, memorable, apalah itu"
    ],
    encouragements: [
        "Wah seru tuh! Terus terus, ceritain lagi dong! 🐟",
        "Hmm menarik... ada lagi gak ceritanya?",
        "Aku suka dengerin ceritamu! Lanjut dong~ 🐠",
        "Ohhh gitu ya... terus gimana kelanjutannya?",
        "Mantap! Pasti banyak kenangan ya selama kuliah 🌟",
        "Wah pasti seru banget tuh! Ada lagi gak?",
        "Keren! Cerita lagi dong, aku penasaran 🐙"
    ],
    almostThere: [
        "Dikit lagi nih! Ceritain satu hal lagi dong! 🎯",
        "Udah hampir sampai! Tambah sedikit lagi ceritanya~ ✨",
        "Woohoo hampir selesai! Satu cerita lagi yuk!"
    ],
    success: [
        "YEAAAY! udah sih itu aja!",
        "Makasih udah cerita wwkwwk!",
        "Sekarang saatnya Photobox ala ala wkwkw! 📸"
    ]
};

// DOM Elements
let chatMessagesContainer;
let chatInput;
let sendBtn;
let progressBar;
let wordCountDisplay;
let toPhotoboxBtn;

// Initialize Chat
function initChat() {
    chatMessagesContainer = document.getElementById('chat-messages');
    chatInput = document.getElementById('chat-input');
    sendBtn = document.getElementById('send-btn');
    progressBar = document.getElementById('progress-bar');
    wordCountDisplay = document.getElementById('word-count');
    toPhotoboxBtn = document.getElementById('to-photobox-btn');

    // Event Listeners
    sendBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    toPhotoboxBtn.addEventListener('click', () => {
        goToStage(3);
    });

    // Start conversation
    startConversation();
}

// Start Conversation with Bot
function startConversation() {
    let delay = 500;
    botResponses.initial.forEach((msg, index) => {
        setTimeout(() => {
            addBotMessage(msg);
        }, delay + (index * 1500));
    });
}

// Add Bot Message
function addBotMessage(text) {
    // Show typing indicator first
    showTypingIndicator();

    setTimeout(() => {
        removeTypingIndicator();

        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message bot';
        messageDiv.innerHTML = `<p>${text}</p>`;
        chatMessagesContainer.appendChild(messageDiv);

        // Scroll to bottom
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

        chatState.messages.push({ type: 'bot', text });
    }, 800);
}

// Add User Message
function addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message user';
    messageDiv.innerHTML = `<p>${text}</p>`;
    chatMessagesContainer.appendChild(messageDiv);

    // Scroll to bottom
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

    chatState.messages.push({ type: 'user', text });
    chatState.userMessages.push(text);
}

// Show Typing Indicator
function showTypingIndicator() {
    chatState.isTyping = true;
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    chatMessagesContainer.appendChild(typingDiv);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

// Remove Typing Indicator
function removeTypingIndicator() {
    chatState.isTyping = false;
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// Handle Send Message
function handleSendMessage() {
    const text = chatInput.value.trim();
    if (!text || chatState.isComplete) return;

    // Add user message
    addUserMessage(text);
    chatInput.value = '';

    // Count words
    const words = text.split(/\s+/).filter(word => word.length > 0);
    chatState.totalWordCount += words.length;

    // Update progress
    updateProgress();

    // Check if complete
    if (chatState.totalWordCount >= chatState.targetWordCount) {
        handleQuestComplete();
    } else {
        // Send encouragement
        setTimeout(() => {
            const remaining = chatState.targetWordCount - chatState.totalWordCount;
            if (remaining <= 10) {
                // Almost there
                const randomMsg = botResponses.almostThere[Math.floor(Math.random() * botResponses.almostThere.length)];
                addBotMessage(randomMsg);
            } else {
                // Regular encouragement
                const randomMsg = botResponses.encouragements[Math.floor(Math.random() * botResponses.encouragements.length)];
                addBotMessage(randomMsg);
            }
        }, 500);
    }
}

// Update Progress Bar
function updateProgress() {
    const progress = Math.min((chatState.totalWordCount / chatState.targetWordCount) * 100, 100);
    progressBar.style.width = `${progress}%`;
    wordCountDisplay.textContent = `${chatState.totalWordCount}/${chatState.targetWordCount} kata`;

    // Change color when almost complete
    if (progress >= 80) {
        progressBar.classList.add('animate-pulse');
    }
}

// Handle Quest Complete
function handleQuestComplete() {
    chatState.isComplete = true;
    chatInput.disabled = true;
    sendBtn.disabled = true;

    // Progress bar to 100%
    progressBar.style.width = '100%';
    wordCountDisplay.textContent = `✅ ${chatState.totalWordCount} kata - Selesai!`;

    // Send success messages
    let delay = 500;
    botResponses.success.forEach((msg, index) => {
        setTimeout(() => {
            addBotMessage(msg);
        }, delay + (index * 1500));
    });

    // Show photobox button after messages
    setTimeout(() => {
        toPhotoboxBtn.classList.remove('hidden');
        toPhotoboxBtn.classList.add('success-bounce');

        // Trigger confetti
        if (typeof confetti !== 'undefined') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#40E0D0', '#FF6B6B', '#FF8FAB', '#F4D03F']
            });
        }
    }, delay + (botResponses.success.length * 1500) + 500);
}

// Get User Memories (for finale)
function getUserMemories() {
    return chatState.userMessages.join(' ');
}

// Reset Chat (for replay)
function resetChat() {
    chatState.messages = [];
    chatState.userMessages = [];
    chatState.totalWordCount = 0;
    chatState.isComplete = false;
    chatState.isTyping = false;

    if (chatMessagesContainer) {
        chatMessagesContainer.innerHTML = '';
    }
    if (chatInput) {
        chatInput.disabled = false;
        chatInput.value = '';
    }
    if (sendBtn) {
        sendBtn.disabled = false;
    }
    if (progressBar) {
        progressBar.style.width = '0%';
        progressBar.classList.remove('animate-pulse');
    }
    if (wordCountDisplay) {
        wordCountDisplay.textContent = '0/25 kata';
    }
    if (toPhotoboxBtn) {
        toPhotoboxBtn.classList.add('hidden');
        toPhotoboxBtn.classList.remove('success-bounce');
    }
}

// Export for global access
window.chatModule = {
    init: initChat,
    reset: resetChat,
    getMemories: getUserMemories
};
