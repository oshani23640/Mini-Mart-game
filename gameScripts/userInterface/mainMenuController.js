// Main menu dashboard controller.

"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const playerNameElement = document.getElementById("player-name");
    if (playerNameElement) {
        playerNameElement.textContent = window.MINIMART_USERNAME || "Player";
    }
});

function startGame() {
    window.location.href = "selectDifficulty.php";
}

function viewScores() {
    window.location.href = "scoreLeaderboard.php";
}

function showInstructions() {
    window.location.href = "gameInstructions.php";
}

async function logout() {
    if (!confirm("Are you sure you want to log out?")) return;
    try {
        await fetch("../gameBackend/gameApi.php?action=logout", {
            method: "POST",
            credentials: "same-origin"
        });
    } finally {
        window.location.replace("playerLogin.php");
    }
}
