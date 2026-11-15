// Main menu dashboard controller

"use strict";

// Display the player's name when the page loads
document.addEventListener("DOMContentLoaded", function () {

    // Get the player name element from the page
    const playerNameElement = document.getElementById("player-name");

    if (playerNameElement) {
        playerNameElement.textContent = window.MINIMART_USERNAME || "Player";
    }
});

// Start a new game
function startGame() {

    // Go to the difficulty selection page
    window.location.href = "selectDifficulty.php";
}

// View the leaderboard
function viewScores() {
    window.location.href = "scoreLeaderboard.php";
}

// View the game instructions
function showInstructions() {
    window.location.href = "gameInstructions.php";
}

// Log out from the game
async function logout() {

    if (!confirm("Are you sure you want to log out?")) return;

    // End the server session, then return to the login screen
    try {
        await fetch("../gameBackend/gameApi.php?action=logout", {
            method: "POST",
            credentials: "same-origin"
        });

    } finally {
        window.location.replace("playerLogin.php");
    }
}