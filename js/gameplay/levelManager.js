// Opens the game page for the chosen difficulty.
// game.php checks the difficulty against data/levels.json.

const VALID_DIFFICULTIES = ["easy", "medium", "difficult"];

function selectDifficulty(level) {
    if (!VALID_DIFFICULTIES.includes(level)) return;
    window.location.href = `game.php?difficulty=${encodeURIComponent(level)}`;
}

// Returns to the main menu.
function goBack() {
    window.location.href = "menu.php";
}
