// Shop products and the product catalogue.

class Product {
    // Creates a product with its shelf position.
    constructor(id, name, icon, shelfX, shelfY) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.x = shelfX;
        this.y = shelfY;
    }

    // Checks if the player is close enough to collect this product.
    isWithinReach(px, py, reachDistance = 48) {
        return Math.hypot(this.x - px, this.y - py) <= reachDistance;
    }
}

class ProductCatalog {
    constructor() {
        // All products in the shop
        this.items = [];
    }

    // Loads products from the data file.
    load(rawProducts) {
        this.items = rawProducts.map((p) => new Product(p.id, p.name, p.icon, p.shelfX, p.shelfY));
    }

    // Finds a product by ID.
    findById(id) {
        return this.items.find((p) => p.id === id);
    }

    // Finds the closest product within maxDistance.
    getNearest(x, y, maxDistance = 48) {
        let nearest = null;
        let minDistance = Infinity;

        for (const product of this.items) {
            const dist = Math.hypot(product.x - x, product.y - y);
            if (dist < minDistance && dist <= maxDistance) {
                minDistance = dist;
                nearest = product;
            }
        }
        return nearest;
    }
}

// Shared product catalogue
const productCatalog = new ProductCatalog();
