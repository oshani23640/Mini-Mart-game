## Project Structure

```
MiniMart/
├── index.php
├── README.md
├── .editorconfig
├── .prettierrc
├── gameBackend/
│   ├── gameApi.php
│   ├── databaseConfig.php
│   └── sessionManager.php
├── gameStyles/
│   ├── authenticationStyles.css
│   ├── globalStyles.css
│   ├── difficultyStyles.css
│   ├── gameplayStyles.css
│   ├── instructionsStyles.css
│   ├── menuStyles.css
│   └── scoreStyles.css
├── gameData/
│   ├── difficultyLevels.json
│   └── storeProducts.json
├── gameDatabase/
│   └── minimartDatabase.sql
├── gameAssets/
│   ├── authHeroBanner.jpg
│   ├── gameplayBackground.jpg
│   └── menuBackground.jpg
├── gameScripts/
│   ├── playerAuthentication/
│   │   ├── playerLogin.js
│   │   └── playerSignup.js
│   ├── domainModels/
│   │   ├── customerModel.js
│   │   ├── gameStateModel.js
│   │   ├── playerModel.js
│   │   └── productModel.js
│   ├── eventSystem/
│   │   └── gameEventBus.js
│   ├── gameplayLogic/
│   │   ├── customerOrderManager.js
│   │   ├── gameplayCoordinator.js
│   │   ├── playerInputHandler.js
│   │   ├── productCollectionManager.js
│   │   └── gameplayTimer.js
│   ├── gameRendering/
│   │   └── supermarketCanvasRenderer.js
│   ├── networkServices/
│   │   ├── fishPuzzleApiClient.js
│   │   ├── puzzleChallengeService.js
│   │   └── scoreDataService.js
│   └── userInterface/
│       ├── difficultySelectionController.js
│       ├── gameplayUiController.js
│       ├── mainMenuController.js
│       └── scoreLeaderboardController.js
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


