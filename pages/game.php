<?php
require_once __DIR__ . '/auth_guard.php';
require_once __DIR__ . '/../backend/config.php';

// Difficulty comes from the URL and must exist in data/levels.json
$levels = load_json('levels');
$difficulty = strtolower((string)($_GET['difficulty'] ?? ''));
if (!isset($levels[$difficulty])) {
    header('Location: difficulty.php');
    exit;
}

$jsonFlags = JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT;
$gameConfig = ['difficulty' => $levels[$difficulty], 'products' => load_json('products')];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mini Mart | Game</title>

    <link rel="stylesheet" href="../css/common.css">
    <link rel="stylesheet" href="../css/game.css">
    <!-- Game scripts -->
    <script src="../js/events/gameEvents.js" defer></script>
    <script src="../js/services/api.js" defer></script>
    <script src="../js/services/puzzle.js" defer></script>
    <script src="../js/domain/product.js" defer></script>
    <script src="../js/domain/customer.js" defer></script>
    <script src="../js/domain/player.js" defer></script>
    <script src="../js/domain/gamestate.js" defer></script>
    <script src="../js/gameplay/timer.js" defer></script>
    <script src="../js/gameplay/productManager.js" defer></script>
    <script src="../js/gameplay/customerManager.js" defer></script>
    <script src="../js/gameplay/game.js" defer></script>
</head>

