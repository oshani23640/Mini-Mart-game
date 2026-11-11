// Runs the game: canvas drawing, player actions and checkout.

"use strict";

// Page elements
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const livesElement = document.getElementById("lives");
const difficultyElement = document.getElementById("difficulty");
const playerNameElement = document.getElementById("playerName");

const customerAvatarElement = document.getElementById("customerAvatar");
const customerNameElement = document.getElementById("customerName");
const customerMessageElement = document.getElementById("customerMessage");

const orderListElement = document.getElementById("orderList");
const progressTextElement = document.getElementById("progressText");
const progressBarElement = document.getElementById("progressBar");

const basketCountElement = document.getElementById("basketCount");
const customerCountElement = document.getElementById("customerCount");

const restartButton = document.getElementById("restartButton");
const playAgainButton = document.getElementById("playAgainButton");

const gameOverOverlay = document.getElementById("gameOverOverlay");
const gameOverIcon = document.getElementById("gameOverIcon");
const gameOverTitle = document.getElementById("gameOverTitle");
const gameOverText = document.getElementById("gameOverText");
const finalScoreElement = document.getElementById("finalScore");

// Checkout puzzle elements
const checkoutModal = document.getElementById("checkoutModal");
const puzzleCustomerAvatar = document.getElementById("puzzleCustomerAvatar");
const puzzleCustomerName = document.getElementById("puzzleCustomerName");
const puzzleLoading = document.getElementById("puzzleLoading");
const puzzleImage = document.getElementById("puzzleImage");
const puzzleAnswerInput = document.getElementById("puzzleAnswerInput");
const submitPuzzleBtn = document.getElementById("submitPuzzleBtn");
const puzzleFeedback = document.getElementById("puzzleFeedback");

// Settings and products come from game.php
const { difficulty: activeSettings, products: productData } = window.MINIMART_CONFIG;

// Load the product catalogue
productCatalog.load(productData);

// Create the player and game state
const player = new Player(75, 480, 4.0);
const gameState = new GameState(activeSettings);

const world = {
    width: canvas.width,
    height: canvas.height,
    checkout: {
        x: 850,
        y: 425,
        width: 80,
        height: 100
    }
};

// Register position and reach
const REGISTER = { x: 815, y: 470, reach: 75 };

function isNearRegister() {
    return Math.hypot(player.x - REGISTER.x, player.y - REGISTER.y) <= REGISTER.reach;
}

const activeKeys = {};
let animationFrameId = null;

// Game event listeners
eventBus.on(GameEvents.SCORE_CHANGED, (score) => {
    scoreElement.textContent = score;
});

eventBus.on(GameEvents.LIVES_CHANGED, (lives) => {
    livesElement.textContent = lives;
});

eventBus.on(GameEvents.TIME_TICK, (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timerElement.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
});

eventBus.on(GameEvents.CUSTOMER_ARRIVED, (customer) => {
    customerAvatarElement.textContent = customer.avatar;
    customerNameElement.textContent = customer.name;
    customerMessageElement.textContent = customer.message;
    renderOrder();
});

eventBus.on(GameEvents.ORDER_UPDATED, () => {
    renderOrder();
});

eventBus.on(GameEvents.ITEM_PICKED, () => {
    updateBasketUI();
});

eventBus.on(GameEvents.CUSTOMER_SERVED, () => {
    updateBasketUI();
});

// Checkout puzzle events
eventBus.on(GameEvents.PUZZLE_REQUESTED, () => {
    puzzleLoading.style.display = "flex";
    puzzleImage.classList.add("hidden");
    puzzleFeedback.textContent = "";
    puzzleFeedback.className = "puzzle-feedback";
});

eventBus.on(GameEvents.PUZZLE_LOADED, ({ question }) => {
    puzzleLoading.style.display = "none";
    puzzleImage.src = question;
    puzzleImage.classList.remove("hidden");
    puzzleAnswerInput.focus();
});

eventBus.on(GameEvents.PUZZLE_ERROR, () => {
    puzzleLoading.style.display = "none";
    puzzleFeedback.textContent = "Could not load the puzzle. Press Ring Up to try again.";
    puzzleFeedback.className = "puzzle-feedback error";
});

