// Challenge Puzzle Management
// Manages puzzle fetching lifecycle, pre-fetching, and answer validation.

"use strict";

class PuzzleService {
    constructor() {
        this.currentPuzzle = null;
        this.prefetchedPuzzle = null;
        this.isPrefetching = false;
        this.isRequesting = false;

        // Prefetch first challenge puzzle on startup
        this.prefetchNextPuzzle();
    }

    // Pre-fetches the next puzzle in the background for instant load
    async prefetchNextPuzzle() {
        if (this.isPrefetching || this.prefetchedPuzzle) return;
        this.isPrefetching = true;
        try {
            this.prefetchedPuzzle = await FishApiService.fetchPuzzle();
        } catch (err) {
            // Handled gracefully when checkout requests the puzzle
        } finally {
            this.isPrefetching = false;
        }
    }

    // Requests puzzle for checkout and emits corresponding events
    async getChallengePuzzle() {
        if (this.isRequesting) return;
        this.isRequesting = true;
        this.currentPuzzle = null;
        eventBus.emit(GameEvents.PUZZLE_REQUESTED);

        try {
            let puzzle = this.prefetchedPuzzle;
            this.prefetchedPuzzle = null;
            if (!puzzle) {
                puzzle = await FishApiService.fetchPuzzle();
            }

            this.currentPuzzle = puzzle;
            this.prefetchNextPuzzle();
            eventBus.emit(GameEvents.PUZZLE_LOADED, { question: puzzle.question });
        } catch (err) {
            eventBus.emit(GameEvents.PUZZLE_ERROR, { message: err.message });
        } finally {
            this.isRequesting = false;
        }
    }

    // Validates the player's answer against the current puzzle solution
    validateAnswer(guess) {
        if (!this.currentPuzzle) {
            return { correct: false, solution: 0 };
        }

        const solution = this.currentPuzzle.fish;
        return { correct: parseInt(guess, 10) === solution, solution };
    }
}

// Shared puzzle service instance
const puzzleService = new PuzzleService();
