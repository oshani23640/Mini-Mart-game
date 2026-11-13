// Keyboard input management for player movements and interaction

"use strict";

class PlayerInputHandler {
    constructor() {
        this.keys = {};
        this.onInteract = null;
        this.isListening = false;

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    init(onInteractCallback) {
        this.onInteract = onInteractCallback;

        // Register listeners once so repeated initialization does not duplicate input
        if (!this.isListening) {
            window.addEventListener("keydown", this.handleKeyDown);
            window.addEventListener("keyup", this.handleKeyUp);
            window.addEventListener("blur", this.handleBlur);
            this.isListening = true;
        }
    }

    handleKeyDown(event) {
        const key = event.key;

        if (key.startsWith("Arrow") || key === " ") {
            event.preventDefault();
        }

        this.keys[key] = true;

        // Enter triggers the current interaction only once per key press
        if (key === "Enter" && !event.repeat) {
            if (typeof this.onInteract === "function") {
                this.onInteract();
            }
        }
    }

    handleKeyUp(event) {
        this.keys[event.key] = false;
    }

    handleBlur() {
        // Clear held keys when the game loses focus
        this.reset();
    }

    reset() {
        for (const k in this.keys) {
            delete this.keys[k];
        }
    }

    destroy() {
        // Remove all global listeners and release any held-key state
        window.removeEventListener("keydown", this.handleKeyDown);
        window.removeEventListener("keyup", this.handleKeyUp);
        window.removeEventListener("blur", this.handleBlur);
        this.isListening = false;
        this.reset();
    }
}

// Backward compatibility alias
const InputHandler = PlayerInputHandler;
