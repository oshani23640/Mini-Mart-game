// Challenge puzzle lifecycle, prefetching, and answer validation

"use strict";

class PuzzleChallengeService {
    constructor() {
        this.currentPuzzle = null;
        this.prefetchedPuzzle = null;
        this.isPrefetching = false;
        this.isRequesting = false;

        this.prefetchNextPuzzle();
    }

    async prefetchNextPuzzle() {
        if (this.isPrefetching || this.prefetchedPuzzle) return;
        this.isPrefetching = true;
        // Prepare the next challenge early; checkout will retry if this fails
        try {
            this.prefetchedPuzzle = await FishPuzzleApiClient.fetchPuzzle();
        } catch (err) {
            // Handled when checkout requests the puzzle
        } finally {
            this.isPrefetching = false;
        }
    }

    async getChallengePuzzle() {
        if (this.isRequesting) return;
        this.isRequesting = true;
        this.currentPuzzle = null;
        eventBus.emit(GameEvents.PUZZLE_REQUESTED);

        // Use the prefetched challenge when available, otherwise request one now
        try {
            let puzzle = this.prefetchedPuzzle;
            this.prefetchedPuzzle = null;
            if (!puzzle) {
                puzzle = await FishPuzzleApiClient.fetchPuzzle();
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

    validateAnswer(guess) {
        if (!this.currentPuzzle) {
            return { correct: false, solution: 0 };
        }

        // Compare the entered count with the current puzzle's solution
        const solution = this.currentPuzzle.fish;
        return { correct: parseInt(guess, 10) === solution, solution };
    }
}

const puzzleChallengeService = new PuzzleChallengeService();
// Backward compatibility alias
const puzzleService = puzzleChallengeService;
