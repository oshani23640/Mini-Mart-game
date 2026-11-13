<?php require_once __DIR__ . '/authenticationGuard.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Score History | Mini Mart</title>

    <link rel="stylesheet" href="../gameStyles/globalStyles.css">
    <link rel="stylesheet" href="../gameStyles/difficultyStyles.css">
    <link rel="stylesheet" href="../gameStyles/scoreStyles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Skranji:wght@400;700&family=Ultra&display=swap" rel="stylesheet">
</head>

<body>
    <script>window.MINIMART_USERNAME = <?= json_encode($_SESSION['username'], JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT) ?>;</script>

    <main class="difficulty-container">
        <section class="difficulty-card">
            <h1>MINI MART</h1>
            <h2>Score History 🏆</h2>

            <p class="description">
                Check out your top shopping achievements and customer service masteries!
            </p>

            <div class="scores-table-wrapper">
                <table class="scores-table" id="scoresTable">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Player</th>
                            <th>Difficulty</th>
                            <th>Score</th>
                            <th>Date</th>
                        </tr>
                    </thead>

                    <tbody id="scoresBody">
                        <!-- Scores rendered dynamically -->
                    </tbody>
                </table>

                <div id="emptyMessage" class="empty-scores" hidden>
                    No games recorded yet! Go play and claim your spot on the leaderboard!
                </div>
            </div>

            <div class="btn-group">
                <button type="button" class="back-button" onclick="location.href='mainMenu.php'">
                    Back to Menu
                </button>

                <button type="button" class="back-button clear-btn" onclick="clearScores()">
                    Clear History
                </button>
            </div>
        </section>
    </main>

    <script src="../gameScripts/networkServices/scoreDataService.js" defer></script>
    <script src="../gameScripts/userInterface/scoreLeaderboardController.js" defer></script>
</body>
</html>
