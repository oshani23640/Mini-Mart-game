// Main menu dashboard controller

"use strict";

document.addEventListener("DOMContentLoaded", function () {
    // Show the signed-in player's name on the menu
    const playerNameElement = document.getElementById("player-name");
    if (playerNameElement) {
        playerNameElement.textContent = window.MINIMART_USERNAME || "Player";
    }
});

function startGame() {
    // Begin a new game by choosing its difficulty
    window.location.href = "selectDifficulty.php";
}

// Navigate to the selected menu section
function viewScores() {
    window.location.href = "scoreLeaderboard.php";
}

function showInstructions() {
    window.location.href = "gameInstructions.php";
}

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
