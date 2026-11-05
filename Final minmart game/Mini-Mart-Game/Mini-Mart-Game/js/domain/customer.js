// Stores customer details and tracks each shopping order.

class OrderItem {
    // Creates an order item using the product's unique ID and the number of units the customer wants.
    constructor(productId, quantity) {
        this.productId = productId;
        this.quantity = quantity;
        this.collected = 0;
    }

    get isComplete() {
        return this.collected >= this.quantity;
    }
}

class Customer {
    // Creates a customer with a display name, an avatar image or emoji, and the message shown to the player.
    constructor(name, avatar, message) {
        this.name = name;
        this.avatar = avatar;
        this.message = message;
        // Holds the list of items requested by this customer.
        this.order = [];
    }

    // Builds a random customer order from the available shop products. availableProducts is the product list, and orderSize sets how many different items to request.
    generateOrder(availableProducts, orderSize = 2) {
        this.order = [];
        const shuffled = [...availableProducts].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(orderSize, shuffled.length));

        selected.forEach(prod => {
            const qty = Math.floor(Math.random() * 2) + 1;
            this.order.push(new OrderItem(prod.id, qty));
        });
    }

    // Calculates how much of the customer's order has been collected and returns the progress as a percentage from 0 to 100.
    getProgressPercentage() {
        let total = 0;
        let collected = 0;
        this.order.forEach(item => {
            total += item.quantity;
            collected += Math.min(item.collected, item.quantity);
        });
        return total === 0 ? 0 : Math.round((collected / total) * 100);
    }

    // Checks whether every item in the customer's order has been collected. Returns true when the order is complete; otherwise, returns false.
    isOrderFulfilled() {
        return this.order.length > 0 && this.order.every(item => item.isComplete);
    }
}
