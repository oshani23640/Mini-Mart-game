// Difficulty screen controller.

"use strict";

const VALID_DIFFICULTIES = ["easy", "medium", "difficult"];

function selectDifficulty(level) {
    if (!VALID_DIFFICULTIES.includes(level)) return;
    window.location.href = "supermarketGame.php?difficulty=" + encodeURIComponent(level);
}

function goBack() {
    window.location.href = "mainMenu.php";
}
