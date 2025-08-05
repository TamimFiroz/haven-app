document.addEventListener('DOMContentLoaded', () => {
    const socket = io("https://haven-chat-backend.onrender.com");
    const user = JSON.parse(sessionStorage.getItem('havenUser'));
    if (!user) { window.location.href = 'index.html'; return; }
    socket.on('connect', () => { console.log('Connected to backend server with ID:', socket.id); });
    const themeSwitcher = document.getElementById('theme-switcher');
    const doc = document.documentElement;
    const roomForm = document.getElementById('room-form');
    const roomCodeInput = document.getElementById('room-code');
    const roomPasswordInput = document.getElementById('room-password');
    const codeError = document.getElementById('code-error');
    const passwordError = document.getElementById('password-error');
    const tabButtons = document.querySelectorAll('.tab-button');
    const actionButton = document.getElementById('action-button');
    const removeButton = document.getElementById('remove-button');
    const buttonText = actionButton.querySelector('.button-text');
    const buttonLoader = actionButton.querySelector('.button-loader');
    let currentView = 'create';
    const applyTheme = (theme) => { doc.classList.remove('light', 'dark'); doc.classList.add(theme); localStorage.setItem('theme', theme); };
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
    themeSwitcher.addEventListener('click', () => { const newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark'; applyTheme(newTheme); });
    tabButtons.forEach(button => { button.addEventListener('click', () => { tabButtons.forEach(btn => btn.classList.remove('active')); button.classList.add('active'); currentView = button.dataset.view; buttonText.textContent = currentView === 'create' ? 'Create' : 'Join'; actionButton.className = `action-button ${currentView}`; }); });
    removeButton.addEventListener('click', () => { roomCodeInput.value = ''; roomPasswordInput.value = ''; codeError.textContent = ''; passwordError.textContent = ''; });
    roomForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        codeError.textContent = ''; passwordError.textContent = '';
        if (roomForm.code.value.length < 4) { codeError.textContent = 'Code must be at least 4 characters.'; isValid = false; } else if (!/^[A-Za-z0-9]+$/.test(roomForm.code.value)) { codeError.textContent = 'Code can only contain letters and numbers.'; isValid = false; }
        if (roomForm.password.value.length < 5) { passwordError.textContent = 'Password must be at least 5 numbers.'; isValid = false; } else if (!/^[0-9]+$/.test(roomForm.password.value)) { passwordError.textContent = 'Password can only contain numbers.'; isValid = false; }
        if (isValid) {
            setLoading(true);
            const roomDetails = { code: roomCodeInput.value, password: roomPasswordInput.value, user: user };
            sessionStorage.setItem('havenRoomCode', roomDetails.code);
            sessionStorage.setItem('havenRoomPassword', roomDetails.password);
            if (currentView === 'create') { socket.emit('createRoom', roomDetails); } else { socket.emit('joinRoom', roomDetails); }
        }
    });
    socket.on('roomActionSuccess', () => { window.location.href = 'chat.html'; });
    socket.on('roomError', (errorMessage) => { codeError.textContent = errorMessage; setLoading(false); });
    function setLoading(isLoading) { if (isLoading) { buttonText.classList.add('hidden'); buttonLoader.classList.remove('hidden'); actionButton.disabled = true; removeButton.disabled = true; } else { buttonText.classList.remove('hidden'); buttonLoader.classList.add('hidden'); actionButton.disabled = false; removeButton.disabled = false; } }
});