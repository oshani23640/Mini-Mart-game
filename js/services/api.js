// Gets fish-counting puzzles from the Marc Conrad Fish Game API.

class FishApiService {
    static BASE_URL = "https://marcconrad.com/uob/fish/api.php";
    static TIMEOUT_MS = 6000;

    // Requests one puzzle from the API.
    static async fetchPuzzle() {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

        try {
            // Sends a GET request and asks for JSON.
            const response = await fetch(`${this.BASE_URL}?out=json`, {
                method: "GET",
                signal: controller.signal,
                headers: { Accept: "application/json" }
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
            }

            // Checks that the response has the puzzle fields.
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
