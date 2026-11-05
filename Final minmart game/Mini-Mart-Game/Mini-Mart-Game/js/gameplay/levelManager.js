// Saves the selected difficulty settings and opens the game page.


// Difficulty settings for each level.

const difficultySettings = {

    easy: {
        name: "Easy",
        time: 90,
        lives: 3,
        points: 10,
        customerSpeed: 1
    },

    medium: {
        name: "Medium",
        time: 75,
        lives: 3,
        points: 15,
        customerSpeed: 1.5
    },

    difficult: {
        name: "Difficult",
        time: 60,
        lives: 3,
        points: 20,
        customerSpeed: 2
    }

};


// Save the selected difficulty and open the game page.

function selectDifficulty(level) {

    const settings = difficultySettings[level];

    if (!settings) {

        alert("Please select a valid difficulty level.");

        return;
    }

    // Save the selected difficulty.
    localStorage.setItem("selectedDifficulty", level);

    // Save the settings for the game page.
    localStorage.setItem(
        "difficultySettings",
        JSON.stringify(settings)
    );

    // Navigate to the game page.
    window.location.href = "game.html";

}


// Return to the main menu.

function goBack() {

    window.location.href = "menu.html";

}