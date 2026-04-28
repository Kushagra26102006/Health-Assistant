# Health Assistant AI | Vanilla Edition

A modern, highly interactive Health Assistant web application built using pure **HTML, CSS, and JavaScript**. This project features a WhatsApp-inspired chat interface with real-time AI integration, quick action buttons, and a built-in BMI calculator.

## 🚀 Features

- **Vanilla Tech Stack:** Zero frameworks used (No Tailwind, No React) for maximum performance and compatibility.
- **Interactive Chatbot:** WhatsApp-like chat bubbles with smooth slide-up animations.
- **Quick Action Chips:** Instant buttons for Fever, Headache, Diet, and BMI for faster interaction.
- **BMI Calculator:** Follows the standard medical formula: `BMI = weight(kg) / (height(m) * height(m))`.
- **Typing Indicators:** Real-time feedback when the assistant is processing a query.
- **Dark/Light Mode:** Seamless theme switching with persistent storage.
- **AI-Powered:** Fallback responses powered by the Google Gemini API.
- **Responsive Design:** Fully adaptive for mobile and desktop screens.

---

## 📁 Project Structure

```text
ai/
├── backend/
│   ├── .env            # Store your API_KEY here
│   ├── package.json
│   └── server.js       # Node.js Express Server
├── data/
│   └── responses.json  # Predefined health tips
├── frontend/
│   ├── index.html      # Vanilla HTML Structure
│   ├── style.css       # Premium Pure CSS Styling
│   └── app.js          # Pure JavaScript Logic
└── README.md
```

---

## 🛠 Setup & Run Instructions

### 1. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure your `.env` file exists with your Gemini API key:
   ```env
   PORT=3000
   API_KEY=your_actual_api_key_here
   ```
4. Start the server:
   ```bash
   npm start
   ```

### 2. Frontend Setup
Simply open `frontend/index.html` in any modern web browser.

---

## 📸 Screenshots Section

*(Add your screenshots here after deployment or testing)*

1. **Main Chat Interface:** Modern glassmorphism look with centered container.
2. **Quick Actions:** Horizontal scrollable chips for symptoms and tools.
3. **BMI Calculator:** Pop-up modal with clean input forms and result categories.
4. **Dark Mode:** Deep blue/slate theme for low-light environments.

---

## ⚠️ Disclaimer
This application is for educational purposes. All medical advice provided is general and should not replace a consultation with a professional healthcare provider.
