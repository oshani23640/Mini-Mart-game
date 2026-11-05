// Requests fish-counting puzzles from the Fish Game API and creates a local puzzle if the service is unavailable.

class FishApiService {
    static BASE_URL = "https://marcconrad.com/uob/fish/api.php";
    static TIMEOUT_MS = 6000;

    // Requests a new fish-counting puzzle from the Fish Game web API. The returned result contains the puzzle question, its fish-count answer, and any optional challenge or fallback information.
    static async fetchPuzzle() {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

        try {
            // Sends an HTTPS GET request and asks the API to return JSON data
            const response = await fetch(`${this.BASE_URL}?out=json`, {
                method: "GET",
                signal: controller.signal,
                headers: {
                    "Accept": "application/json"
                }
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
            }

            // Reads the JSON response from the API
            const data = await response.json();

            // Checks that the response contains the expected puzzle fields
            if (!data || typeof data.fish === "undefined" || !data.question) {
                throw new Error("Invalid payload schema received from Fish API");
            }

            return {
                question: data.question,
                fish: parseInt(data.fish, 10),
                chest: typeof data.chest !== "undefined" ? parseInt(data.chest, 10) : null,
                isFallback: false
            };

        } catch (error) {
    clearTimeout(timeoutId);
    console.error("Failed to load Fish Game API:", error.message);
    throw error;
}
    }

}
