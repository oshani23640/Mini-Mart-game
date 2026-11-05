// Checks nearby products and adds requested items to the player's basket.

class ProductManager {
    // Checks whether the player can collect a nearby product during an active game. player provides the player's position and basket, while gameState provides the current game status. Returns the collected product or null if nothing can be collected.
    static tryCollectProduct(player, gameState) {
        if (!gameState.running || gameState.isGameOver) return null;

        const product = productCatalog.getNearest(player.x, player.y, 50);
        if (!product) return null;

        if (!gameState.currentCustomer) return null;

        // Check if current customer requested this product and still needs it
        const orderItem = gameState.currentCustomer.order.find(
            item => item.productId === product.id
        );

        if (!orderItem) {
            return { product, status: "NOT_IN_ORDER" };
        }

        if (orderItem.collected >= orderItem.quantity) {
            return { product, status: "ALREADY_COMPLETED" };
        }

        // Add to order and basket
        orderItem.collected += 1;
        player.addToBasket(product.id);

        eventBus.emit(GameEvents.ORDER_UPDATED, {
            customer: gameState.currentCustomer,
            progress: gameState.currentCustomer.getProgressPercentage()
        });

        return { product, status: "COLLECTED" };
    }
}
