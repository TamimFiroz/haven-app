document.addEventListener('DOMContentLoaded', () => {
    const setVh = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);
    setVh();

    const user = JSON.parse(sessionStorage.getItem('havenUser'));
    const roomCode = sessionStorage.getItem('havenRoomCode');
    if (!user || !roomCode) {
        window.location.href = 'index.html';
        return;
    }

    const socket = io("https://haven-chat-backend.onrender.com");

    const themeSwitcher = document.getElementById('theme-switcher');
    const doc = document.documentElement;
    const messageArea = document.getElementById('message-area');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const emojiButton = document.getElementById('emoji-button');
    const emojiPalette = document.getElementById('emoji-palette');
    const exitButton = document.getElementById('exit-button');
    const exitPanel = document.getElementById('exit-panel');
    const confirmExitBtn = document.getElementById('confirm-exit-btn');
    const cancelExitBtn = document.getElementById('cancel-exit-btn');
    const peerSoultagEl = document.getElementById('peer-soultag');
    const peerActivityEl = document.getElementById('peer-activity');
    let typingTimeout;

    const applyTheme = (theme) => {
        doc.classList.remove('light', 'dark');
        doc.classList.add(theme);
        localStorage.setItem('theme', theme);
    };
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    themeSwitcher.addEventListener('click', () => {
        const newTheme = doc.classList.contains('dark') ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    const initialHeight = messageInput.clientHeight;
    messageInput.addEventListener('input', () => {
        socket.emit('typing', { roomCode });
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => { socket.emit('stopTyping', { roomCode }); }, 1000);
        messageInput.style.height = 'auto';
        if (messageInput.scrollHeight > initialHeight) {
            const newHeight = Math.min(messageInput.scrollHeight, 120);
            messageInput.style.height = `${newHeight}px`;
        } else {
            messageInput.style.height = '';
        }
    });

    const addMessage = (message) => {
        const welcomeEl = document.getElementById('welcome-message');
        if (welcomeEl) welcomeEl.remove();
        const messageBubble = document.createElement('div');
        messageBubble.classList.add('message-bubble', message.sender === user.username ? 'sent' : 'received');
        const paragraph = document.createElement('p');
        paragraph.textContent = message.text;
        messageBubble.appendChild(paragraph);
        messageArea.appendChild(messageBubble);
        messageArea.scrollTop = messageArea.scrollHeight;
    };

    const sendMessage = () => {
        const messageText = messageInput.value.trim();
        if (messageText === '') return;
        const message = { sender: user.username, text: messageText };
        addMessage(message);
        socket.emit('sendMessage', { roomCode, message });
        messageInput.value = '';
        messageInput.style.height = 'auto';
        clearTimeout(typingTimeout);
        socket.emit('stopTyping', { roomCode });
    };

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });

    const topEmojis = ['😂', '❤️', '😭', '👍', '😊', '🙏', '😍', '🔥', '🤔', '🥰', '🤣', '🎉', '💯', '✨', '👀', '💀', '😎', '😜', '😉', '👌', '😏', '😮', '💔', '😴', '🙄', '🙌', '🤷', '🤗', '🤢', '🥺', '✅', '➡️', '👇', '🤪', '👏', '🤝', '👋', '🤦', '🤞', '😅', '😇', '🤫', '😎', '😢', '🤯', '🥳', '👇', '💦', '🤔', '🤣'];
    topEmojis.forEach(emoji => {
        const button = document.createElement('button');
        button.textContent = emoji;
        emojiPalette.appendChild(button);
    });
    emojiButton.addEventListener('click', (e) => { e.stopPropagation(); emojiPalette.classList.toggle('visible'); });
    emojiPalette.addEventListener('click', (e) => { if (e.target.tagName === 'BUTTON') { messageInput.value += e.target.textContent; messageInput.focus(); } });
    document.addEventListener('click', (e) => { if (!emojiPalette.contains(e.target) && !emojiButton.contains(e.target)) { emojiPalette.classList.remove('visible'); } });

    exitButton.addEventListener('click', (e) => { e.stopPropagation(); exitPanel.classList.add('visible'); });
    cancelExitBtn.addEventListener('click', () => { exitPanel.classList.remove('visible'); });
    confirmExitBtn.addEventListener('click', () => { window.location.href = 'home.html'; });
    document.addEventListener('click', (e) => { if (!exitPanel.contains(e.target) && !exitButton.contains(e.target)) { exitPanel.classList.remove('visible'); } });

    window.addEventListener('beforeunload', () => { socket.disconnect(); });
    history.pushState(null, "", location.href);
    window.onpopstate = function () { history.go(1); exitPanel.classList.add('visible'); };

    socket.on('connect', () => {
        console.log(`[CONNECTED] Frontend connected. Emitting enterRoom for room: ${roomCode}`);
        socket.emit('enterRoom', { code: roomCode, user: user });
    });

    socket.on('initialRoomData', (data) => {
        console.log('[INITIAL DATA] Received initial room data:', data);
        const welcomeEl = document.getElementById('welcome-message');
        if (welcomeEl) welcomeEl.remove();
        messageArea.innerHTML = '';
        if (data.messages && data.messages.length > 0) {
            data.messages.forEach(addMessage);
        } else if (!data.peer) {
            messageArea.innerHTML = `<div class="welcome-message" id="welcome-message"><span class="material-symbols-outlined welcome-icon">lock</span><h2 class="welcome-title">Room Created</h2><p class="welcome-description">Share the Code & Password with a friend to start chatting.</p></div>`;
        }
        if (data.peer) {
            peerSoultagEl.textContent = data.peer.username;
            peerActivityEl.textContent = 'Online';
        } else {
            peerSoultagEl.textContent = "No one's here yet";
            peerActivityEl.textContent = '';
        }
    });

    socket.on('peerJoined', (peer) => {
        console.log('[PEER JOINED]', peer);
        const welcomeEl = document.getElementById('welcome-message');
        if (welcomeEl) welcomeEl.remove();
        peerSoultagEl.textContent = peer.username;
        peerActivityEl.textContent = 'Online';
    });

    socket.on('peerLeft', () => {
        console.log('[PEER LEFT]');
        peerSoultagEl.textContent = "User left";
        peerActivityEl.textContent = '';
    });

    socket.on('receiveMessage', (message) => { addMessage(message); });
    socket.on('peerTyping', () => { peerActivityEl.textContent = 'Typing...'; });
    socket.on('peerStoppedTyping', () => { peerActivityEl.textContent = 'Online'; });
});