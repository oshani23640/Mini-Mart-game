"use strict";

class BonusPuzzleService {

    constructor() {
        this.currentPuzzle = null;
        this.prefetchedPuzzle = null;
        this.isPrefetching = false;

        this.prefetchNextPuzzle();
    }

    async prefetchNextPuzzle() {
        if (this.isPrefetching || this.prefetchedPuzzle) return;

        this.isPrefetching = true;

        try {
            this.prefetchedPuzzle = await TomatoPuzzleApiClient.fetchPuzzle();
        } catch (err) {
        } finally {
            this.isPrefetching = false;
        }
    }

    async getPuzzle() {
        let puzzle = this.prefetchedPuzzle;
        this.prefetchedPuzzle = null;

        if (!puzzle) {
            puzzle = await TomatoPuzzleApiClient.fetchPuzzle();
        }

        this.currentPuzzle = puzzle;
        this.prefetchNextPuzzle();

        return puzzle;
    }

    validateAnswer(guess) {
        if (!this.currentPuzzle) return false;

        return parseInt(guess, 10) === this.currentPuzzle.solution;
    }
}

const bonusPuzzleService = new BonusPuzzleService();
