// Checks saved account details and starts a player session.

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

// Generate demo user hash if none exists
(async function initDefaultUser() {
    if (!localStorage.getItem("miniMartUser")) {
        const defaultHash = await hashPassword("password123");
        localStorage.setItem("miniMartUser", JSON.stringify({
            username: "player1",
            passwordHash: defaultHash,
            createdAt: new Date().toISOString()
        }));
    }
})();

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        const rawUser = localStorage.getItem("miniMartUser");
        if (!rawUser) {
            alert("No account found. Please sign up first.");
            return;
        }

        const savedUser = JSON.parse(rawUser);
        const inputHash = await hashPassword(password);

        // Compares the entered password with the saved password data
        const isMatch = (
            username.toLowerCase() === savedUser.username.toLowerCase() &&
            (savedUser.passwordHash === inputHash || savedUser.password === password)
        );

        if (isMatch) {
            // Creates a player session
            const sessionToken = "session_" + Math.random().toString(36).substr(2) + Date.now();
            sessionStorage.setItem("miniMartSessionToken", sessionToken);

            localStorage.setItem("miniMartLoggedIn", "true");
            localStorage.setItem("playerName", savedUser.username);

            alert(`Welcome back, ${savedUser.username}!`);
            window.location.href = "menu.html";
        } else {
            alert("Invalid username or password.");
        }
    });
}
