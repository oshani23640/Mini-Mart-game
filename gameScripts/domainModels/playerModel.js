// Stores the player's position, movement and basket

class Player {
    // Creates the player at a start position
    constructor(startX = 75, startY = 480, speed = 4.0) {
        this.startX = startX;
        this.startY = startY;
        this.x = startX;
        this.y = startY;
        this.width = 30;
        this.height = 36;
        this.baseSpeed = speed;
        this.direction = "down";

        // IDs of collected products
        this.basket = [];
    }

    // Moves the player back to the start and empties the basket
    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.direction = "down";
        this.basket = [];
    }

    // Moves the player from the pressed keys if the move is allowed
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
    }

    // Adds a product to the basket
    addToBasket(productId) {
        this.basket.push(productId);
        eventBus.emit(GameEvents.ITEM_PICKED, { productId, basketCount: this.basket.length });
    }

    // Empties the basket
    emptyBasket() {
        this.basket = [];
    }
}
