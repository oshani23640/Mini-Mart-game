// Difficulty screen controller

"use strict";

const VALID_DIFFICULTIES = ["easy", "medium", "difficult"];

function selectDifficulty(level) {
    if (!VALID_DIFFICULTIES.includes(level)) return;
    // Pass the selected level to the game screen
    window.location.href = "supermarketGame.php?difficulty=" + encodeURIComponent(level);
}

// Return to the main menu without starting a game
function goBack() {
    window.location.href = "mainMenu.php";
}
