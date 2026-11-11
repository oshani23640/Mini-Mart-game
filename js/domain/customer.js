// Customer details and order tracking.

class OrderItem {
    // One product and the quantity wanted.
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
    // Creates a customer with a name, avatar and message.
    constructor(name, avatar, message) {
        this.name = name;
        this.avatar = avatar;
        this.message = message;
        // Items requested by this customer
        this.order = [];
    }

    // Builds a random order.
    generateOrder(availableProducts, orderSize = 2) {
        this.order = [];
        const shuffled = [...availableProducts].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(orderSize, shuffled.length));

        selected.forEach((prod) => {
            const qty = Math.floor(Math.random() * 2) + 1;
            this.order.push(new OrderItem(prod.id, qty));
        });
    }

    // Returns order progress from 0 to 100.
    getProgressPercentage() {
        let total = 0;
        let collected = 0;
        this.order.forEach((item) => {
            total += item.quantity;
            collected += Math.min(item.collected, item.quantity);
        });
        return total === 0 ? 0 : Math.round((collected / total) * 100);
    }

    // Returns true when every item is collected.
    isOrderFulfilled() {
        return this.order.length > 0 && this.order.every((item) => item.isComplete);
    }
}
