<?php
require_once __DIR__ . '/../gameBackend/sessionManager.php';
if (!empty($_SESSION['user_id'])) {
    header('Location: mainMenu.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mini Mart - Sign Up</title>

    <link rel="stylesheet" href="../gameStyles/globalStyles.css">
    <link rel="stylesheet" href="../gameStyles/authenticationStyles.css">
</head>

<body>
    <div class="auth-page">
        <div class="auth-container">
            <img
                src="../gameAssets/authHeroBanner.jpg"
                alt="Mini Mart Shop"
                class="auth-background-image"
            >

            <div class="auth-box">
                <h1>Mini Mart</h1>
                <h2>Create Account</h2>

                <form id="signupForm">
                    <label for="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Enter username"
                        required
                    >

                    <label for="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter password"
                        required
                    >

                    <label for="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirm password"
                        required
                    >

                    <button type="submit">Sign Up</button>
                </form>

                <p>
                    Already have an account?
                    <a href="playerLogin.php">Login</a>
                </p>
            </div>
        </div>
    </div>

    <script src="../gameScripts/playerAuthentication/playerSignup.js"></script>
</body>
</html>
