// Loads checkout puzzles, prepares the next puzzle and checks player answers.

class PuzzleService {
    constructor() {
        // Stores a puzzle object containing the question and answer, or null when no puzzle is available.
        this.currentPuzzle = null;
        // Stores a puzzle object containing the question and answer, or null when no puzzle is available.
        this.prefetchedPuzzle = null;
        this.isLoading = false;

        // Automatically prefetch first puzzle upon instantiation
        this.prefetchNextPuzzle();
    }

    // Load the next puzzle in the background so it is ready when checkout opens.
    async prefetchNextPuzzle() {
        if (this.isLoading || this.prefetchedPuzzle) return;
        this.isLoading = true;
        try {
            this.prefetchedPuzzle = await FishApiService.fetchPuzzle();
        } catch (err) {
            console.error("Failed to prefetch puzzle:", err);
        } finally {
            this.isLoading = false;
        }
    }

    // Gets a puzzle for checkout. It uses a puzzle fetched in advance when available; otherwise, it requests a new one from the Fish Game API.
    async getChallengePuzzle() {
        eventBus.emit(GameEvents.PUZZLE_REQUESTED);

        if (this.prefetchedPuzzle) {
            this.currentPuzzle = this.prefetchedPuzzle;
            this.prefetchedPuzzle = null;
            // Queue next prefetch
            this.prefetchNextPuzzle();
        } else {
            this.isLoading = true;
            this.currentPuzzle = await FishApiService.fetchPuzzle();
            this.isLoading = false;
        }

        eventBus.emit(GameEvents.PUZZLE_LOADED, {
            question: this.currentPuzzle.question,
        });

        return this.currentPuzzle;
    }

    // Checks the player's fish-count answer against the solution for the current puzzle. guess is the number entered by the player. The result says whether the answer is correct and provides the correct answer.
    validateAnswer(guess) {
        if (!this.currentPuzzle) {
            return { correct: false, solution: 0 };
        }

        const numGuess = parseInt(guess, 10);
        const solution = this.currentPuzzle.fish;
        const correct = numGuess === solution;

        eventBus.emit(GameEvents.PUZZLE_ANSWERED, {
            guess: numGuess,
            solution: solution,
            correct: correct
        });

        return { correct, solution };
    }
}

// Shared puzzle service instance
const puzzleService = new PuzzleService();
