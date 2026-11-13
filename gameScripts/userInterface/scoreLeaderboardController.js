// Leaderboard table controller

"use strict";

async function loadScores() {
    const tbody = document.getElementById("scoresBody");
    const table = document.getElementById("scoresTable");
    const emptyMsg = document.getElementById("emptyMessage");

    // Fetch scores, render ranked rows, or show an empty/error state
    try {
        const scores = await ScoreDataService.getScores();

        if (!scores.length) {
            table.style.display = "none";
            emptyMsg.hidden = false;
            emptyMsg.style.display = "block";
            return;
        }

        table.style.display = "table";
        emptyMsg.hidden = true;
        emptyMsg.style.display = "none";
        tbody.innerHTML = "";

        scores.forEach((entry, idx) => {
            const tr = document.createElement("tr");
            let rank = "#" + (idx + 1);
            if (idx === 0) rank = "1st";
            else if (idx === 1) rank = "2nd";
            else if (idx === 2) rank = "3rd";

            const date = entry.created_at
                ? new Date(entry.created_at.replace(" ", "T")).toLocaleDateString()
                : "-";

            [
                rank,
                entry.username || window.MINIMART_USERNAME || "Player",
                entry.difficulty || "Normal",
                Number(entry.score) || 0,
                date
            ].forEach((value, i) => {
                const td = document.createElement("td");
                td.textContent = value;
                if (i === 0) td.style.fontWeight = "bold";
                if (i === 3) {
                    td.innerHTML = '<span class="score-badge">' + (Number(value) || 0) + "</span>";
                }
                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });
    } catch (error) {
        emptyMsg.textContent = "Unable to load scores. Please check the server connection.";
        emptyMsg.hidden = false;
        emptyMsg.style.display = "block";
    }
}

async function clearScores() {
    if (!confirm("Are you sure you want to clear your score history?")) return;
    // Clear the stored scores and reload the table to reflect the result
    try {
        await ScoreDataService.clearScores();
        await loadScores();
    } catch (error) {
        alert(error.message || "Unable to clear score history.");
    }
}

document.addEventListener("DOMContentLoaded", loadScores);
