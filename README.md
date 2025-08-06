Haven Chat App

Haven is a modern, privacy-focused real-time chat web application designed for seamless one-on-one conversations. Built with a clean, responsive UI, it works perfectly on both desktop and mobile devices.

Features

- Instant Messaging: Real-time text chat powered by Socket.IO.
- Room System: Create or join private chat rooms using a code and password.
- Typing Indicators: See when your peer is typing or online.
- Emoji Support: Quick emoji palette for expressive messaging.
- Theme Switcher: Toggle between light and dark modes instantly.
- Responsive Design: Optimized for all screen sizes, with special handling for mobile keyboard issues.
- Privacy: No persistent message storage; chats are ephemeral and private.
- Exit Confirmation: Easy exit with confirmation panel to prevent accidental room leaving.
- User Status: See peer's username and activity status in the header.
- Auto-Scroll: Chat view always scrolls to the latest message.

How It Works

1. Login: Enter a username, room code, and password to join or create a chat room.
2. Chat: Exchange messages in real time. See when your peer is online or typing.
3. Emojis: Click the emoji button to open the palette and insert emojis into your message.
4. Theme: Use the theme switcher to toggle between light and dark modes.
5. Exit: Click the exit button to leave the room, with a confirmation prompt.

Technology Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express, Socket.IO

Mobile Optimization
Haven uses a JavaScript-powered viewport fix to ensure the chat input is always visible above the mobile keyboard, providing a seamless experience on phones and tablets.

Getting Started
1. Clone the repository.
2. Install backend dependencies (`cd backend && npm install`).
3. Start the backend server (`node server.js`).
4. Open `index.html` in your browser.
