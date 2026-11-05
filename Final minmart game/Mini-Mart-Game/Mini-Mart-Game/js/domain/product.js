// Defines shop products and manages the product catalogue.

class Product {
    // Creates a shop product. The values supplied are its unique ID, display name, icon, shelf position, price, and category. The price defaults to 5 and the category defaults to General.
    constructor(id, name, icon, shelfX, shelfY, price = 5, category = "General") {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.x = shelfX;
        this.y = shelfY;
        this.price = price;
        this.category = category;
    }

    // Checks whether the player is close enough to collect this product. px and py are the player's screen coordinates, and reachDistance is the maximum allowed distance (48 by default). Returns true when the product is within reach.
    isWithinReach(px, py, reachDistance = 48) {
        return Math.hypot(this.x - px, this.y - py) <= reachDistance;
    }
}

class ProductCatalog {
    constructor() {
        // Contains all products currently available in the shop catalogue.
        this.items = [];
    }

    // Loads the shop catalogue from the supplied product data. rawProducts contains the product records read from the data file.
    load(rawProducts) {
        this.items = rawProducts.map(p => new Product(
            p.id,
            p.name,
            p.icon,
            p.shelfX || p.x,
            p.shelfY || p.y,
            p.price || 5,
            p.category || "General"
        ));
    }

    // Searches the catalogue for the product with the given unique ID. Returns the matching product, or undefined if no product has that ID.
    findById(id) {
        return this.items.find(p => p.id === id);
    }

    // Finds the closest product to the supplied screen coordinates. x and y are the search position, and maxDistance limits how far away a product can be. Returns the nearest product or null if none is close enough.
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

// Shared product catalogue instance
const productCatalog = new ProductCatalog();
