// Stores the player's position and handles movement and collected products.

class Player {
    // Creates the player at the starting horizontal and vertical screen coordinates. speed controls how quickly the player moves and defaults to 4.0.
    constructor(startX = 75, startY = 480, speed = 4.0) {
        this.startX = startX;
        this.startY = startY;
        this.x = startX;
        this.y = startY;
        this.width = 30;
        this.height = 36;
        this.baseSpeed = speed;
        this.direction = "down";

        // Stores the unique IDs of all products the player has collected in the basket.
        this.basket = [];
    }

    // Return the player to the starting position and remove all collected products.
    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.direction = "down";
        this.basket = [];
    }

    // Updates the player's position from the keys currently being pressed. keys records which movement keys are active, while canMoveValidator checks whether the player can move into the next position.
    updateMovement(keys, canMoveValidator) {
        let dx = 0;
        let dy = 0;

        const isSprinting = Boolean(keys.Shift || keys.shift);
        const currentSpeed = this.baseSpeed * (isSprinting ? 1.25 : 1.0);

        if (keys.ArrowLeft || keys.a || keys.A) {
            dx -= currentSpeed;
            this.direction = "left";
        }
        if (keys.ArrowRight || keys.d || keys.D) {
            dx += currentSpeed;
            this.direction = "right";
        }
        if (keys.ArrowUp || keys.w || keys.W) {
            dy -= currentSpeed;
            this.direction = "up";
        }
        if (keys.ArrowDown || keys.s || keys.S) {
            dy += currentSpeed;
            this.direction = "down";
        }

        if (dx === 0 && dy === 0) return;

        // Diagonal movement normalization
        if (dx !== 0 && dy !== 0) {
            dx *= 0.7071;
            dy *= 0.7071;
        }

        const nextX = this.x + dx;
        const nextY = this.y + dy;

        if (canMoveValidator(nextX, this.y)) {
            this.x = nextX;
        }
        if (canMoveValidator(this.x, nextY)) {
            this.y = nextY;
        }

        eventBus.emit(GameEvents.PLAYER_MOVED, { x: this.x, y: this.y, direction: this.direction });
    }

    // Adds the product identified by productId to the player's basket and announces that the item was collected.
    addToBasket(productId) {
        this.basket.push(productId);
        eventBus.emit(GameEvents.ITEM_PICKED, { productId, basketCount: this.basket.length });
    }

    // Empty the basket after the customer has received the order.
    emptyBasket() {
        this.basket = [];
    }
}
