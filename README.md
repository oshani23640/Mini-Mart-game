# Mini Mart Game

A distributed web application and supermarket game built with PHP, MySQL, and modern modular JavaScript. Developed for **CIS045-3 Distributed Service Architectures** coursework.

---

## 📁 Project Architecture & Directory Structure

```
MiniMart/
├── index.php                 # Root entry point: auto-redirects to menu or login
├── README.md                 # Architecture, design principles, and assignment theme mapping
├── .editorconfig
├── .prettierrc
├── backend/                  # Server-side architecture & virtual identity management
│   ├── api.php               # PHP REST API for authentication and MySQL score operations
│   ├── config.php            # Database PDO settings and JSON data loader
│   └── session.php           # Secure cookie session management (HttpOnly, SameSite)
├── css/                      # Presentation styling
│   ├── auth.css              # Authentication view styles
│   ├── common.css            # Global resets and design system variables
│   ├── difficulty.css        # Difficulty selection screen layout
│   ├── game.css              # Game canvas and checkout modal styles
│   ├── instructions.css      # How-to-play instruction styles
│   ├── menu.css              # Dashboard navigation styles
│   └── score.css             # Leaderboard table styles
├── data/                     # Game configurations
│   ├── levels.json           # Difficulty balance (time, lives, points, target orders)
│   └── products.json         # Supermarket catalogue and shelf coordinates
├── database/                 # Relational database schema
│   └── minimart_db.sql       # MySQL schema for users and scores
├── images/                   # Visual assets and backgrounds
│   ├── Game-Background.jpg   # Gameplay background wallpaper
│   ├── GameMenu-Background.jpg # Main menu background
│   └── mini.jpg              # Auth card hero illustration
├── js/                       # Client-side JavaScript modules
│   ├── auth/                 # Authentication controllers
│   │   ├── login.js          # Submits login credentials to API
│   │   └── signup.js         # Submits registration details to API
│   ├── domain/               # Domain Models (Encapsulated state & business entities)
│   │   ├── customer.js       # Customer and OrderItem domain classes
│   │   ├── gamestate.js      # GameState tracking lives, time, score, and game status
│   │   ├── player.js         # Player movement, speed, coordinates, and basket
│   │   └── product.js        # Product entity and ProductCatalog collection
│   ├── events/               # Event-Driven Architecture
│   │   └── gameEvents.js     # Shared EventBus and GameEvents constants
│   ├── gameplay/             # Core game mechanics & loop coordination
│   │   ├── customerManager.js# Customer spawning and order fulfillment rules
│   │   ├── game.js           # Lightweight game coordinator & animation loop
│   │   ├── inputHandler.js   # Encapsulated keyboard input management
│   │   ├── productManager.js # Shelf interaction and basket item collection
│   │   └── timer.js          # Countdown timer lifecycle
│   ├── rendering/            # Canvas 2D Graphics (Separation of View Concern)
│   │   └── gameRenderer.js   # Canvas drawing: floor, shelves, products, player, checkout
│   ├── services/             # Interoperability & Data Persistence Services
│   │   ├── fishApi.js        # Marc Conrad Fish Game REST API client
│   │   ├── puzzleService.js  # Challenge puzzle lifecycle, pre-fetching, and validation
│   │   └── scoreService.js   # Client for PHP backend API (save, fetch, clear scores)
│   └── ui/                   # User Interface & View Controllers
│       ├── difficulty.js     # Difficulty selection page controller
│       ├── gameUI.js         # In-game HUD, customer order panel, and modal controller
│       ├── menu.js           # Main menu dashboard navigation and logout handler
│       └── scoreHistory.js   # Leaderboard table view controller
└── pages/                    # Web Views (PHP Pages)
    ├── auth_guard.php        # Server-side virtual identity verification guard
    ├── difficulty.php        # Difficulty selection screen
    ├── game.php              # Main supermarket canvas and checkout interface
    ├── index.php             # Directory fallback router
    ├── instructions.php      # How-to-play guide
    ├── login.php             # User login page
    ├── menu.php              # Player dashboard / main menu
    ├── score.php             # Score history and leaderboard
    └── signup.php            # User registration page
```