eventBus.on(GameEvents.GAME_OVER, ({ won, score, reason }) => {
    gameTimer.stop();
    if (checkoutModal) checkoutModal.classList.add("hidden");

    gameOverOverlay.classList.remove("hidden");
    if (won) {
        gameOverIcon.textContent = "🎉";
        gameOverTitle.textContent = "Supermarket Superstar!";
        gameOverText.textContent =
            reason || "Congratulations! You completed your shopping challenge!";
    } else {
        gameOverIcon.textContent = "";
        gameOverTitle.textContent = "Game Over!";
        gameOverText.textContent = reason || "The shopping day has ended.";
    }
    finalScoreElement.textContent = score;
    saveScore();
});

// Shows the customer's order.
function renderOrder() {
    orderListElement.innerHTML = "";
    if (!gameState.currentCustomer) return;

    gameState.currentCustomer.order.forEach((orderItem) => {
        const product = productCatalog.findById(orderItem.productId);
        if (!product) return;

        const row = document.createElement("div");
        row.className = "order-item";
        if (orderItem.isComplete) {
            row.classList.add("completed");
        }

        const left = document.createElement("div");
        left.className = "order-item-left";

        const icon = document.createElement("span");
        icon.className = "order-product-icon";
        icon.textContent = product.icon;

        const name = document.createElement("span");
        name.className = "order-product-name";
        name.textContent = product.name;

        left.appendChild(icon);
        left.appendChild(name);

        const quantity = document.createElement("span");
        quantity.className = "order-quantity";
        quantity.textContent = `${orderItem.collected}/${orderItem.quantity}`;

        row.appendChild(left);
        row.appendChild(quantity);
        orderListElement.appendChild(row);
    });

    const progress = gameState.currentCustomer.getProgressPercentage();
    progressTextElement.textContent = `${progress}%`;
    progressBarElement.style.width = `${progress}%`;
}

// Shows basket and served-customer counts.
function updateBasketUI() {
    basketCountElement.textContent = `${player.basket.length} ${player.basket.length === 1 ? "item" : "items"}`;

    customerCountElement.textContent = `${gameState.ordersCompleted} / ${gameState.targetOrders} customers`;
}

// Blocks movement outside the canvas or into the checkout.
function canMoveTo(x, y) {
    // Canvas edges
    if (x < 20 || x > canvas.width - 20 || y < 40 || y > canvas.height - 25) {
        return false;
    }

    // Checkout counter
    const checkout = world.checkout;
    const nearestX = Math.max(checkout.x, Math.min(x, checkout.x + checkout.width));
    const nearestY = Math.max(checkout.y, Math.min(y, checkout.y + checkout.height));

    if (Math.hypot(x - nearestX, y - nearestY) < 25) {
        return false;
    }

    return true;
}

// Picks up a product and opens checkout when the order is complete.
function collectProduct() {
    const result = ProductManager.tryCollectProduct(player, gameState);
    if (!result || result.status !== "COLLECTED") return;

    // Order complete: open the Fish API puzzle
    if (gameState.currentCustomer && gameState.currentCustomer.isOrderFulfilled()) {
        setTimeout(() => {
            if (
                !gameState.isGameOver &&
                gameState.currentCustomer &&
                gameState.currentCustomer.isOrderFulfilled()
            ) {
                openCheckoutModal();
            }
        }, 600);
    }
}

function handleInteraction() {
    if (!gameState.running || gameState.isGameOver) return;

    if (gameState.isPuzzleModalOpen) {
        submitPuzzleAnswer();
        return;
    }

    if (isNearRegister()) {
        // Checkout needs every item collected
        if (gameState.currentCustomer && gameState.currentCustomer.isOrderFulfilled()) {
            openCheckoutModal();
        }
        return;
    }

    collectProduct();
}

function openCheckoutModal() {
    if (gameState.isPuzzleModalOpen) return;
    gameState.isPuzzleModalOpen = true;
    gameTimer.pause();

    checkoutModal.classList.remove("hidden");
    puzzleCustomerAvatar.textContent = gameState.currentCustomer
        ? gameState.currentCustomer.avatar
        : "👩";
    puzzleCustomerName.textContent = `${gameState.currentCustomer ? gameState.currentCustomer.name : "Customer"}'s Order Complete!`;

    const promptElement = document.getElementById("puzzleCustomerPrompt");
    if (promptElement) {
        promptElement.textContent =
            "All order items collected! Solve this Fish API challenge to complete checkout before the next customer arrives:";
    }

    puzzleAnswerInput.value = "";

    // Request a puzzle (results arrive as events)
    puzzleService.getChallengePuzzle();
}

