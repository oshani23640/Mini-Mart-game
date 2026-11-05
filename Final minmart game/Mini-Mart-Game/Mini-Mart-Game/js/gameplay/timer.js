// Runs, pauses, resumes and stops the game countdown.

class GameTimer {
    constructor() {
        // Stores the timer interval ID while the countdown is running, or null when the timer is stopped.
        this.intervalId = null;
        this.isPaused = false;
    }

    // Starts the countdown using the time limit stored in gameState and updates the game as time passes.
    start(gameState) {
        this.stop();
        this.isPaused = false;

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

// Shared game timer instance
const gameTimer = new GameTimer();
