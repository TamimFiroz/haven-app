document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const usernameError = document.getElementById('username-error');
    const soultagTextElement = document.getElementById('soultag-text');
    const shuffleButton = document.getElementById('shuffle-button');
    const havenPopup = document.getElementById('haven-popup');
    const whatIsHavenLink = document.getElementById('what-is-haven-link');
    const popupCloseButton = document.getElementById('popup-close-btn');
    const subtitleText = document.getElementById('subtitle-text');

    let currentSoulTag = '';
    let isAnimatingTag = false;

    const phrases = ["Private rooms.", "Always secure.", "Go Haven."];
    let phraseIndex = 0;
    const scrambleAnimation = (element, text, onComplete) => {
        let i = 0;
        const scrambleInterval = setInterval(() => {
            const randomChars = '!?{}[]#@()<>*&^%$';
            let scrambledText = '';
            for (let j = 0; j < text.length; j++) {
                if (j <= i) scrambledText += text[j];
                else scrambledText += randomChars[Math.floor(Math.random() * randomChars.length)];
            }
            element.textContent = scrambledText;
            i++;
            if (i > text.length) {
                clearInterval(scrambleInterval);
                if (onComplete) onComplete();
            }
        }, 60);
    };
    const cyclePhrases = () => {
        scrambleAnimation(subtitleText, phrases[phraseIndex], () => {
            setTimeout(() => {
                phraseIndex = (phraseIndex + 1) % phrases.length;
                cyclePhrases();
            }, 750);
        });
    };
    cyclePhrases();

    function animateSoulTag(finalTag) {
        isAnimatingTag = true;
        let animationDuration = 600; let intervalSpeed = 50;
        let startTime = Date.now();
        let intervalId = setInterval(() => {
            if (Date.now() - startTime >= animationDuration) {
                clearInterval(intervalId);
                soultagTextElement.textContent = finalTag;
                isAnimatingTag = false;
                return;
            }
            soultagTextElement.textContent = Array.from({length: 10}, () => Math.floor(Math.random() * 10)).join('');
        }, intervalSpeed);
    }
    function generateAndAnimateSoulTag() {
        if (isAnimatingTag) return;
        const newTag = Array.from({length: 10}, () => Math.floor(Math.random() * 10)).join('');
        currentSoulTag = newTag;
        soultagTextElement.classList.remove('soultag-placeholder');
        animateSoulTag(newTag);
    }
    shuffleButton.addEventListener('click', generateAndAnimateSoulTag);
    
    whatIsHavenLink.addEventListener('click', () => havenPopup.classList.remove('hidden'));
    popupCloseButton.addEventListener('click', () => havenPopup.classList.add('hidden'));
    havenPopup.addEventListener('click', (e) => {
        if (e.target === havenPopup) havenPopup.classList.add('hidden');
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        usernameError.textContent = '';
        if (isAnimatingTag) return;

        const username = usernameInput.value.trim();
        if (!username) {
            usernameError.textContent = 'Username is required.';
            usernameInput.focus();
            return;
        }
        
        if (!currentSoulTag) {
            generateAndAnimateSoulTag();
        }

        const user = { username: username, soultag: currentSoulTag };
        sessionStorage.setItem('havenUser', JSON.stringify(user));
        
        window.location.href = 'home.html';
    });
});