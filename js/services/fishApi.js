// Fish Game API Client
// Theme 3: Interoperability with external web service (Marc Conrad Fish Game API).

"use strict";

class FishApiService {
    static BASE_URL = "https://marcconrad.com/uob/fish/api.php";
    static TIMEOUT_MS = 6000;

    // Requests one puzzle from the external API
    static async fetchPuzzle() {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

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
