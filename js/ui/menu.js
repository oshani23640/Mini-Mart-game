// Menu Controller
// High Cohesion: Manages dashboard interactions and navigation.

"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const playerNameElement = document.getElementById("player-name");
    if (playerNameElement) {
        playerNameElement.textContent = window.MINIMART_USERNAME || "Player";
    }
});

function startGame() {
    window.location.href = "difficulty.php";
}

function viewScores() {
    window.location.href = "score.php";
}

function showInstructions() {
    window.location.href = "instructions.php";
}

async function logout() {
    if (!confirm("Are you sure you want to log out?")) return;
    try {
        await fetch("../backend/api.php?action=logout", {
            method: "POST",
            credentials: "same-origin"
        });
    } finally {
        window.location.replace("login.php");
    }
}