<body>
    <script>
        window.MINIMART_USERNAME = <?= json_encode($_SESSION['username'], $jsonFlags) ?>;
        window.MINIMART_CONFIG = <?= json_encode($gameConfig, $jsonFlags) ?>;
    </script>

    <main class="game-container">
        <!-- Game title and player -->
        <div class="top-info-card">
            <header class="game-header">
                <div class="brand">
                    <div>
                        <h1>Mini Mart</h1>
                        <p>Your little shop adventure!</p>
                    </div>
                </div>

                <div class="welcome-message">
                    <span>Welcome, <strong id="playerName">Shopkeeper</strong>!</span>
                </div>
                <div class="header-buttons">
                    <button id="restartButton" class="restart-button">
                        Restart
                    </button>
                    <a href="menu.php" class="exit-button">Menu</a>
                </div>
            </header>

            <!-- Score, time, lives and difficulty -->
            <section class="stats-panel">
                <div class="stat-card">
                    <span class="stat-icon">⭐</span>
                    <div>
                        <p>Score</p>
                        <h2 id="score">0</h2>
                    </div>
                </div>

                <div class="stat-card">
                    <span class="stat-icon">⏰</span>
                    <div>
                        <p>Time Left</p>
                        <h2 id="timer">01:30</h2>
                    </div>
                </div>

                <div class="stat-card">
                    <span class="stat-icon">❤️</span>
                    <div>
                        <p>Lives</p>
                        <h2 id="lives">5</h2>
                    </div>
                </div>

                <div class="stat-card difficulty-card">
                    <span class="stat-icon">🎯</span>
                    <div>
                        <p>Difficulty</p>
                        <h2 id="difficulty">Easy</h2>
                    </div>
                </div>
            </section>
        </div>

        <!-- Order panel and canvas -->
        <div class="game-main-card">
            <section class="game-layout">
                <!-- Current customer and order -->
                <aside class="order-panel">
                    <div class="panel-heading">
                        <h2>Customer Order</h2>
                    </div>

                    <div class="customer-information">
                        <div id="customerAvatar" class="customer-avatar">
                            👩
                        </div>

                        <div>
                            <h3 id="customerName">Customer</h3>
                            <p id="customerMessage">
                                Please collect my items!
                            </p>
                        </div>
                    </div>

                    <div class="order-divider"></div>

                    <h3 class="order-title">Items to Collect</h3>

                    <div id="orderList" class="order-list"></div>

                    <div class="progress-section">
                        <div class="progress-label">
                            <span>Order Progress</span>
                            <strong id="progressText">0%</strong>
                        </div>

                        <div class="progress-track">
                            <div id="progressBar" class="progress-bar"></div>
                        </div>
                    </div>

                    <!-- Basket -->
                    <div class="basket-box">
                        <span>🧺</span>

                        <div>
                            <p>My Basket</p>
                            <h3 id="basketCount">0 items</h3>
                        </div>
                    </div>

                    <!-- Customers served -->
                    <div class="customer-box">
                        <span>👥</span>

                        <div>
                            <p>Customers Served</p>
                            <h3 id="customerCount">0 / 10 customers</h3>
                        </div>
                    </div>
                </aside>

                <!-- Supermarket canvas -->
                <div class="market-panel">
                    <div class="canvas-wrapper">
                        <canvas
                            id="gameCanvas"
                            width="960"
                            height="600"
                            aria-label="Mini Mart supermarket game"
                        ></canvas>
                    </div>
                </div>
            </section>
        </div>

        <!-- Game over screen -->
        <div id="gameOverOverlay" class="game-over-overlay hidden">
            <div class="game-over-card">
                <div id="gameOverIcon" class="game-over-icon">🎉</div>

                <h2 id="gameOverTitle">Great Job!</h2>

                <p id="gameOverText">
                    Thank you for playing Mini Mart.
                </p>

                <div class="final-score">
                    <span>⭐ Your Final Score</span>
                    <strong id="finalScore">0</strong>
                </div>

                <button id="playAgainButton" class="play-again-button">
                    Play Again
                </button>

                <a href="menu.php" class="popup-menu-button">
                    Back to Menu
                </a>
            </div>
        </div>

        <!-- Checkout puzzle -->
        <div id="checkoutModal" class="checkout-overlay hidden">
            <div class="checkout-card">
                <div class="checkout-customer-box">
                    <span id="puzzleCustomerAvatar" class="checkout-avatar">👩</span>

                    <div>
                        <h3 id="puzzleCustomerName">Customer Checkout</h3>
                        <p id="puzzleCustomerPrompt">
                            Enter the register security code (count the fish in the picture) to complete payment!
                        </p>
                    </div>
                </div>

                <div class="puzzle-viewport">
                    <div id="puzzleLoading" class="puzzle-loading">
                        <span class="spinner">⏳</span>
                    </div>

                    <img
                        id="puzzleImage"
                        class="puzzle-img hidden"
                        alt="Fish Game API Challenge"
                    />
                </div>

                <div class="puzzle-controls">
                    <label for="puzzleAnswerInput">
                        How many fish do you see? (0 - 9):
                    </label>

                    <div class="puzzle-input-row">
                        <input
                            type="number"
                            id="puzzleAnswerInput"
                            min="0"
                            max="9"
                            placeholder="0"
                        />

                        <button
                            type="button"
                            id="submitPuzzleBtn"
                            class="submit-puzzle-btn"
                        >
                            Ring Up Order
                        </button>
                    </div>

                    <!-- Number buttons -->
                    <div class="numpad-row">
                        <button type="button" class="numpad-btn" data-digit="0">0</button>
                        <button type="button" class="numpad-btn" data-digit="1">1</button>
                        <button type="button" class="numpad-btn" data-digit="2">2</button>
                        <button type="button" class="numpad-btn" data-digit="3">3</button>
                        <button type="button" class="numpad-btn" data-digit="4">4</button>
                        <button type="button" class="numpad-btn" data-digit="5">5</button>
                        <button type="button" class="numpad-btn" data-digit="6">6</button>
                        <button type="button" class="numpad-btn" data-digit="7">7</button>
                        <button type="button" class="numpad-btn" data-digit="8">8</button>
                        <button type="button" class="numpad-btn" data-digit="9">9</button>
                    </div>

                    <p id="puzzleFeedback" class="puzzle-feedback"></p>
                </div>
            </div>
        </div>
    </main>
</body>
</html>
