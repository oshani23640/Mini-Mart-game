// Player Login Form Controller

"use strict";

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Read the submitted credentials and authenticate with the server
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("../gameBackend/gameApi.php?action=login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
                credentials: "same-origin"
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Login failed.");
            }

            window.location.href = "mainMenu.php";
        } catch (error) {
            alert(error.message || "Unable to connect to the server.");
        }
    });
}
