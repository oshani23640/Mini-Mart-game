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
MiniMart/
├── README.md
├── .editorconfig
├── .prettierrc
└── src/
    └── main/
        ├── asset/
        │   └── gameAssets/
        │       ├── authHeroBanner.jpg
        │       ├── gameplayBackground.jpg
        │       └── menuBackground.jpg
        └── minimart/
            ├── gameBackend/
            │   ├── databaseConfig.php
            │   ├── gameApi.php
            │   └── sessionManager.php
            ├── gameDatabase/
            │   └── minimartDatabase.sql
            ├── gameData/
            │   ├── difficultyLevels.json
            │   └── storeProducts.json
            ├── gameScripts/
            │   ├── domainModels/
            │   │   ├── customerModel.js
            │   │   ├── gameStateModel.js
            │   │   ├── playerModel.js
            │   │   └── productModel.js
            │   ├── eventSystem/
            │   │   └── gameEventBus.js
            │   ├── gameRendering/
            │   │   └── supermarketCanvasRenderer.js
            │   ├── gameplayLogic/
            │   │   ├── customerOrderManager.js
            │   │   ├── gameplayCoordinator.js
            │   │   ├── gameplayTimer.js
            │   │   ├── playerInputHandler.js
            │   │   └── productCollectionManager.js
            │   ├── networkServices/
            │   │   ├── bonusPuzzleService.js
            │   │   ├── fishPuzzleApiClient.js
            │   │   ├── puzzleChallengeService.js
            │   │   ├── scoreDataService.js
            │   │   └── tomatoPuzzleApiClient.js
            │   ├── playerAuthentication/
            │   │   ├── playerLogin.js
            │   │   └── playerSignup.js
            │   └── userInterface/
            │       ├── difficultySelectionController.js
            │       ├── gameplayUiController.js
            │       ├── mainMenuController.js
            │       └── scoreLeaderboardController.js
            ├── gameStyles/
            │   ├── authenticationStyles.css
            │   ├── difficultyStyles.css
            │   ├── gameplayStyles.css
            │   ├── globalStyles.css
            │   ├── instructionsStyles.css
            │   ├── menuStyles.css
            │   └── scoreStyles.css
            └── gameViews/
                ├── authenticationGuard.php
                ├── gameInstructions.php
                ├── index.php
                ├── mainMenu.php
                ├── playerLogin.php
                ├── playerSignup.php
                ├── scoreLeaderboard.php
                ├── selectDifficulty.php
                └── supermarketGame.php
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





