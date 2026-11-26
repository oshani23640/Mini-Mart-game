// Main supermarket gameplay coordinator and animation loop

"use strict";

const canvas = document.getElementById("gameCanvas");
const renderer = new SupermarketCanvasRenderer(canvas);
const ui = new GameplayUiController();
const inputHandler = new PlayerInputHandler();

const world = {
    width: canvas.width,
    height: canvas.height,
    checkout: { x: 850, y: 425, width: 80, height: 100 }
};

const REGISTER = { x: 815, y: 470, reach: 75 };

const { difficulty: activeSettings, products: productData } = window.MINIMART_CONFIG;

productCatalog.load(productData);

const player = new Player(75, 480, 4.0);
const gameState = new GameState(activeSettings);

let animationFrameId = null;


function isNearRegister() {
    return Math.hypot(player.x - REGISTER.x, player.y - REGISTER.y) <= REGISTER.reach;
}


function canMoveTo(x, y) {
    if (x < 20 || x > canvas.width - 20 || y < 40 || y > canvas.height - 25) {
        return false;
    }

    const checkout = world.checkout;

    const nearestX = Math.max(checkout.x, Math.min(x, checkout.x + checkout.width));
    const nearestY = Math.max(checkout.y, Math.min(y, checkout.y + checkout.height));

    return Math.hypot(x - nearestX, y - nearestY) >= 25;
}


function openCheckoutModal() {
    if (gameState.isPuzzleModalOpen) return;

    gameState.isPuzzleModalOpen = true;
    gameplayTimer.pause();

    // Pause play while the checkout challenge is fetched and answered
    ui.openCheckoutModal();
    puzzleChallengeService.getChallengePuzzle();
}


// Validate a checkout answer, then either serve the customer or deduct a life
function submitPuzzleAnswer(val) {
    if (puzzleChallengeService.isRequesting) return;

    if (!puzzleChallengeService.currentPuzzle) {
        puzzleChallengeService.getChallengePuzzle();
        return;
    }

    if (!val || val === "") {
        ui.setPuzzleFeedback("Please enter the number of fish!", true);
        return;
    }

    const { correct } = puzzleChallengeService.validateAnswer(val);

    if (correct) {
        ui.setPuzzleFeedback("Correct!", false, true);

        if (ui.submitPuzzleBtn) {
            ui.submitPuzzleBtn.disabled = true;
        }

        completeCheckout();

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


let gameRun = 0;
let bonusResolver = null;


// Finish a correct checkout; every 5th customer also gets a bonus challenge
async function completeCheckout() {
    const run = gameRun;
    const nextCount = gameState.ordersCompleted + 1;
    const isMilestone = nextCount % gameState.milestoneEvery === 0;

    await new Promise((resolve) => setTimeout(resolve, 1200));

    if (run !== gameRun) return;

    if (ui.submitPuzzleBtn) {
        ui.submitPuzzleBtn.disabled = false;
    }

    ui.closeCheckoutModal();

    let milestoneBonus = 0;

    if (isMilestone) {
        milestoneBonus = await runBonusChallenge();

        if (run !== gameRun) return;
    }

    gameState.isPuzzleModalOpen = false;
    gameplayTimer.resume();

    customerOrderManager.fulfillCustomerOrder(gameState, player, gameState.puzzleBonus, milestoneBonus);

    if (gameState.isGameOver) return;

    ui.renderOrder(gameState.currentCustomer, productCatalog);
    ui.updateBasketUI(player.basket.length, gameState.ordersCompleted, gameState.targetOrders);
}


async function runBonusChallenge() {
    gameState.isBonusModalOpen = true;
    ui.openBonusModal();

    return new Promise(async (resolve) => {
        bonusResolver = (bonus) => {
            bonusResolver = null;
            gameState.isBonusModalOpen = false;
            ui.closeBonusModal();
            resolve(bonus);
        };

        try {
            const puzzle = await bonusPuzzleService.getPuzzle();

            if (bonusResolver) ui.showBonusPuzzle(puzzle.question);
        } catch (err) {
            ui.setBonusFeedback("Bonus puzzle unavailable.", true);
            setTimeout(() => { if (bonusResolver) bonusResolver(0); }, 1500);
        }
    });
}


function submitBonusAnswer(val) {
    if (!bonusResolver || !bonusPuzzleService.currentPuzzle) return;

    if (!val) {
        ui.setBonusFeedback("Please enter your answer!", true);
        return;
    }

    if (bonusPuzzleService.validateAnswer(val)) {
        const resolver = bonusResolver;

        bonusResolver = null;
        ui.setBonusFeedback("Bonus " + gameState.milestoneBonus + "+", false, true);

        setTimeout(() => {
            gameState.isBonusModalOpen = false;
            ui.closeBonusModal();
            resolver(gameState.milestoneBonus);
        }, 1200);
    } else {
        ui.setBonusFeedback("Wrong", true);

        if (ui.bonusAnswerInput) {
            ui.bonusAnswerInput.value = "";
            ui.bonusAnswerInput.focus();
        }
    }
}


function skipBonus() {
    if (bonusResolver) bonusResolver(0);
}


function collectProduct() {
    // Open checkout after the last requested item has been collected
    const result = ProductCollectionManager.tryCollectProduct(player, gameState);

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

    if (gameState.isBonusModalOpen) {
        submitBonusAnswer(ui.bonusAnswerInput ? ui.bonusAnswerInput.value.trim() : "");
        return;
    }

    // Enter submits an open puzzle, checks out at the register, or collects nearby goods
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


function gameLoop() {
    if (gameState.isGameOver) return;

    // Move only during active play, then redraw the scene for the next frame
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


function resetGame() {
    gameRun++;
    bonusResolver = null;
    // Reset state and UI, create the first customer, and restart timed gameplay
    cancelAnimationFrame(animationFrameId);
    gameplayTimer.stop();
    inputHandler.reset();

    player.reset();
    gameState.reset();

    ui.reset(gameState.difficulty, window.MINIMART_USERNAME);

    customerOrderManager.spawnNextCustomer(gameState);

    ui.updateBasketUI(player.basket.length, gameState.ordersCompleted, gameState.targetOrders);

    renderer.render(
        player,
        productCatalog.items,
        gameState.currentCustomer,
        isNearRegister(),
        world.checkout,
        REGISTER
    );

    gameplayTimer.start(gameState);
    animationFrameId = requestAnimationFrame(gameLoop);
}


// Connect the UI and input handlers before starting the first game
ui.initEventSubscriptions(
    productCatalog,
    () => player.basket,
    () => gameState
);


eventBus.on(GameEvents.GAME_OVER, async ({ score }) => {
    gameplayTimer.stop();

    try {
        await ScoreDataService.saveScore(score, gameState.difficulty);

    } catch (err) {
        ui.setScoreSaveError();
    }
});


inputHandler.init(handleInteraction);

ui.bindPuzzleSubmit((val) => submitPuzzleAnswer(val));
ui.bindBonusActions(submitBonusAnswer, skipBonus);
ui.bindRestart(resetGame);

resetGame();