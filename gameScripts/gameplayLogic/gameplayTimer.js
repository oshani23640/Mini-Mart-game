// Countdown game timer manager

"use strict";

class GameplayTimer {
    constructor() {
        this.intervalId = null;
        this.isPaused = false;
    }

    start(gameState) {
        this.stop();
        this.isPaused = false;

        // Tick once per second while the game is active, and end it at zero
        this.intervalId = setInterval(() => {
            if (this.isPaused || !gameState.running || gameState.isGameOver) {
                return;
            }

            gameState.time -= 1;
            eventBus.emit(GameEvents.TIME_TICK, gameState.time);

            if (gameState.time <= 0) {
                gameState.time = 0;
                this.stop();
                gameState.endGame(false, "Time is up!");
            }
        }, 1000);
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

const gameplayTimer = new GameplayTimer();
// Backward compatibility alias
const gameTimer = gameplayTimer;
const GameTimer = GameplayTimer;