---

## 🎯 Alignment with the Four Assignment Themes

### 1. Software Design Principles: Low Coupling & High Cohesion
- **High Cohesion**: Each module has a single, clearly bounded responsibility:
  - `GameRenderer` (`js/rendering/gameRenderer.js`): Purely renders Canvas 2D graphics. It holds no game state and makes no network calls.
  - `GameUI` (`js/ui/gameUI.js`): Purely manages DOM elements (score badges, lives, timer, customer order checklist, modals).
  - `InputHandler` (`js/gameplay/inputHandler.js`): Purely captures keyboard interactions and exposes active key state.
  - `ScoreService` (`js/services/scoreService.js`): Purely encapsulates backend persistence operations.
  - `Game` (`js/gameplay/game.js`): Refactored from a 600-line monolithic "God Object" into a lightweight (~140 lines) coordinator orchestrating the game loop.
- **Low Coupling**:
  - Components communicate through the **Publish-Subscribe** pattern using `EventBus` (`js/events/gameEvents.js`).
  - View components do not mutate domain state directly; instead, they emit or listen for standard events.
  - Network endpoints are encapsulated in service classes rather than scattered throughout UI scripts.

### 2. Event-Driven Programming
- **Centralized EventBus**: An event broker (`EventBus`) allows producers (e.g., `Timer`, `ProductManager`, `GameState`, `PuzzleService`) to emit events without needing direct references to consumers (e.g., `GameUI`).
- **Standardized Events**: `GameEvents` constant catalog:
  - `SCORE_CHANGED`, `LIVES_CHANGED`, `TIME_TICK`
  - `CUSTOMER_ARRIVED`, `ORDER_UPDATED`, `CUSTOMER_SERVED`
  - `PUZZLE_REQUESTED`, `PUZZLE_LOADED`, `PUZZLE_ERROR`
  - `GAME_OVER`
- **GUI Event Translation**: Keyboard events (`keydown`, `keyup`), button clicks, and numpad inputs are captured and translated into application-level actions.

### 3. Interoperability
- **Third-Party Web Service Integration**: Connects to the external **Marc Conrad Fish Game API** (`https://marcconrad.com/uob/fish/api.php?out=json`) via `FishApiService` (`js/services/fishApi.js`), consuming JSON payloads over HTTP GET with timeout handling (`AbortController`).
- **Client-Server REST Communication**: Interoperates between the client JavaScript frontend and the PHP backend (`backend/api.php`) via standard JSON requests (`POST`, `GET`) for score persistence and session management.

### 4. Virtual Identity & Security
- **Authentication**: User accounts are created and verified in MySQL using PHP's `password_hash()` (Bcrypt) and `password_verify()`.
- **Session Protection**: Managed in `backend/session.php` with security flags:
  - `HttpOnly`: Prevents client-side XSS script access to session tokens.
  - `SameSite=Lax`: Mitigates Cross-Site Request Forgery (CSRF).
  - `session_regenerate_id(true)`: Executed on login to eliminate session fixation attacks.
- **Access Control Guard**: `pages/auth_guard.php` protects private endpoints and game views, redirecting unauthenticated requests to `login.php`.

---

## 🚀 Getting Started

1. Place the `MiniMart/` directory into your WAMP/XAMPP web root (e.g., `C:/wamp64/www/MiniMart/`).
2. Start Apache and MySQL services.
3. Import `database/minimart_db.sql` into phpMyAdmin / MySQL.
4. Verify database credentials in `backend/config.php` (default: host `localhost`, user `root`, password `""`).
5. Open your browser and navigate to:
   ```
   http://localhost/MiniMart/
   ```
