<?php require_once __DIR__ . '/auth_guard.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>How to Play | Mini Mart</title>

    <link rel="stylesheet" href="../css/common.css">
    <link rel="stylesheet" href="../css/difficulty.css">
    <link rel="stylesheet" href="../css/instructions.css">
    <!-- Loads the fonts used by the page. -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Skranji:wght@400;700&family=Ultra&display=swap" rel="stylesheet">
</head>

<body>
    <script>window.MINIMART_USERNAME = <?= json_encode($_SESSION['username'], JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT) ?>;</script>

    <main class="difficulty-container">
        <section class="difficulty-card instructions-card">
            <h1>MINI MART</h1>

            <h2> How to Play </h2>

            <p class="description">
                Welcome to your little mini mart!
                Get ready to become a super shopkeeper.
                Follow these simple instructions and make every customer happy!
            </p>

            <div class="instruction-content">
                <div class="instruction-step">
                    <div class="step-number">01</div>

                    <div class="step-content">
                        <h3>🎯 Your Mission</h3>

                        <p>
                            Customers will visit your mini mart with their shopping orders.
                            Your job is to collect the correct products from the shelves
                            and complete their orders before the time runs out.
                            Serve your customers quickly to earn points!
                        </p>
                    </div>
                </div>

                <div class="instruction-step">
                    <div class="step-number">02</div>

                    <div class="step-content">
                        <h3>🎮 Move Around</h3>

                        <p>
                            Explore your mini mart using the
                            <span class="key-badge">W A S D</span>
                            keys or
                            <span class="key-badge">↑ ↓ ← →</span>
                            arrow keys.
                            Need to move faster?
                            Hold the
                            <span class="key-badge">SHIFT</span>
                            key to sprint around the shop!
                        </p>
                    </div>
                </div>

                <div class="instruction-step">
                    <div class="step-number">03</div>

                    <div class="step-content">
                        <h3>🧺 Collect Products</h3>

                        <p>
                            Walk close to the product shelves to collect the
                            items requested by your customers.
                            When you are near a shelf or the checkout counter,
                            press
                            <span class="key-badge">ENTER</span>
                            to interact and complete the required action.
                        </p>
                    </div>
                </div>

                <div class="instruction-step">
                    <div class="step-number">04</div>

                    <div class="step-content">
                        <h3>🐟 Fish Challenge</h3>

                        <p>
                            After completing a customer's shopping order,
                            a Fish Game challenge will appear.
                            Count the fish and solve the puzzle correctly
                            to complete the register verification and
                            unlock the next customer!
                        </p>
                    </div>
                </div>

                <div class="instruction-step">
                    <div class="step-number">05</div>

                    <div class="step-content">
                        <h3>⏰ Beat the Timer</h3>

                        <p>
                            Keep an eye on the countdown timer while serving
                            your customers. Complete as many shopping orders
                            as possible within the available time.
                            Stay focused and try to achieve a high score!
                        </p>
                    </div>
                </div>
            </div>

            <button type="button" class="back-button"
                onclick="location.href='menu.php'">
                Back to Menu
            </button>
        </section>
    </main>
</body>
</html>
