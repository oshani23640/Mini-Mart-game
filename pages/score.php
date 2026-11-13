<?php require_once __DIR__ . '/auth_guard.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Score History | Mini Mart</title>

    <link rel="stylesheet" href="../css/common.css">
    <link rel="stylesheet" href="../css/difficulty.css">
    <link rel="stylesheet" href="../css/score.css">
    <!-- Loads the fonts used by the page. -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Skranji:wght@400;700&family=Ultra&display=swap" rel="stylesheet">
</head>

<body>
    <script>window.MINIMART_USERNAME = <?= json_encode($_SESSION['username'], JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT) ?>;</script>

    <main class="difficulty-container">
        <section class="difficulty-card">
            <h1>MINI MART</h1>
            <h2> Score History 🏆</h2>

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
                        <!-- Saved scores appear here -->
                    </tbody>
                </table>

                <div id="emptyMessage" class="empty-scores" hidden>
                    No games recorded yet! Go play and claim your spot on the leaderboard!
                </div>
            </div>

            <div class="btn-group">
                <button type="button" class="back-button" onclick="location.href='menu.php'">
                    Back to Menu
                </button>

                <button type="button" class="back-button clear-btn" onclick="clearScores()">
                    Clear History
                </button>
            </div>
        </section>
    </main>

    <script src="../js/services/scoreService.js" defer></script>
    <script src="../js/ui/scoreHistory.js" defer></script>
</body>
</html>
