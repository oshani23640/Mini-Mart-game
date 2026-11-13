// In-game HUD, customer order panel, and checkout modal controller

"use strict";

class GameplayUiController {
    constructor() {
        // Cache the page elements this controller updates
        this.scoreElement = document.getElementById("score");
        this.timerElement = document.getElementById("timer");
        this.livesElement = document.getElementById("lives");
        this.difficultyElement = document.getElementById("difficulty");
        this.playerNameElement = document.getElementById("playerName");

        this.customerAvatarElement = document.getElementById("customerAvatar");
        this.customerNameElement = document.getElementById("customerName");
        this.customerMessageElement = document.getElementById("customerMessage");
        this.orderListElement = document.getElementById("orderList");
        this.basketCountElement = document.getElementById("basketCount");
        this.customerCountElement = document.getElementById("customerCount");

        this.restartButton = document.getElementById("restartButton");
        this.playAgainButton = document.getElementById("playAgainButton");

        this.gameOverOverlay = document.getElementById("gameOverOverlay");
        this.gameOverIcon = document.getElementById("gameOverIcon");
        this.gameOverTitle = document.getElementById("gameOverTitle");
        this.gameOverText = document.getElementById("gameOverText");
        this.finalScoreElement = document.getElementById("finalScore");

        this.checkoutModal = document.getElementById("checkoutModal");
        this.puzzleLoading = document.getElementById("puzzleLoading");
        this.puzzleImage = document.getElementById("puzzleImage");
        this.puzzleAnswerInput = document.getElementById("puzzleAnswerInput");
        this.submitPuzzleBtn = document.getElementById("submitPuzzleBtn");
        this.puzzleFeedback = document.getElementById("puzzleFeedback");
        this.numpadButtons = document.querySelectorAll(".numpad-btn");
    }

    // Keep the HUD and modal displays in sync with game events
    initEventSubscriptions(catalog, getPlayerBasket, getGameState) {
        eventBus.on(GameEvents.SCORE_CHANGED, (score) => {
            if (this.scoreElement) this.scoreElement.textContent = score;
        });

        eventBus.on(GameEvents.LIVES_CHANGED, (lives) => {
            if (this.livesElement) this.livesElement.textContent = lives;
        });

        eventBus.on(GameEvents.TIME_TICK, (time) => {
            if (!this.timerElement) return;
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;
            this.timerElement.textContent =
                String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
        });

        eventBus.on(GameEvents.CUSTOMER_ARRIVED, (customer) => {
            if (this.customerAvatarElement) this.customerAvatarElement.textContent = customer.avatar;
            if (this.customerNameElement) this.customerNameElement.textContent = customer.name;
            if (this.customerMessageElement) this.customerMessageElement.textContent = customer.message;
            this.renderOrder(customer, catalog);
        });

        eventBus.on(GameEvents.ORDER_UPDATED, () => {
            const state = getGameState();
            if (state && state.currentCustomer) {
                this.renderOrder(state.currentCustomer, catalog);
            }
        });

        eventBus.on(GameEvents.ITEM_PICKED, () => {
            const state = getGameState();
            const basket = getPlayerBasket();
            this.updateBasketUI(basket.length, state.ordersCompleted, state.targetOrders);
        });

        eventBus.on(GameEvents.CUSTOMER_SERVED, () => {
            const state = getGameState();
            const basket = getPlayerBasket();
            this.updateBasketUI(basket.length, state.ordersCompleted, state.targetOrders);
        });

        eventBus.on(GameEvents.PUZZLE_REQUESTED, () => {
            if (this.puzzleLoading) this.puzzleLoading.style.display = "flex";
            if (this.puzzleImage) this.puzzleImage.classList.add("hidden");
            if (this.puzzleFeedback) {
                this.puzzleFeedback.textContent = "";
                this.puzzleFeedback.className = "puzzle-feedback";
            }
        });

        eventBus.on(GameEvents.PUZZLE_LOADED, ({ question }) => {
            if (this.puzzleLoading) this.puzzleLoading.style.display = "none";
            if (this.puzzleImage) {
                this.puzzleImage.src = question;
                this.puzzleImage.classList.remove("hidden");
            }
            if (this.puzzleAnswerInput) {
                this.puzzleAnswerInput.focus();
            }
        });

        eventBus.on(GameEvents.PUZZLE_ERROR, () => {
            if (this.puzzleLoading) this.puzzleLoading.style.display = "none";
            if (this.puzzleFeedback) {
                this.puzzleFeedback.textContent = "Could not load the puzzle. Press Ring Up to try again.";
                this.puzzleFeedback.className = "puzzle-feedback error";
            }
        });

        eventBus.on(GameEvents.GAME_OVER, ({ won, score, reason }) => {
            this.closeCheckoutModal();
            this.showGameOver(won, score, reason);
        });
    }

