// Customer spawning and order fulfillment

"use strict";

class CustomerOrderManager {
    static CUSTOMER_TEMPLATES = [
        { name: "Emma", avatar: "👩" },
        { name: "Noah", avatar: "👨" },
        { name: "Lily", avatar: "👧" },
        { name: "Oliver", avatar: "👦" },
        { name: "Mia", avatar: "👩‍🦰"},
        { name: "Alex", avatar: "🧑" }
    ];

    constructor() {
        this.previousIndex = -1;
    }

    // Choose a different customer, generate their order, and notify the UI
    spawnNextCustomer(gameState) {
        let index;
        do {
            index = Math.floor(Math.random() * CustomerOrderManager.CUSTOMER_TEMPLATES.length);
        } while (CustomerOrderManager.CUSTOMER_TEMPLATES.length > 1 && index === this.previousIndex);

        this.previousIndex = index;
        const template = CustomerOrderManager.CUSTOMER_TEMPLATES[index];

        const customer = new Customer(template.name, template.avatar, template.message);
        customer.generateOrder(productCatalog.items, gameState.orderSize);

        gameState.currentCustomer = customer;

        eventBus.emit(GameEvents.CUSTOMER_ARRIVED, customer);
        eventBus.emit(GameEvents.ORDER_UPDATED, { customer });

        return customer;
    }

    // Award order points, clear the basket, and continue or finish the game
    fulfillCustomerOrder(gameState, player, bonusPoints = 0) {
        const totalPoints = gameState.pointsPerOrder + bonusPoints;
        gameState.addScore(totalPoints);

        const servedCustomer = gameState.currentCustomer;
        player.emptyBasket();

        gameState.ordersCompleted++;

        eventBus.emit(GameEvents.CUSTOMER_SERVED, {
            customer: servedCustomer,
            points: totalPoints,
            bonus: bonusPoints
        });

        if (gameState.ordersCompleted >= gameState.targetOrders) {
            gameState.endGame(
                true,
                "Congratulations! You completed " + gameState.targetOrders + " customer orders!"
            );
            return;
        }

        this.spawnNextCustomer(gameState);
    }
}

const customerOrderManager = new CustomerOrderManager();
// Backward compatibility alias
const customerManager = customerOrderManager;
const CustomerManager = CustomerOrderManager;
