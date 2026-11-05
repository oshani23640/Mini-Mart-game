// Creates a player account and stores a SHA-256 password hash.

// Converts the player's password into a secure SHA-256 hash and returns the hash as hexadecimal text. The password parameter is the text entered by the player.
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (!username || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }

        if (password.length < 4) {
            alert("Password should be at least 4 characters.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        // Converts the password into a hash before saving it
        const hashedPassword = await hashPassword(password);

        // Saves the new account in localStorage
        const user = {
            username: username,
            passwordHash: hashedPassword,
            createdAt: new Date().toISOString()
        };

        localStorage.setItem("miniMartUser", JSON.stringify(user));

        alert("Your account has been created successfully!");
        window.location.href = "login.html";
    });
}