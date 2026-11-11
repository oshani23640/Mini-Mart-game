# Mini-Mart Game

## Directory Structure

Mini-Mart-Game/
├── backend/
│   ├── api.php             # PHP REST API for authentication and MySQL score operations
│   ├── config.php          # Database settings and JSON data loader
│   └── session.php         # Secure session start shared by pages and API
├── css/
│   ├── auth.css            # Styles for login and registration forms
│   ├── common.css          # Shared base and reset styles
│   ├── difficulty.css      # Styles for difficulty selection screen
│   ├── game.css            # Game canvas and checkout modal styles
│   ├── instructions.css    # How-to-play instruction styles
│   ├── menu.css            # Main navigation menu styles
│   └── score.css           # High score leaderboard styles
├── data/
│   ├── levels.json         # Difficulty settings (time, lives, points, order size, target orders)
│   └── products.json       # Shop products and shelf positions
├── database/
│   └── minimart_db.sql     # MySQL database and table schema
├── images/
│   ├── Game-Background.jpg # Gameplay background wallpaper
│   ├── GameMenu-Background.jpg # Menu screen background
│   └── mini.jpg            # Login and sign-up card hero image
├── js/
│   ├── auth/
│   │   ├── login.js        # Submits login credentials to API
│   │   └── signup.js       # Submits registration details to API
│   ├── domain/
│   │   ├── customer.js     # Customer and OrderItem domain models
│   │   ├── gamestate.js    # GameState tracking lives, time, and score
│   │   ├── player.js       # Player position, movement, and basket domain model
│   │   └── product.js      # Product and ProductCatalog domain models
│   ├── events/
│   │   └── gameEvents.js   # EventBus and GameEvents constants
│   ├── gameplay/
│   │   ├── customerManager.js # Customer spawning and order fulfillment
│   │   ├── game.js         # Main game loop, canvas renderer, and checkout handler
│   │   ├── levelManager.js # Opens the game page for the chosen difficulty
│   │   ├── productManager.js  # Product pickup and basket management
│   │   ├── scoreHistory.js # Score loading and deletion
│   │   └── timer.js        # Countdown timer management
│   ├── services/
│   │   ├── api.js          # Marc Conrad Fish Game API client
│   │   └── puzzle.js       # Challenge puzzle management and answer verification
│   └── app.js              # Menu page logic and logout handling
└── pages/
    ├── auth_guard.php      # Session check redirecting unauthorized users
    ├── difficulty.php      # Difficulty selection page
    ├── game.php            # Main supermarket canvas and checkout interface
    ├── index.php           # Entry point routing to menu or login
    ├── instructions.php    # How to play guide
    ├── login.php           # User login page
    ├── menu.php            # Player dashboard / main menu
    ├── score.php           # Score history and leaderboard
    └── signup.php          # User registration page
```
