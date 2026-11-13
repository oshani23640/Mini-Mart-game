<?php require_once __DIR__ . '/authenticationGuard.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mini Mart | Menu</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Monoton&family=Ultra&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../gameStyles/menuStyles.css">
</head>

<body>
    <script>window.MINIMART_USERNAME = <?= json_encode($_SESSION['username'], JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT) ?>;</script>

    <main class="menu-card">
        <h1>MINI MART</h1>
        <h2>Welcome Back!</h2>

        <p class="welcome-text">
            Hello, <span id="player-name">Player</span>!
        </p>

        <p class="subtitle">
            Ready for your shopping adventure?
        </p>

        <div class="menu-buttons">
            <button type="button" class="menu-btn start-btn" onclick="startGame()">
                Start Game
            </button>

            <button type="button" class="menu-btn score-btn" onclick="viewScores()">
                Score History
            </button>

            <button type="button" class="menu-btn instructions-btn" onclick="showInstructions()">
                How to Play
            </button>

            <button type="button" class="menu-btn logout-btn" onclick="logout()">
                Logout
            </button>
        </div>
    </main>

    <script src="../gameScripts/userInterface/mainMenuController.js"></script>
</body>
</html>
