# Mini Mart Game

## About the Project

Mini Mart is a 2D supermarket game developed using PHP, JavaScript, HTML, CSS and MySQL. In this game, the player takes the role of a supermarket worker who needs to collect products and complete customer orders within a limited time.

Customers visit the supermarket with different shopping orders. The player must move around the shop, collect the requested products from the shelves and complete each order at the checkout counter. After completing an order, a Fish Game puzzle challenge appears. The player needs to answer the puzzle correctly to continue serving customers.

The game also includes different difficulty levels, a scoring system, a countdown timer, lives and a leaderboard.

## Main Features

- Player registration and login.
- Three difficulty levels: Easy, Medium and Difficult.
- Customer orders with different products.
- Player movement using keyboard controls.
- Product collection and checkout.
- Fish Game puzzle challenges.
- Additional Tomato Game puzzle challenges.
- Score and bonus point system.
- Countdown timer and lives.
- Leaderboard to display player scores.

## Technologies Used

- **HTML** – Used to create the game pages and structure.
- **CSS** – Used to design the game interface and layout.
- **JavaScript** – Used to handle player movement, customer orders, product collection, game events and gameplay features.
- **PHP** – Used for player authentication, sessions and communication with the database.
- **MySQL** – Used to store player account details and game scores.
- **JSON** – Used to store product information and difficulty settings.

## Project Structure

```text
MiniMart-9/
├── index.php                              # Root router: auto-redirects to mainMenu or playerLogin
├── README.md                              # Project documentation
├── .editorconfig
├── .prettierrc
└── src/main/
    ├── asset/
    │   └── gameAssets/                    # Graphic illustrations and backgrounds
    └── minimart/
        ├── index.php                      # Minimart router
        ├── gameBackend/                   # REST API, database PDO config, and session manager
        ├── gameDatabase/                  # MySQL schema (minimartDatabase.sql)
        ├── gameData/                      # Levels and products JSON catalogs
        ├── gameScripts/                   # Modular client-side JavaScript architecture
        ├── gameStyles/                    # CSS stylesheets
        └── gameViews/                     # PHP web views
```

## How to Play

1. Register or log in to start the game.
2. Select a difficulty level.
3. Read the game instructions before starting.
4. Use the W, A, S, D keys or arrow keys to move around the supermarket.
5. Hold SHIFT to move faster.
6. Collect the products requested by customers.
7. Take the collected products to the checkout counter to complete the order.
8. Solve the Fish Game puzzle that appears after completing an order.
9. Continue serving customers to earn more points.
10. Try to complete as many orders as possible before the timer runs out.
11. Check your final score on the leaderboard.

## External APIs

The game uses external puzzle APIs to provide additional challenges during gameplay.

- **Fish Game API:** https://marcconrad.com/uob/fish/api.php
- **Tomato Game API:** https://marcconrad.com/uob/tomato/api.php

These services provide puzzle information and corresponding answers in JSON format. The game retrieves the puzzle data using the JavaScript Fetch API.

## Database

The project uses a MySQL database to manage player information and game scores.

The database includes:

- Player account information.
- Hashed passwords.
- Game scores.
- Difficulty levels.
- Score records.

## How to Run the Application

1. Extract or place the project folder into your web server directory (e.g. `C:/wamp64/www/MiniMart-9/` or `C:/xampp/htdocs/MiniMart-9/`).
2. Start Apache and MySQL services in WAMP/XAMPP.
3. Import the database schema from `src/main/minimart/gameDatabase/minimartDatabase.sql` into MySQL (via phpMyAdmin or MySQL CLI).
4. Verify database credentials in `src/main/minimart/gameBackend/databaseConfig.php` (default: host `localhost`, db `minimart_db`, user `root`, no password).
5. Open your browser and navigate to:
   ```text
   http://localhost/MiniMart-9/
   ```




