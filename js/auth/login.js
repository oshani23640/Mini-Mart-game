// Sends login details to the PHP backend.

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        try {
            // Send login details to the PHP backend.
            const response = await fetch("../backend/api.php?action=login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
                credentials: "same-origin"
            });

            const result = await response.json();

            if (!response.ok || !result.success)
                throw new Error(result.message || "Login failed.");

            // Redirect to the game menu after successful login.
            window.location.href = "menu.php";

        } catch (error) {
            alert(error.message || "Unable to connect to the server.");
        }
    });
}