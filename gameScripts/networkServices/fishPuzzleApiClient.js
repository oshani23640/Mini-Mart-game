// external Fish Game web service

"use strict";

class FishPuzzleApiClient {
    static BASE_URL = "https://marcconrad.com/uob/fish/api.php";
    static TIMEOUT_MS = 6000;

    static async fetchPuzzle() {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

        // Bound the request, reject invalid responses, and return a normalized puzzle
        try {
            const response = await fetch(this.BASE_URL + "?out=json", {
                method: "GET",
                signal: controller.signal,
                headers: { Accept: "application/json" }
            });

            if (!response.ok) {
                throw new Error("HTTP Error: " + response.status + " " + response.statusText);
            }

            const data = await response.json();
            if (!data || typeof data.fish === "undefined" || !data.question) {
                throw new Error("Invalid payload schema received from Fish API");
            }

            return {
                question: data.question,
                fish: parseInt(data.fish, 10)
            };
        } finally {
            clearTimeout(timeoutId);
        }
    }
}

// Backward compatibility alias
const FishApiService = FishPuzzleApiClient;