    // Rebuild the current customer's item list and collection counts
    renderOrder(customer, catalog) {
        if (!this.orderListElement) return;
        this.orderListElement.innerHTML = "";
        if (!customer) return;

        customer.order.forEach((orderItem) => {
            const product = catalog.findById(orderItem.productId);
            if (!product) return;

            const row = document.createElement("div");
            row.className = "order-item" + (orderItem.isComplete ? " completed" : "");

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
            quantity.textContent = orderItem.collected + "/" + orderItem.quantity;

            row.appendChild(left);
            row.appendChild(quantity);
            this.orderListElement.appendChild(row);
        });
    }

    // Refresh the basket total and customers-served count
    updateBasketUI(basketCount, ordersCompleted, targetOrders) {
        if (this.basketCountElement) {
            this.basketCountElement.textContent =
                basketCount + " " + (basketCount === 1 ? "item" : "items");
        }
        if (this.customerCountElement) {
            this.customerCountElement.textContent =
                ordersCompleted + " / " + targetOrders + " customers";
        }
    }

    // Open checkout and clear any answer left from the previous challenge
    openCheckoutModal() {
        if (!this.checkoutModal) return;
        this.checkoutModal.classList.remove("hidden");

        if (this.puzzleAnswerInput) {
            this.puzzleAnswerInput.value = "";
        }
    }

    // Hide the checkout challenge
    closeCheckoutModal() {
        if (this.checkoutModal) {
            this.checkoutModal.classList.add("hidden");
        }
    }

    // Show puzzle validation feedback with its matching visual state
    setPuzzleFeedback(text, isError = false, isSuccess = false) {
        if (!this.puzzleFeedback) return;
        this.puzzleFeedback.textContent = text;
        this.puzzleFeedback.className = "puzzle-feedback";
        if (isError) this.puzzleFeedback.classList.add("error");
        if (isSuccess) this.puzzleFeedback.classList.add("success");
    }

    // Send button, Enter-key, and numpad submissions to the same handler
    bindPuzzleSubmit(handler) {
        if (this.submitPuzzleBtn) {
            this.submitPuzzleBtn.addEventListener("click", () => {
                const val = this.puzzleAnswerInput ? this.puzzleAnswerInput.value.trim() : "";
                handler(val);
            });
        }

        if (this.puzzleAnswerInput) {
            this.puzzleAnswerInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    handler(this.puzzleAnswerInput.value.trim());
                }
            });
        }

        this.numpadButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                if (!this.puzzleAnswerInput) return;
                this.puzzleAnswerInput.value = btn.dataset.digit;
                handler(this.puzzleAnswerInput.value.trim());
            });
        });
    }

    // Connect both restart buttons to the game restart handler
    bindRestart(handler) {
        if (this.restartButton) this.restartButton.addEventListener("click", handler);
        if (this.playAgainButton) this.playAgainButton.addEventListener("click", handler);
    }

    // Display the game result and final score
    showGameOver(won, score, reason) {
        if (!this.gameOverOverlay) return;
        this.gameOverOverlay.classList.remove("hidden");

        if (this.gameOverIcon) {
            this.gameOverIcon.textContent = won ? "🎉" : "";
        }
        if (this.gameOverTitle) {
            this.gameOverTitle.textContent = won ? "Supermarket Superstar!" : "Game Over!";
        }
        if (this.gameOverText) {
            this.gameOverText.textContent =
                reason || (won ? "Congratulations! You completed your shopping challenge!" : "The shopping day has ended.");
        }
        if (this.finalScoreElement) {
            this.finalScoreElement.textContent = score;
        }
    }

    setScoreSaveError() {
        if (this.gameOverText) {
            this.gameOverText.textContent += " (Your score could not be saved.)";
        }
    }

    // Restore the UI state and player labels for a new game
    reset(difficultyName, playerName) {
        if (this.gameOverOverlay) this.gameOverOverlay.classList.add("hidden");
        this.closeCheckoutModal();

        if (this.difficultyElement) this.difficultyElement.textContent = difficultyName;
        if (this.playerNameElement) this.playerNameElement.textContent = playerName || "Shopkeeper";
    }
}

// Backward compatibility alias
const GameUI = GameplayUiController;
