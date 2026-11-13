<?php require_once __DIR__ . '/auth_guard.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mini Mart | Menu</title>

<!-- Loads the fonts used by the page. -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Monoton&family=Ultra&display=swap" rel="stylesheet">
    <!-- Loads the menu page styles. -->
    <link rel="stylesheet" href="../css/menu.css">
</head>

<body>
    <script>window.MINIMART_USERNAME = <?= json_encode($_SESSION['username'], JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT) ?>;</script>

    <main class="menu-card">
        <!-- Displays the Mini Mart game title. -->
        <h1>MINI MART</h1>

        <!-- Displays the welcome message. -->
        <h2>Welcome Back!</h2>

        <!-- Displays the current player name. -->
        <p class="welcome-text">
            Hello, <span id="player-name">Player</span>!
        </p>

        <!-- Displays the menu introduction. -->
        <p class="subtitle">
            Ready for your shopping adventure?
        </p>

        <!-- Menu buttons -->

<div class="menu-buttons">
    <button type="button"
            class="menu-btn start-btn"
            onclick="startGame()">
        Start Game
    </button>

    <button type="button"
            class="menu-btn score-btn"
            onclick="viewScores()">
        Score History
    </button>

    <button type="button"
            class="menu-btn instructions-btn"
            onclick="showInstructions()">
        How to Play
    </button>

    <button type="button"
            class="menu-btn logout-btn"
            onclick="logout()">
        Logout
    </button>
</div>
    </main>

    <!-- Page script -->
    <script src="../js/ui/menu.js"></script>
</body>
</html>
