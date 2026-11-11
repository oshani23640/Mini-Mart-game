// Runs the game countdown.

class GameTimer {
    constructor() {
        // Interval ID while running, otherwise null
        this.intervalId = null;
        this.isPaused = false;
    }

    // Counts down from the time stored in gameState.
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

// Shared game timer
const gameTimer = new GameTimer();
