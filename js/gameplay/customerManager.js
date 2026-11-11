// Creates customers and their orders, and completes orders.

class CustomerManager {
    static CUSTOMER_TEMPLATES = [
        { name: "Emma", avatar: "👩", message: "Hi! Could you help me find these items?" },
        { name: "Noah", avatar: "👨", message: "I'm making dinner tonight, need a few things!" },
        { name: "Lily", avatar: "👧", message: "Let's go shopping! I have my snack list ready." },
        { name: "Oliver", avatar: "👦", message: "Hello shopkeeper! I need some treats please." },
        { name: "Mia", avatar: "👩‍🦰", message: "Thanks for helping me grab these groceries!" },
        { name: "Alex", avatar: "🧑", message: "Quick stop on my way home! Here's what I need." }
    ];

    constructor() {
        this.previousIndex = -1;
    }

    // Creates the next customer with a new order.
    spawnNextCustomer(gameState) {
        let index;
        do {
            index = Math.floor(Math.random() * CustomerManager.CUSTOMER_TEMPLATES.length);
        } while (CustomerManager.CUSTOMER_TEMPLATES.length > 1 && index === this.previousIndex);

        this.previousIndex = index;
        const template = CustomerManager.CUSTOMER_TEMPLATES[index];

        const customer = new Customer(template.name, template.avatar, template.message);
        customer.generateOrder(productCatalog.items, gameState.orderSize);

        gameState.currentCustomer = customer;

        eventBus.emit(GameEvents.CUSTOMER_ARRIVED, customer);
        eventBus.emit(GameEvents.ORDER_UPDATED, {
            customer,
            progress: customer.getProgressPercentage()
        });

        return customer;
    }

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

        // Win when enough orders are completed
        if (gameState.ordersCompleted >= gameState.targetOrders) {
            gameState.endGame(
                true,
                `Congratulations! You completed ${gameState.targetOrders} customer orders!`
            );
            return;
        }

        // Otherwise bring the next customer
        this.spawnNextCustomer(gameState);
    }
}

// Shared customer manager
const customerManager = new CustomerManager();
