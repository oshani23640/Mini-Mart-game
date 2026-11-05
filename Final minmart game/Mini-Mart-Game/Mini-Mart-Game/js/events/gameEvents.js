// Defines event names and provides methods for publishing and subscribing to game events.

// Names used to identify game events
const GameEvents = Object.freeze({
    // Events for starting, resetting and ending the game
    GAME_START: "game:start",
    GAME_PAUSE: "game:pause",
    GAME_RESUME: "game:resume",
    GAME_OVER: "game:over",

    // Events caused by player movement and actions
    PLAYER_MOVED: "player:moved",
    ITEM_PICKED: "player:item_picked",
    ORDER_SUBMITTED: "player:order_submitted",

    // Events for customer and order updates
    CUSTOMER_ARRIVED: "customer:arrived",
    CUSTOMER_SERVED: "customer:served",
    CUSTOMER_LEFT: "customer:left",
    ORDER_UPDATED: "order:updated",

    // Events for loading and answering checkout puzzles
    PUZZLE_REQUESTED: "puzzle:requested",
    PUZZLE_LOADED: "puzzle:loaded",
    PUZZLE_ANSWERED: "puzzle:answered",
    PUZZLE_ERROR: "puzzle:error",

    // Events for score, time and lives changes
    SCORE_CHANGED: "stats:score_changed",
    LIVES_CHANGED: "stats:lives_changed",
    TIME_TICK: "stats:time_tick"
});

class EventBus {
    constructor() {
        // Maps each event name to the set of functions listening for that event.
        this.listeners = new Map();
    }

    // Registers a function to run whenever the named game event is announced. eventName identifies the event, and callback is the function to run.
    on(eventName, callback) {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, new Set());
        }
        this.listeners.get(eventName).add(callback);

        // Return unsubscribe function for clean lifecycle management
        return () => this.off(eventName, callback);
    }

    // Registers a function for the named event and removes it after its first execution. eventName identifies the event, and callback handles it.
    once(eventName, callback) {
        const wrapper = (payload) => {
            this.off(eventName, wrapper);
            callback(payload);
        };
        this.on(eventName, wrapper);
    }

    // Removes the specified callback from the listeners registered for eventName so it no longer receives that event.
    off(eventName, callback) {
        if (this.listeners.has(eventName)) {
            this.listeners.get(eventName).delete(callback);
        }
    }

    // Announces that a game event has occurred and sends optional data to every function listening for it. eventName identifies the event, and payload contains related information.
    emit(eventName, payload) {
        if (this.listeners.has(eventName)) {
            this.listeners.get(eventName).forEach(callback => {
                try {
                    callback(payload);
                } catch (err) {
                    console.error(`Error in event listener for "${eventName}":`, err);
                }
            });
        }
    }

    // Remove every event listener so no callbacks remain registered.
    clear() {
        this.listeners.clear();
    }
}

// Shared event manager used by the game modules
const eventBus = new EventBus();
