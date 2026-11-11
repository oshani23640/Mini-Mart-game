// Event names and a small event bus.

// Event names
const GameEvents = Object.freeze({
    // Game end
    GAME_OVER: "game:over",

    // Player actions
    ITEM_PICKED: "player:item_picked",

    // Customers and orders
    CUSTOMER_ARRIVED: "customer:arrived",
    CUSTOMER_SERVED: "customer:served",
    ORDER_UPDATED: "order:updated",

    // Checkout puzzles
    PUZZLE_REQUESTED: "puzzle:requested",
    PUZZLE_LOADED: "puzzle:loaded",
    PUZZLE_ERROR: "puzzle:error",

    // Score, time and lives
    SCORE_CHANGED: "stats:score_changed",
    LIVES_CHANGED: "stats:lives_changed",
    TIME_TICK: "stats:time_tick"
});

class EventBus {
    constructor() {
        // Maps each event name to its listeners.
        this.listeners = new Map();
    }

    // Adds a listener and returns a function to remove it.
    on(eventName, callback) {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, new Set());
        }
        this.listeners.get(eventName).add(callback);

        // Returns an unsubscribe function
        return () => this.off(eventName, callback);
    }

    // Removes a listener.
    off(eventName, callback) {
        if (this.listeners.has(eventName)) {
            this.listeners.get(eventName).delete(callback);
        }
    }

    // Calls every listener of an event.
    emit(eventName, payload) {
        if (this.listeners.has(eventName)) {
            this.listeners.get(eventName).forEach((callback) => {
                try {
                    callback(payload);
                } catch (err) {
                    console.error(`Error in event listener for "${eventName}":`, err);
                }
            });
        }
    }
}

// Shared event bus
const eventBus = new EventBus();
