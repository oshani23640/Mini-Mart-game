# Mini-Mart Game

A 2D retail supermarket game developed for **CIS045-3 Distributed Service Architectures** (Assignment 1).

The game simulates customer orders and shopping tasks in a mini-mart. When an order is completed, the player solves a fish-counting puzzle served by the third-party **Fish Game API** to verify checkout before receiving the next customer. Player accounts and high scores are persisted in **MySQL** via a **PHP** backend running on a **WAMP Server**.

---

## Assignment Themes Covered

### 1. Software Design Principles (Low Coupling & High Cohesion)
- **High Cohesion**: Independent domain models (`Player`, `Customer`, `Product`, `GameState`), modular gameplay managers (`ProductManager`, `CustomerManager`, `GameTimer`, `ScoreHistory`), and dedicated service modules (`FishApiService`, `PuzzleService`).
- **Low Coupling**: Components do not directly mutate each other; instead, they communicate through a centralized `EventBus` (`gameEvents.js`) without hard dependencies between the UI/canvas and underlying business logic.

### 2. Event-Driven Programming
- An asynchronous publish/subscribe architecture via `EventBus` and `GameEvents`.
- Key events include `player:item_picked`, `customer:arrived`, `customer:served`, `order:updated`, `puzzle:requested`, `puzzle:loaded`, `puzzle:error`, `stats:score_changed`, `stats:lives_changed`, `stats:time_tick`, and `game:over`.
- The HUD (score, time, lives, order list, checkout puzzle) updates by reacting to published events; the canvas scene is redrawn every animation frame from the current game state.

### 3. Interoperability
- **External Web Service Integration**: Integrates Marc Conrad's external **Fish Game API** (`https://marcconrad.com/uob/fish/api.php?out=json`) via HTTP/REST and JSON.
- **Client-Server Interoperability**: Front-end JavaScript communicates asynchronously with the PHP REST backend via Fetch API and JSON payloads over HTTP.

### 4. Virtual Identity & Security
- **Authentication**: User registration and login backed by MySQL.
- **Secure Password Hashing**: Utilizes PHP's native `password_hash()` (bcrypt) and `password_verify()`.
- **Session-Based Virtual Identity**: PHP session cookies configured with `HttpOnly` and `SameSite=Lax` to prevent XSS session hijacking. All pages and the API start sessions through one file (`backend/session.php`), so the cookie settings are always the same.
- **Access Control**: Server-side guard (`auth_guard.php`) ensures unauthorized users cannot access gameplay or score records.
- **Server-side validation**: The difficulty in the game URL is checked against `data/levels.json`, and `save_score` rejects scores above the maximum possible for that difficulty.
- **No browser storage**: The game does not use `localStorage`, `sessionStorage` or `IndexedDB`. Identity lives in the PHP session and results live in MySQL.

---

## Directory Structure

```
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

---

## Code Style

- 4-space indentation, semicolons and double quotes (VS Code / Prettier style).
- `.editorconfig`, `.prettierrc` and `.vscode/settings.json` keep the same style when editing.
- Comments are short, one line each.

---

## WAMP Server Setup & Installation

1. **Start WAMP Server**: Ensure Apache and MySQL services are active (green icon in the system tray).
2. **Import Database**:
   - Open **phpMyAdmin** (`http://localhost/phpmyadmin/`).
   - Go to the **Import** tab.
   - Choose `database/minimart_db.sql` and click **Import**.
   - This creates the `minimart_db` database and the `users` and `scores` tables.
3. **Deploy Code**:
   - Copy the `Mini-Mart-Game` folder into your WAMP `www` directory:
     `C:\wamp64\www\Mini-Mart-Game`
4. **Database login**: The default WAMP user (`root`, empty password) is set in `backend/config.php`. Change it there if your MySQL settings are different.
5. **Open in Browser**:
   - Navigate to: `http://localhost/Mini-Mart-Game/pages/index.php` (or `http://localhost/Mini-Mart-Game/pages/login.php`).
   - Create an account on the **Sign Up** page.
   - Log in with your new account to access the game menu, select difficulty, and start playing!
