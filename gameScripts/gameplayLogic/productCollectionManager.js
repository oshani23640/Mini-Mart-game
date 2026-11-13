// Shelf interaction and product collection manager.

"use strict";

class ProductCollectionManager {
    static tryCollectProduct(player, gameState) {
        if (!gameState.running || gameState.isGameOver) return null;

        const product = productCatalog.getNearest(player.x, player.y, 50);
        if (!product) return null;

        if (!gameState.currentCustomer) return null;

        const orderItem = gameState.currentCustomer.order.find(
            (item) => item.productId === product.id
        );

        if (!orderItem) {
            return { product, status: "NOT_IN_ORDER" };
        }

        if (orderItem.collected >= orderItem.quantity) {
            return { product, status: "ALREADY_COMPLETED" };
        }

        orderItem.collected += 1;
        player.addToBasket(product.id);

        eventBus.emit(GameEvents.ORDER_UPDATED, {
            customer: gameState.currentCustomer,
            progress: gameState.currentCustomer.getProgressPercentage()
        });

        return { product, status: "COLLECTED" };
    }
}

// Backward compatibility alias
const ProductManager = ProductCollectionManager;
