// static/js/hero-typing.js
(() => {
    // The text to type
    const fullName = "MOHANRAJ K";
    const el = document.getElementById("typed-name");
    if (!el) return;

    const delayBetweenChars = 80;   // ms per char
    const delayAfter = 300;         // ms pause after typing complete

    let index = 0;

    // Optionally show a short pre-delay for effect
    const startDelay = 300;

    function typeChar() {
        if (index <= fullName.length - 1) {
            el.textContent = fullName.slice(0, index + 1);
            index++;
            setTimeout(typeChar, delayBetweenChars + Math.random() * 40);
        } else {
            // Once fully typed, keep caret blinking; optionally loop or hold
            setTimeout(() => {
                // you can uncomment next line to erase & retype in loop
                // eraseAndRetype();
            }, delayAfter);
        }
    }

    // optional erase loop (commented by default)
    function eraseAndRetype() {
        let idx = fullName.length;
        const eraser = setInterval(() => {
            idx--;
            el.textContent = fullName.slice(0, idx);
            if (idx <= 0) {
                clearInterval(eraser);
                index = 0;
                setTimeout(typeChar, 250);
            }
        }, 40);
    }

    // kick off
    setTimeout(typeChar, startDelay);
})();