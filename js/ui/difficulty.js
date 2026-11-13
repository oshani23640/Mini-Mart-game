// Difficulty Selection Controller
// High Cohesion: Manages difficulty screen options and redirects to the game.

"use strict";

const VALID_DIFFICULTIES = ["easy", "medium", "difficult"];

function selectDifficulty(level) {
    if (!VALID_DIFFICULTIES.includes(level)) return;
    window.location.href = "game.php?difficulty=" + encodeURIComponent(level);
}

function goBack() {
    window.location.href = "menu.php";
}
