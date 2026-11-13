// Client-server score persistence service.

"use strict";

class ScoreDataService {
    static BASE_URL = "../gameBackend/gameApi.php";

    static async saveScore(score, difficulty) {
        const response = await fetch(this.BASE_URL + "?action=save_score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify({ score, difficulty })
        });

        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || "Score could not be saved.");
        }
        return result;
    }

    static async getScores() {
        const response = await fetch(this.BASE_URL + "?action=get_scores", {
            method: "GET",
            credentials: "same-origin"
        });

        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || "Could not load scores.");
        }
        return result.scores || [];
    }

    static async clearScores() {
        const response = await fetch(this.BASE_URL + "?action=clear_scores", {
            method: "POST",
            credentials: "same-origin"
        });

        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || "Could not clear scores.");
        }
        return result;
    }
}

// Backward compatibility alias
const ScoreService = ScoreDataService;
