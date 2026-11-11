<?php
require_once __DIR__ . '/../backend/session.php';
if (!empty($_SESSION['user_id'])) {
    header('Location: menu.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mini Mart - Login</title>

    <!-- Loads the shared page styles. -->
    <link rel="stylesheet" href="../css/common.css">
    <!-- Auth styles -->
    <link rel="stylesheet" href="../css/auth.css">
</head>

<body>
    <!-- Login page -->
    <div class="auth-page">
        <!-- Image and form -->
        <div class="auth-container">
            <!-- Background image -->
            <img
                src="../images/mini.jpg"
                alt="Mini Mart Shop"
                class="auth-background-image"
            >

            <!-- Login form -->
            <div class="auth-box">
                <!-- Displays the page title. -->
                <h1>Mini Mart</h1>

                <h2>Login</h2>

                <!-- Collects the username and password. -->
                <form id="loginForm">
                    <!-- Collects the player username. -->
                    <label for="username">
                        Username
                    </label>

                    <input
                        type="text"
                        id="username"
                        placeholder="Enter username"
                        required
                    >

                    <!-- Collects the player password. -->
                    <label for="password">
                        Password
                    </label>

                    <input
                        type="password"
                        id="password"
                        placeholder="Enter password"
                        required
                    >

                    <!-- Submits the login details. -->
                    <button type="submit">
                        Login
                    </button>
                </form>

                <!-- Opens the registration page. -->
                <p>
                    Don't have an account?
                    <a href="signup.php">
                        Sign Up
                    </a>
                </p>
            </div>
        </div>
    </div>

    <!-- Login script -->
    <script src="../js/auth/login.js"></script>
</body>
</html>
