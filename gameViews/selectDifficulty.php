<?php
require_once __DIR__ . '/authenticationGuard.php';
require_once __DIR__ . '/../gameBackend/databaseConfig.php';
$levels = load_json('difficultyLevels');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Choose Difficulty | Mini Mart</title>

    <link rel="stylesheet" href="../gameStyles/globalStyles.css">
    <link rel="stylesheet" href="../gameStyles/difficultyStyles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Skranji:wght@400;700&family=Ultra&display=swap" rel="stylesheet">

    <script src="../gameScripts/userInterface/difficultySelectionController.js" defer></script>
</head>

<body>
    <script>
    window.MINIMART_USERNAME = <?= json_encode($_SESSION['username'], 
    JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT) ?>;
    </script>

    <main class="difficulty-container">
        <section class="difficulty-card">
            <h1>MINI MART</h1>
            <h2>Choose Your Challenge!</h2>

            <div class="difficulty-options">
                <button
                    type="button"
                    class="difficulty-button easy"
                    onclick="selectDifficulty('easy')">
                    <span class="level-name">EASY</span>
                    
        
                </button>

                <button
                    type="button"
                    class="difficulty-button medium"
                    onclick="selectDifficulty('medium')">
                    <span class="level-name">MEDIUM</span>
                    
                    
                </button>

                <button
                    type="button"
                    class="difficulty-button difficult"
                    onclick="selectDifficulty('difficult')">
                    <span class="level-name">DIFFICULT</span>
                    
                    
                </button>
            </div>

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
