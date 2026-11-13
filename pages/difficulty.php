<?php
require_once __DIR__ . '/auth_guard.php';
require_once __DIR__ . '/../backend/config.php';
$levels = load_json('levels');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Choose Difficulty | Mini Mart</title>

    <!-- Page styles -->
    <link rel="stylesheet" href="../css/common.css">
    <link rel="stylesheet" href="../css/difficulty.css">
    <!-- Loads the fonts used by the page. -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Skranji:wght@400;700&family=Ultra&display=swap"
        rel="stylesheet">

    <!-- Page script -->
    <script src="../js/ui/difficulty.js" defer></script>
</head>

<body>
    <script>window.MINIMART_USERNAME = <?= json_encode($_SESSION['username'], JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT) ?>;</script>

    <main class="difficulty-container">
        <section class="difficulty-card">
            <h1>MINI MART</h1>

            <h2>Choose Your Challenge!</h2>

            <p class="description">
                Welcome to your Mini Mart adventure!
                Choose your difficulty, serve your customers,
                collect points, and become a shopping superstar!
            </p>

            <!-- Difficulty options -->
            <div class="difficulty-options">
                <!-- Easy option -->
                <button
                    type="button"
                    class="difficulty-button easy"
                    onclick="selectDifficulty('easy')">

                    <span class="level-name">EASY</span>

                    <span class="level-description">
                        Take it easy!
                    </span>

                    <span class="level-detail">
                        ⏱ <?= (int)$levels['easy']['time'] ?> Seconds · ❤️ <?= (int)$levels['easy']['lives'] ?> Lives
                    </span>
                </button>

                <!-- Medium option -->
                <button
                    type="button"
                    class="difficulty-button medium"
                    onclick="selectDifficulty('medium')">

                    <span class="level-name">MEDIUM</span>

                    <span class="level-description">
                        Time to get busy!
                    </span>

                    <span class="level-detail">
                        ⏱ <?= (int)$levels['medium']['time'] ?> Seconds · ❤️ <?= (int)$levels['medium']['lives'] ?> Lives
                    </span>
                </button>

                <!-- Difficult option -->
                <button
                    type="button"
                    class="difficulty-button difficult"
                    onclick="selectDifficulty('difficult')">

                    <span class="level-name">DIFFICULT</span>

                    <span class="level-description">
                        Ready for the challenge?
                    </span>

                    <span class="level-detail">
                        ⏱ <?= (int)$levels['difficult']['time'] ?> Seconds · ❤️ <?= (int)$levels['difficult']['lives'] ?> Lives
                    </span>
                </button>
            </div>

            <!-- Back to menu -->
            <button
                type="button"
                class="back-button"
                onclick="goBack()">
                    Back to Menu
            </button>
        </section>
    </main>
</body>
</html>
