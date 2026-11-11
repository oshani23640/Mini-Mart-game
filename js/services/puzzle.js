// Loads checkout puzzles and checks player answers.

class PuzzleService {
    constructor() {
        // Puzzle being answered, or null
        this.currentPuzzle = null;
        // Puzzle fetched in advance, or null
        this.prefetchedPuzzle = null;
        this.isPrefetching = false;
        this.isRequesting = false;

        // Fetch the first puzzle when the page opens
        this.prefetchNextPuzzle();
    }

    // Loads the next puzzle in the background.
    async prefetchNextPuzzle() {
        if (this.isPrefetching || this.prefetchedPuzzle) return;
        this.isPrefetching = true;
        try {
            this.prefetchedPuzzle = await FishApiService.fetchPuzzle();
        } catch (err) {
            // Ignored: checkout requests a puzzle again
        } finally {
            this.isPrefetching = false;
        }
    }

    // Gets a puzzle for checkout and announces progress with events.
    async getChallengePuzzle() {
        if (this.isRequesting) return;
        this.isRequesting = true;
        this.currentPuzzle = null;
        eventBus.emit(GameEvents.PUZZLE_REQUESTED);

        try {
            let puzzle = this.prefetchedPuzzle;
            this.prefetchedPuzzle = null;
            if (!puzzle) puzzle = await FishApiService.fetchPuzzle();

            this.currentPuzzle = puzzle;
            this.prefetchNextPuzzle();
            eventBus.emit(GameEvents.PUZZLE_LOADED, { question: puzzle.question });
        } catch (err) {
            eventBus.emit(GameEvents.PUZZLE_ERROR, { message: err.message });
        } finally {
            this.isRequesting = false;
        }
    }

    // Checks the player's answer against the current puzzle.
    validateAnswer(guess) {
        if (!this.currentPuzzle) {
            return { correct: false, solution: 0 };
        }

        const solution = this.currentPuzzle.fish;
        return { correct: parseInt(guess, 10) === solution, solution };
    }
}

// Shared puzzle service
const puzzleService = new PuzzleService();
