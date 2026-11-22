// external Tomato Game web service

"use strict";

class TomatoPuzzleApiClient {

    static BASE_URL = "https://marcconrad.com/uob/tomato/api.php";
    static TIMEOUT_MS = 6000;

    static async fetchPuzzle() {
        const controller = new AbortController();

        const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

        try {
            const response = await fetch(this.BASE_URL + "?out=json&t=" + Date.now(), {
                method: "GET",
                cache: "no-store",
                signal: controller.signal,
                headers: {
                    Accept: "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("HTTP Error: " + response.status + " " + response.statusText);
            }

            const data = await response.json();

            if (!data || typeof data.solution === "undefined" || !data.question) {
                throw new Error("Invalid payload schema received from Tomato API");
            }

            return {
                question: data.question,
                solution: parseInt(data.solution, 10)
            };
        } finally {
            clearTimeout(timeoutId);
        }
    }
}
