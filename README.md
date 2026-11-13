
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

