// Stores the current game settings, score, time, lives and status.

class GameState {
    // Creates the game state using the selected difficulty settings, such as the game time, number of lives, and scoring values.
    constructor(difficultyConfig = {}) {
        this.difficulty = difficultyConfig.name || "Easy";
        this.initialTime = difficultyConfig.time || 90;
        this.initialLives = difficultyConfig.lives || 3;
        this.pointsPerOrder = difficultyConfig.pointsPerOrder || 10;
        this.puzzleBonus = difficultyConfig.puzzleBonus || 15;
        this.orderSize = difficultyConfig.orderSize || 2;

        // Stores the completed orders and the number needed to win.
        this.ordersCompleted = 0;
        this.targetOrders = 10;

        this.score = 0;
        this.time = this.initialTime;
        this.lives = this.initialLives;
        this.running = false;
        this.isGameOver = false;
        this.isPuzzleModalOpen = false;

        // Stores the customer currently being served, or null when no customer is active.
        this.currentCustomer = null;
    }

    reset() {
        this.score = 0;
        this.time = this.initialTime;
        this.lives = this.initialLives;
        this.running = true;
        this.isGameOver = false;
        this.isPuzzleModalOpen = false;
        this.currentCustomer = null;
        this.ordersCompleted = 0;

        eventBus.emit(GameEvents.SCORE_CHANGED, this.score);
        eventBus.emit(GameEvents.LIVES_CHANGED, this.lives);
        eventBus.emit(GameEvents.TIME_TICK, this.time);
    }

    addScore(amount) {
        this.score += amount;
        eventBus.emit(GameEvents.SCORE_CHANGED, this.score);
    }

    deductLife() {
        this.lives -= 1;
        eventBus.emit(GameEvents.LIVES_CHANGED, this.lives);
        if (this.lives <= 0) {
            this.lives = 0;
            this.endGame(false, "Out of Lives!");
        }
    }

    endGame(won, reason = "") {
        if (this.isGameOver) return;
        this.isGameOver = true;
        this.running = false;
        eventBus.emit(GameEvents.GAME_OVER, { won, score: this.score, reason });
    }
}
