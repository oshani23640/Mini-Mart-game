// Sends sign-up details to the PHP backend.

const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        // Validate the sign-up details.
        if (!username || !password || !confirmPassword)
            return alert("Please fill in all fields.");

        if (password.length < 6)
            return alert("Password should be at least 6 characters.");

        if (password !== confirmPassword)
            return alert("Passwords do not match.");

        try {
            // Send sign-up details to the PHP backend.
            const response = await fetch("../backend/api.php?action=signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
                credentials: "same-origin"
            });

            const result = await response.json();

            if (!response.ok || !result.success)
                throw new Error(result.message || "Sign up failed.");

            alert("Your account has been created successfully! Please log in.");

            // Redirect to the login page after successful registration.
            window.location.href = "login.php";

        } catch (error) {
            alert(error.message || "Unable to connect to the server.");
        }
    });
}