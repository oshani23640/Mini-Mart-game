// Game Controller
// High Cohesion: Coordinates game loop, movement validation, and game lifecycle.
// Low Coupling: Delegates rendering to GameRenderer, UI updates to GameUI, input to InputHandler, and API calls to services.

"use strict";

// Canvas and rendering subsystem
const canvas = document.getElementById("gameCanvas");
const renderer = new GameRenderer(canvas);
const ui = new GameUI();
const inputHandler = new InputHandler();

// World geometry & register position
const world = {
    width: canvas.width,
    height: canvas.height,
    checkout: { x: 850, y: 425, width: 80, height: 100 }
};
const REGISTER = { x: 815, y: 470, reach: 75 };

// Settings and products configuration passed from game.php
const { difficulty: activeSettings, products: productData } = window.MINIMART_CONFIG;
productCatalog.load(productData);

// Domain models
const player = new Player(75, 480, 4.0);
const gameState = new GameState(activeSettings);

let animationFrameId = null;

// Proximity & collision rules
function isNearRegister() {
    return Math.hypot(player.x - REGISTER.x, player.y - REGISTER.y) <= REGISTER.reach;
}

function canMoveTo(x, y) {
    // Canvas boundary checks
    if (x < 20 || x > canvas.width - 20 || y < 40 || y > canvas.height - 25) {
        return false;
    }

    // Checkout counter obstacle
    const checkout = world.checkout;
    const nearestX = Math.max(checkout.x, Math.min(x, checkout.x + checkout.width));
    const nearestY = Math.max(checkout.y, Math.min(y, checkout.y + checkout.height));

    return Math.hypot(x - nearestX, y - nearestY) >= 25;
}

// Checkout puzzle workflow
function openCheckoutModal() {
    if (gameState.isPuzzleModalOpen) return;
    gameState.isPuzzleModalOpen = true;
    gameTimer.pause();

    ui.openCheckoutModal(gameState.currentCustomer);
    puzzleService.getChallengePuzzle();
}

function submitPuzzleAnswer(val) {
    if (puzzleService.isRequesting) return;
    if (!puzzleService.currentPuzzle) {
        puzzleService.getChallengePuzzle();
        return;
    }

    if (!val || val === "") {
        ui.setPuzzleFeedback("Please enter the number of fish!", true);
        return;
    }

    const { correct } = puzzleService.validateAnswer(val);

    if (correct) {
        ui.setPuzzleFeedback("🎉 Correct! Advancing to next customer...", false, true);
        if (ui.submitPuzzleBtn) ui.submitPuzzleBtn.disabled = true;

        setTimeout(() => {
            if (ui.submitPuzzleBtn) ui.submitPuzzleBtn.disabled = false;
            ui.closeCheckoutModal();
            gameState.isPuzzleModalOpen = false;
            gameTimer.resume();

            customerManager.fulfillCustomerOrder(gameState, player, gameState.puzzleBonus);
            ui.renderOrder(gameState.currentCustomer, productCatalog);
            ui.updateBasketUI(player.basket.length, gameState.ordersCompleted, gameState.targetOrders);
        }, 1200);
    } else {
        ui.setPuzzleFeedback("❌ Incorrect count!", true);
        gameState.deductLife();
        if (ui.puzzleAnswerInput) {
            ui.puzzleAnswerInput.value = "";
            ui.puzzleAnswerInput.focus();
        }

        if (gameState.lives <= 0) {
            ui.closeCheckoutModal();
            gameState.isPuzzleModalOpen = false;
        }
    }
}

// Player interaction: collect products or trigger checkout
function collectProduct() {
    const result = ProductManager.tryCollectProduct(player, gameState);
    if (!result || result.status !== "COLLECTED") return;

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
        const val = ui.puzzleAnswerInput ? ui.puzzleAnswerInput.value.trim() : "";
        submitPuzzleAnswer(val);
        return;
    }

    if (isNearRegister()) {
        if (gameState.currentCustomer && gameState.currentCustomer.isOrderFulfilled()) {
            openCheckoutModal();
        }
        return;
    }

    collectProduct();
}

// Main game animation loop
function gameLoop() {
    if (gameState.isGameOver) return;

    if (gameState.running && !gameState.isPuzzleModalOpen) {
        player.updateMovement(inputHandler.keys, canMoveTo);
    }

    renderer.render(
        player,
        productCatalog.items,
        gameState.currentCustomer,
        isNearRegister(),
        world.checkout,
        REGISTER
    );

    animationFrameId = requestAnimationFrame(gameLoop);
}

// Game lifecycle: restart / play again
function resetGame() {
    cancelAnimationFrame(animationFrameId);
    gameTimer.stop();
    inputHandler.reset();

    player.reset();
    gameState.reset();

    ui.reset(gameState.difficulty, window.MINIMART_USERNAME);

    customerManager.spawnNextCustomer(gameState);
    ui.updateBasketUI(player.basket.length, gameState.ordersCompleted, gameState.targetOrders);

    renderer.render(
        player,
        productCatalog.items,
        gameState.currentCustomer,
        isNearRegister(),
        world.checkout,
        REGISTER
    );

    gameTimer.start(gameState);
    animationFrameId = requestAnimationFrame(gameLoop);
}

// Wire up events and subsystems
ui.initEventSubscriptions(
    productCatalog,
    () => player.basket,
    () => gameState
);

eventBus.on(GameEvents.GAME_OVER, async ({ score }) => {
    gameTimer.stop();
    try {
        await ScoreService.saveScore(score, gameState.difficulty);
    } catch (err) {
        ui.setScoreSaveError();
    }
});

inputHandler.init(handleInteraction);
ui.bindPuzzleSubmit((val) => submitPuzzleAnswer(val));
ui.bindRestart(resetGame);

// Start initial game
resetGame();
