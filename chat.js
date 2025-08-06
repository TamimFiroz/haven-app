document.addEventListener('DOMContentLoaded', () => {
    // MODIFICATION: The definitive fix for mobile keyboard layout issues
    const setVh = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);
    setVh(); // Set the value on initial load

    // --- THEME SWITCHER LOGIC ---
    const themeSwitcher = document.getElementById('theme-switcher');
    if (themeSwitcher) {
        // ... theme switcher logic remains the same ...
    }

    // --- CHAT PAGE ELEMENTS ---
    // ... all other element selections and logic remain the same ...
});

// Full JS for copy-paste convenience
document.addEventListener('DOMContentLoaded', () => {
    const setVh = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);
    setVh();

    const themeSwitcher = document.getElementById('theme-switcher');
    if (themeSwitcher) {
        const doc = document.documentElement;
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
    }

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

    peerSoultagEl.textContent = "No one's here yet";
    peerActivityEl.textContent = '';

    const initialHeight = messageInput.clientHeight;
    messageInput.addEventListener('input', () => {
        messageInput.style.height = 'auto';
        if (messageInput.scrollHeight > initialHeight) {
            const newHeight = Math.min(messageInput.scrollHeight, 120);
            messageInput.style.height = `${newHeight}px`;
        } else {
            messageInput.style.height = '';
        }
    });

    const sendMessage = () => {
        const messageText = messageInput.value.trim();
        if (messageText === '') return;
        const messageBubble = document.createElement('div');
        messageBubble.classList.add('message-bubble', 'sent');
        const paragraph = document.createElement('p');
        paragraph.textContent = messageText;
        messageBubble.appendChild(paragraph);
        messageArea.appendChild(messageBubble);
        messageInput.value = '';
        messageInput.style.height = 'auto';
        messageArea.scrollTop = messageArea.scrollHeight;
    };
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    const topEmojis = ['😂', '❤️', '😭', '👍', '😊', '🙏', '😍', '🔥', '🤔', '🥰', '🤣', '🎉', '💯', '✨', '👀', '💀', '😎', '😜', '😉', '👌', '😏', '😮', '💔', '😴', '🙄', '🙌', '🤷', '🤗', '🤢', '🥺', '✅', '➡️', '👇', '🤪', '👏', '🤝', '👋', '🤦', '🤞', '😅', '😇', '🤫', '😎', '😢', '🤯', '🥳', '👇', '💦', '🤔', '🤣'];
    topEmojis.forEach(emoji => {
        const button = document.createElement('button');
        button.textContent = emoji;
        emojiPalette.appendChild(button);
    });
    emojiButton.addEventListener('click', (e) => {
        e.stopPropagation();
        emojiPalette.classList.toggle('visible');
    });
    emojiPalette.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            messageInput.value += e.target.textContent;
            messageInput.focus();
        }
    });
    document.addEventListener('click', (e) => {
        if (!emojiPalette.contains(e.target) && !emojiButton.contains(e.target)) {
            emojiPalette.classList.remove('visible');
        }
    });

    exitButton.addEventListener('click', (e) => {
        e.stopPropagation();
        exitPanel.classList.add('visible');
    });
    cancelExitBtn.addEventListener('click', () => {
        exitPanel.classList.remove('visible');
    });
    confirmExitBtn.addEventListener('click', () => {
        window.location.href = 'home.html';
    });
    document.addEventListener('click', (e) => {
        if (!exitPanel.contains(e.target) && !exitButton.contains(e.target)) {
            exitPanel.classList.remove('visible');
        }
    });
});