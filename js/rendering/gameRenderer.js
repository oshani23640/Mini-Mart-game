// Canvas 2D Graphics Renderer
// High Cohesion: Purely responsible for drawing supermarket scene, player, shelves, products, and checkout.

"use strict";

class GameRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }

    drawRoundedRect(x, y, width, height, radius, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.roundRect(x, y, width, height, radius);
        this.ctx.fill();
    }

    drawFloor() {
        this.ctx.fillStyle = "#eaf5e7";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.strokeStyle = "#5b86b7";
        this.ctx.lineWidth = 1;

        for (let x = 0; x < this.canvas.width; x += 48) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = 0; y < this.canvas.height; y += 48) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    drawShelf(x, y, width, title) {
        this.drawRoundedRect(x + 3, y + 5, width, 105, 8, "#b8c9d3");
        this.drawRoundedRect(x, y, width, 105, 8, "#7aa9d8");
        this.drawRoundedRect(x + 4, y + 4, width - 8, 22, 6, "#244c76");

        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "bold 12px Arial";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(title, x + width / 2, y + 15);

        this.drawRoundedRect(x + 6, y + 30, width - 12, 30, 5, "#9fc2e7");
        this.drawRoundedRect(x + 6, y + 57, width - 12, 30, 5, "#9fc2e7");
    }

    drawShelves() {
        this.drawShelf(80, 140, 800, "BAKERY & DAIRY AISLE");
        this.drawShelf(80, 310, 800, "SNACKS & FRESH PRODUCE AISLE");
    }

    drawProducts(products, player) {
        products.forEach((product) => {
            const isNear = product.isWithinReach(player.x, player.y, 48);

            if (isNear) {
                this.ctx.beginPath();
                this.ctx.arc(product.x, product.y, 25, 0, Math.PI * 2);
                this.ctx.fillStyle = "rgba(255, 220, 100, 0.45)";
                this.ctx.fill();
                this.ctx.strokeStyle = "#f59e0b";
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }

            this.ctx.font = "30px Arial";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText(product.icon, product.x, product.y);

            this.ctx.fillStyle = "#1e3a5f";
            this.ctx.font = "bold 17px Arial";
            this.ctx.fillText(product.name, product.x, product.y + 21);
        });
    }

    drawCheckout(checkoutBox, registerPos, currentCustomer, isNearRegister) {
        this.drawRoundedRect(checkoutBox.x + 3, checkoutBox.y + 4, checkoutBox.width, checkoutBox.height, 8, "#b3c1cd");
        this.drawRoundedRect(checkoutBox.x, checkoutBox.y, checkoutBox.width, checkoutBox.height, 8, "#5d7894");
        this.drawRoundedRect(checkoutBox.x + 6, checkoutBox.y + 6, checkoutBox.width - 12, 20, 4, "#8da8c4");

        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "bold 10px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText("CHECKOUT", checkoutBox.x + checkoutBox.width / 2, checkoutBox.y + 19);

        // Register terminal
        this.drawRoundedRect(checkoutBox.x + 12, checkoutBox.y + 35, 30, 20, 4, "#334155");
        this.ctx.fillStyle = "#38bdf8";
        this.ctx.fillRect(checkoutBox.x + 15, checkoutBox.y + 38, 24, 12);

        // Customer avatar at checkout
        this.ctx.font = "28px Arial";
        this.ctx.textAlign = "center";
        const avatar = currentCustomer ? currentCustomer.avatar : "👩";
        this.ctx.fillText(avatar, registerPos.x, registerPos.y);

        // Proximity indicator
        if (isNearRegister) {
            this.ctx.fillStyle = "#101416";
            this.ctx.font = "bold 12px Arial";
            this.ctx.fillText("Press ENTER to Ring Up!", registerPos.x, 430);
        }
    }

    drawPlayer(player) {
        const x = player.x;
        const y = player.y;

        // Shadow
        this.ctx.beginPath();
        this.ctx.ellipse(x, y + 16, 12, 5, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        this.ctx.fill();

        // Apron / Body
        this.drawRoundedRect(x - 12, y - 5, 24, 22, 5, "#347ed0");
        this.drawRoundedRect(x - 6, y + 3, 12, 7, 2, "#d7eaff");

        // Head
        this.ctx.beginPath();
        this.ctx.arc(x, y - 17, 14, 0, Math.PI * 2);
        this.ctx.fillStyle = "#ffd9bd";
        this.ctx.fill();

        // Hair
        this.ctx.beginPath();
        this.ctx.arc(x, y - 21, 14, Math.PI, Math.PI * 2);
        this.ctx.fillStyle = "#68432f";
        this.ctx.fill();

        // Hat
        this.drawRoundedRect(x - 16, y - 34, 32, 9, 4, "#ffffff");
        this.drawRoundedRect(x - 12, y - 41, 24, 10, 4, "#347ed0");

        // Face & Eyes
        this.ctx.fillStyle = "#2c1d11";
        let eyeOffsetX = 0;
        if (player.direction === "left") eyeOffsetX = -3;
        if (player.direction === "right") eyeOffsetX = 3;

        if (player.direction !== "up") {
            this.ctx.beginPath();
            this.ctx.arc(x - 4 + eyeOffsetX, y - 17, 2, 0, Math.PI * 2);
            this.ctx.arc(x + 4 + eyeOffsetX, y - 17, 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    render(player, products, currentCustomer, isNearRegister, checkoutBox, registerPos) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawFloor();
        this.drawShelves();
        this.drawProducts(products, player);
        this.drawCheckout(checkoutBox, registerPos, currentCustomer, isNearRegister);
        this.drawPlayer(player);
    }
}
