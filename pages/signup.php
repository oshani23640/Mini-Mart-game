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
    <title>Mini Mart - Sign Up</title>

    <!-- Loads the shared page styles. -->
    <link rel="stylesheet" href="../css/common.css">
    <!-- Auth styles -->
    <link rel="stylesheet" href="../css/auth.css">
</head>

<body>
    <!-- Registration page -->
    <div class="auth-page">
        <!-- Holds the registration content. -->
        <div class="auth-container">
            <!-- Displays the page background image. -->
            <img
                src="../images/mini.jpg"
                alt="Mini Mart Shop"
                class="auth-background-image"
            >

            <!-- Registration form -->
            <div class="auth-box">
                <!-- Displays the game logo and title. -->
                <h1>Mini Mart</h1>

                <h2>Create Account</h2>

                <!-- Sign-up fields -->
                <form id="signupForm">
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

                    <!-- Confirm password -->
                    <label for="confirmPassword">
                        Confirm Password
                    </label>

                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirm password"
                        required
                    >

                    <!-- Submits the new account details. -->
                    <button type="submit">
                        Sign Up
                    </button>
                </form>

                <!-- Opens the login page. -->
                <p>
                    Already have an account?
                    <a href="login.php">Login</a>
                </p>
            </div>
        </div>
    </div>

    <!-- Sign-up script -->
    <script src="../js/auth/signup.js"></script>
</body>
</html>