function submitPuzzleAnswer() {
    // Ignore clicks while loading; retry if loading failed
    if (puzzleService.isRequesting) return;
    if (!puzzleService.currentPuzzle) {
        puzzleService.getChallengePuzzle();
        return;
    }

    const val = puzzleAnswerInput.value.trim();
    if (val === "") {
        puzzleFeedback.textContent = "Please enter the number of fish!";
        puzzleFeedback.className = "puzzle-feedback error";
        return;
    }

    const { correct } = puzzleService.validateAnswer(val);

    if (correct) {
        puzzleFeedback.textContent = `🎉 Correct!  Advancing to next customer...`;
        puzzleFeedback.className = "puzzle-feedback success";
        submitPuzzleBtn.disabled = true;

        setTimeout(() => {
            submitPuzzleBtn.disabled = false;
            checkoutModal.classList.add("hidden");
            gameState.isPuzzleModalOpen = false;
            gameTimer.resume();

            customerManager.fulfillCustomerOrder(gameState, player, gameState.puzzleBonus);
            renderOrder();
            updateBasketUI();
        }, 1200);
    } else {
        puzzleFeedback.textContent = `❌ Incorrect count!`;
        puzzleFeedback.className = "puzzle-feedback error";
        gameState.deductLife();
        puzzleAnswerInput.value = "";
        puzzleAnswerInput.focus();

        if (gameState.lives <= 0) {
            checkoutModal.classList.add("hidden");
            gameState.isPuzzleModalOpen = false;
        }
    }
}

// Modal listeners
if (submitPuzzleBtn) {
    submitPuzzleBtn.addEventListener("click", submitPuzzleAnswer);
}

if (puzzleAnswerInput) {
    puzzleAnswerInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            submitPuzzleAnswer();
        }
    });
}

// Number buttons
document.querySelectorAll(".numpad-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        if (!puzzleAnswerInput) return;
        puzzleAnswerInput.value = btn.dataset.digit;
        submitPuzzleAnswer();
    });
});

// Canvas drawing
function drawRoundedRect(x, y, width, height, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.fill();
}

function drawFloor() {
    ctx.fillStyle = "#eaf5e7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#5b86b7";
    ctx.lineWidth = 1;

    for (let x = 0; x < canvas.width; x += 48) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let y = 0; y < canvas.height; y += 48) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// Shelves
function drawShelf(x, y, width, title) {
    // Shelf shadow and main body
    drawRoundedRect(x + 3, y + 5, width, 105, 8, "#b8c9d3");
    drawRoundedRect(x, y, width, 105, 8, "#7aa9d8");

    // Shelf heading
    drawRoundedRect(x + 4, y + 4, width - 8, 22, 6, "#244c76");

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(title, x + width / 2, y + 15);

    // Product display rows
    drawRoundedRect(x + 6, y + 30, width - 12, 30, 5, "#9fc2e7");
    drawRoundedRect(x + 6, y + 57, width - 12, 30, 5, "#9fc2e7");
}

function drawShelves() {
    drawShelf(80, 140, 800, "BAKERY & DAIRY AISLE");
    drawShelf(80, 310, 800, "SNACKS & FRESH PRODUCE AISLE");
}

