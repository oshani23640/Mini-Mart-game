
// MINI MART - MENU PAGE

// Run when the menu page loads
document.addEventListener("DOMContentLoaded", function () {

    // Check whether the player is logged in
    const isLoggedIn = localStorage.getItem("miniMartLoggedIn");

    // Redirect to login if the player is not logged in
    if (isLoggedIn !== "true") {
        window.location.replace("login.html");
        return;
    }

    // Get the logged-in player's username
    const savedName = localStorage.getItem("playerName");

    // Find the username element in menu.html
    const playerNameElement = document.getElementById("player-name");

    // Display the player's username
    if (playerNameElement) {
        playerNameElement.textContent = savedName || "Player";
    }

});

// START GAME

function startGame() {

    // Open the difficulty selection page
    window.location.href = "difficulty.html";

}

// SCORE HISTORY

function viewScores() {

    // Open the score history page
    window.location.href = "score.html";

}

// HOW TO PLAY

function showInstructions() {

    // Open the instructions page
    window.location.href = "instructions.html";

}

// LOGOUT

function logout() {

    // Ask the player to confirm logout
    const confirmed = confirm("Are you sure you want to log out?");

    if (confirmed) {

        // Remove login status
        localStorage.removeItem("miniMartLoggedIn");

        // Remove the current player's username
        localStorage.removeItem("playerName");
        sessionStorage.removeItem("playerName");

        // Redirect to login page
        window.location.replace("login.html");

    }

}