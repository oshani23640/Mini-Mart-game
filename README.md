# Mini Mart Game

A distributed web application and supermarket game built with PHP, MySQL, and modular JavaScript. Developed for **CIS045-3 Distributed Service Architectures** coursework.

---

## 📁 Project Directory Structure

```
MiniMart/
├── index.php                              # Root entry point: auto-redirects to mainMenu or playerLogin
├── README.md                              # Project documentation and architecture guide
├── .editorconfig
├── .prettierrc
├── gameBackend/                           # Server-side API and session management
│   ├── gameApi.php                        # PHP REST API for authentication and MySQL operations
│   ├── databaseConfig.php                 # Database PDO settings and JSON data loader
│   └── sessionManager.php                 # Secure cookie session management (HttpOnly, SameSite)
├── gameStyles/                            # Presentation stylesheets
│   ├── authenticationStyles.css           # Authentication screen styles
│   ├── globalStyles.css                   # Global reset and typography
│   ├── difficultyStyles.css               # Difficulty selection screen layout
│   ├── gameplayStyles.css                 # Supermarket canvas and checkout modal styles
│   ├── instructionsStyles.css             # How-to-play instruction styles
│   ├── menuStyles.css                     # Main dashboard navigation styles
│   └── scoreStyles.css                    # Leaderboard table styles
├── gameData/                              # Game balance and store configurations
│   ├── difficultyLevels.json              # Difficulty settings (time, lives, points, target orders)
│   └── storeProducts.json                 # Supermarket product catalog and shelf coordinates
├── gameDatabase/                          # Relational database schema
│   └── minimartDatabase.sql               # MySQL schema for users and score history
├── gameAssets/                            # Graphic illustrations and backgrounds
│   ├── authHeroBanner.jpg                 # Login and signup card hero illustration
│   ├── gameplayBackground.jpg             # Gameplay background wallpaper
│   └── menuBackground.jpg                 # Menu dashboard background
├── gameScripts/                           # Modular client-side JavaScript architecture
│   ├── playerAuthentication/              # Player login and registration controllers
│   │   ├── playerLogin.js                 # Submits login credentials to gameApi.php
│   │   └── playerSignup.js                # Submits registration details to gameApi.php
│   ├── domainModels/                      # Business entities and state models
│   │   ├── customerModel.js               # Customer and OrderItem domain classes
│   │   ├── gameStateModel.js              # GameState model (lives, score, time, status)
│   │   ├── playerModel.js                 # Player movement, speed, coordinates, and basket
│   │   └── productModel.js                # Product entity and ProductCatalog collection
│   ├── eventSystem/                       # Event-driven broker
│   │   └── gameEventBus.js                # Shared EventBus and GameEvents constants
│   ├── gameplayLogic/                     # Core gameplay mechanics
│   │   ├── customerOrderManager.js        # Customer spawning and order fulfillment rules
│   │   ├── gameplayCoordinator.js         # Lightweight game coordinator & animation loop
│   │   ├── playerInputHandler.js          # Encapsulated keyboard input management
│   │   ├── productCollectionManager.js    # Shelf interaction and basket item collection
│   │   └── gameplayTimer.js               # Countdown timer lifecycle
│   ├── gameRendering/                     # Canvas 2D graphics rendering
│   │   └── supermarketCanvasRenderer.js   # Canvas drawing: floor, shelves, products, player, checkout
│   ├── networkServices/                   # Network and API client services
│   │   ├── fishPuzzleApiClient.js         # Marc Conrad Fish Game REST API client
│   │   ├── puzzleChallengeService.js      # Challenge puzzle lifecycle, pre-fetching, and validation
│   │   └── scoreDataService.js            # Client for PHP backend API (save, fetch, clear scores)
│   └── userInterface/                     # DOM and view controllers
│       ├── difficultySelectionController.js # Difficulty selection controller
│       ├── gameplayUiController.js        # In-game HUD, customer order panel, and modal controller
│       ├── mainMenuController.js          # Dashboard menu controller and logout handler
│       └── scoreLeaderboardController.js  # Leaderboard table view controller
└── gameViews/                             # Web views (PHP pages)
    ├── authenticationGuard.php            # Session verification guard
    ├── gameInstructions.php              # How-to-play guide
    ├── index.php                          # Directory fallback router
    ├── mainMenu.php                       # Player dashboard / main menu
    ├── playerLogin.php                    # User login page
    ├── playerSignup.php                   # User registration page
    ├── scoreLeaderboard.php               # Score history and leaderboard
    ├── selectDifficulty.php               # Difficulty selection screen
    └── supermarketGame.php                # Main supermarket canvas and checkout interface
```

---

## 🎯 Architecture & Video Discussion Guide

When discussing the application in your video presentation, you can present the four core areas:

1. **Software Design Principles**:
   - The system is organized into modular packages (`domainModels`, `gameplayLogic`, `gameRendering`, `userInterface`, `networkServices`).
   - `gameplayCoordinator.js` acts as a mediator for the animation loop and game lifecycle without directly manipulating canvas pixels or raw HTML elements.
   - Graphics rendering is isolated in `supermarketCanvasRenderer.js`.
   - DOM updates and modal dialogues are isolated in `gameplayUiController.js`.
   - Keyboard interaction is managed in `playerInputHandler.js`.
   - Persistence calls are encapsulated in `scoreDataService.js`.

2. **Event-Driven Programming**:
   - `gameEventBus.js` provides a centralized publish-subscribe broker (`eventBus.emit()`, `eventBus.on()`).
   - Gameplay events (`SCORE_CHANGED`, `CUSTOMER_ARRIVED`, `ORDER_UPDATED`, `PUZZLE_LOADED`, `GAME_OVER`) allow subsystems to communicate without direct dependencies.
   - User inputs (keyboard, submit buttons, numpad buttons) trigger discrete application events.

3. **Interoperability**:
   - `fishPuzzleApiClient.js` communicates with the external third-party Marc Conrad Fish Game web service (`https://marcconrad.com/uob/fish/api.php?out=json`) over HTTP GET with timeout handling (`AbortController`).
   - `scoreDataService.js` communicates with the local PHP REST API (`gameBackend/gameApi.php`) via JSON HTTP requests to store and retrieve player scores.

4. **Virtual Identity & Security**:
   - Player credentials are encrypted in MySQL using PHP's `password_hash()` (Bcrypt) and checked with `password_verify()`.
   - `sessionManager.php` secures session cookies using `HttpOnly` and `SameSite=Lax` flags, and regenerates session IDs upon login to prevent session fixation.
   - `authenticationGuard.php` protects private views, redirecting unauthenticated requests to `playerLogin.php`.

---

## 🚀 How to Run the Application

1. Place the `MiniMart/` directory into your WAMP/XAMPP web root (e.g. `C:/wamp64/www/MiniMart/`).
2. Start Apache and MySQL services in WAMP/XAMPP.
3. Import `gameDatabase/minimartDatabase.sql` into MySQL.
4. Verify database credentials in `gameBackend/databaseConfig.php`.
5. Open your browser and navigate to:
   ```
   http://localhost/MiniMart/
   ```