// Products
function drawProducts() {
    productCatalog.items.forEach((product) => {
        const isNear = product.isWithinReach(player.x, player.y, 48);

        if (isNear) {
            ctx.beginPath();
            ctx.arc(product.x, product.y, 25, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 220, 100, 0.45)";
            ctx.fill();
            ctx.strokeStyle = "#f59e0b";
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(product.icon, product.x, product.y);

        ctx.fillStyle = "#1e3a5f";
        ctx.font = "bold 17px Arial";
        ctx.fillText(product.name, product.x, product.y + 21);
    });
}

function drawCheckout() {
    const ck = world.checkout;
    drawRoundedRect(ck.x + 3, ck.y + 4, ck.width, ck.height, 8, "#b3c1cd");
    drawRoundedRect(ck.x, ck.y, ck.width, ck.height, 8, "#5d7894");
    drawRoundedRect(ck.x + 6, ck.y + 6, ck.width - 12, 20, 4, "#8da8c4");

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 10px Arial";
    ctx.textAlign = "center";
    ctx.fillText("CHECKOUT", ck.x + ck.width / 2, ck.y + 19);

    // Register terminal
    drawRoundedRect(ck.x + 12, ck.y + 35, 30, 20, 4, "#334155");
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(ck.x + 15, ck.y + 38, 24, 12);

    // Customer at checkout
    ctx.font = "28px Arial";
    ctx.textAlign = "center";
    const avatar = gameState.currentCustomer ? gameState.currentCustomer.avatar : "👩";
    ctx.fillText(avatar, REGISTER.x, REGISTER.y);

    // Proximity indicator
    if (isNearRegister()) {
        ctx.fillStyle = "#101416";
        ctx.font = "bold 12px Arial";
        ctx.fillText("Press ENTER to Ring Up!", REGISTER.x, 430);
    }
}

function drawPlayer() {
    const x = player.x;
    const y = player.y;

    // Shadow
    ctx.beginPath();
    ctx.ellipse(x, y + 16, 12, 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fill();

    // Body / Apron
    drawRoundedRect(x - 12, y - 5, 24, 22, 5, "#347ed0");
    drawRoundedRect(x - 6, y + 3, 12, 7, 2, "#d7eaff");

    // Head
    ctx.beginPath();
    ctx.arc(x, y - 17, 14, 0, Math.PI * 2);
    ctx.fillStyle = "#ffd9bd";
    ctx.fill();

    // Hair
    ctx.beginPath();
    ctx.arc(x, y - 21, 14, Math.PI, Math.PI * 2);
    ctx.fillStyle = "#68432f";
    ctx.fill();

    // Hat
    drawRoundedRect(x - 16, y - 34, 32, 9, 4, "#ffffff");
    drawRoundedRect(x - 12, y - 41, 24, 10, 4, "#347ed0");

    // Face / Eyes based on direction
    ctx.fillStyle = "#2c1d11";
    let eyeOffsetX = 0;

    if (player.direction === "left") eyeOffsetX = -3;
    if (player.direction === "right") eyeOffsetX = 3;

    if (player.direction !== "up") {
        ctx.beginPath();
        ctx.arc(x - 4 + eyeOffsetX, y - 17, 2, 0, Math.PI * 2);
        ctx.arc(x + 4 + eyeOffsetX, y - 17, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFloor();
    drawShelves();
    drawProducts();
    drawCheckout();
    drawPlayer();
}

// Game loop: move the player and redraw
function gameLoop() {
    if (gameState.isGameOver) return;

    if (gameState.running && !gameState.isPuzzleModalOpen) {
        player.updateMovement(activeKeys, canMoveTo);
    }

    drawGame();
    animationFrameId = requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (key.startsWith("Arrow") || key === " ") {
        event.preventDefault();
    }

    if (gameState.isGameOver) return;

    activeKeys[key] = true;

    if (key === "Enter" && !event.repeat) {
        handleInteraction();
    }
});

document.addEventListener("keyup", (event) => {
    activeKeys[event.key] = false;
});

window.addEventListener("blur", () => {
    for (const k in activeKeys) delete activeKeys[k];
});

// Saves the score for the score history page.
async function saveScore() {
    try {
        const response = await fetch("../backend/api.php?action=save_score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify({ score: gameState.score, difficulty: gameState.difficulty })
        });
        const result = await response.json();
        if (!response.ok || !result.success)
            throw new Error(result.message || "Score could not be saved.");
    } catch (error) {
        gameOverText.textContent += " (Your score could not be saved.)";
    }
}

// Starts a new game.
function resetGame() {
    cancelAnimationFrame(animationFrameId);
    gameTimer.stop();

    for (const k in activeKeys) delete activeKeys[k];

    player.reset();
    gameState.reset();

    gameOverOverlay.classList.add("hidden");

    if (checkoutModal) {
        checkoutModal.classList.add("hidden");
    }

    difficultyElement.textContent = gameState.difficulty;
    playerNameElement.textContent = window.MINIMART_USERNAME || "Shopkeeper";

    customerManager.spawnNextCustomer(gameState);
    updateBasketUI();

    drawGame();
    gameTimer.start(gameState);

    animationFrameId = requestAnimationFrame(gameLoop);
}

restartButton.addEventListener("click", resetGame);
playAgainButton.addEventListener("click", resetGame);

// Start the game
resetGame();
