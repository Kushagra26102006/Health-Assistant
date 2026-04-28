document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chat-container');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const typingIndicator = document.getElementById('typing-indicator');
    const themeToggle = document.getElementById('theme-toggle');
    const clearChatBtn = document.getElementById('clear-chat');
    
    // Sidebar & Mobile UI
    const sidebar = document.querySelector('.sidebar');
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebarChips = document.querySelectorAll('.sidebar-chip');
    
    // Modals
    const bmiTrigger = document.getElementById('bmi-trigger');
    const bmiModal = document.getElementById('bmi-modal');
    const closeBtn = document.querySelector('.close-btn');
    const calculateBmiBtn = document.getElementById('calculate-bmi');
    const bmiResult = document.getElementById('bmi-result');

    const API_URL = 'http://localhost:3000/chat';

    // ---- Mobile Sidebar Toggle ----
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });

    // ---- Theme Management ----
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i> <span>Dark Mode</span>';
    }

    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-theme');
        if (isDark) {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i> <span>Dark Mode</span>';
        } else {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i> <span>Light Mode</span>';
        }
    });

    // ---- Chat Logic ----
    function appendMessage(text, sender) {
        const isBot = sender === 'bot';
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}-message`;
        
        const avatarHtml = isBot 
            ? '<div class="avatar"><i class="fas fa-robot"></i></div>'
            : '';

        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        msgDiv.innerHTML = `
            ${avatarHtml}
            <div class="message-body">
                <div class="bubble">${text}</div>
                <span class="timestamp">${time}</span>
            </div>
        `;

        chatContainer.appendChild(msgDiv);
        scrollToBottom();
    }

    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    let isLoading = false;

    async function sendMessage(message) {
        if (isLoading || !message) return;

        isLoading = true;
        appendMessage(message, 'user');
        chatInput.value = '';
        
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
        }

        typingIndicator.classList.remove('hidden');
        scrollToBottom();

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            
            const data = await response.json();
            typingIndicator.classList.add('hidden');
            
            if (response.ok) {
                appendMessage(data.response, 'bot');
            } else {
                appendMessage("I'm sorry, I'm having trouble connecting to the medical database.", 'bot');
            }
        } catch (error) {
            typingIndicator.classList.add('hidden');
            appendMessage("Offline. Please ensure the backend server is running on port 3000.", 'bot');
        } finally {
            isLoading = false;
        }
    }

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sendMessage(chatInput.value.trim());
    });

    // Sidebar Chips (Fever, Headache, etc.)
    sidebarChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const query = chip.getAttribute('data-query');
            sendMessage(query);
            
            // UI Feedback: Mark active
            sidebarChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
        });
    });

    // Clear Chat
    clearChatBtn.addEventListener('click', () => {
        if (confirm("Clear all chat history?")) {
            chatContainer.innerHTML = '';
            appendMessage("History cleared. How can I assist you further?", 'bot');
        }
    });

    // ---- Modal Logic ----
    bmiTrigger.addEventListener('click', () => {
        bmiModal.classList.add('show');
    });

    closeBtn.addEventListener('click', () => {
        bmiModal.classList.remove('show');
    });

    window.addEventListener('click', (e) => {
        if (e.target === bmiModal) {
            bmiModal.classList.remove('show');
        }
    });

    calculateBmiBtn.addEventListener('click', () => {
        const height = parseFloat(document.getElementById('height').value);
        const weight = parseFloat(document.getElementById('weight').value);

        if (!height || !weight) {
            alert("Please enter height in meters and weight in kilograms.");
            return;
        }

        const bmi = (weight / (height * height)).toFixed(1);
        let category = '';

        if (bmi < 18.5) category = 'Underweight';
        else if (bmi < 25) category = 'Normal weight';
        else if (bmi < 30) category = 'Overweight';
        else category = 'Obese';

        bmiResult.innerHTML = `Your BMI is <strong>${bmi}</strong> (${category})`;
        bmiResult.classList.remove('hidden');
    });
});
