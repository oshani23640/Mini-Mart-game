
// Score History Management

// Load saved scores from localStorage
function loadScores() {

    const rawScores = localStorage.getItem("miniMartScores");
    const scores = rawScores ? JSON.parse(rawScores) : [];

    const tbody = document.getElementById("scoresBody");
    const table = document.getElementById("scoresTable");
    const emptyMsg = document.getElementById("emptyMessage");

    // Display a message when no scores are available
    if (scores.length === 0) {
        table.style.display = "none";
        emptyMsg.style.display = "block";
        return;
    }

    table.style.display = "table";
    emptyMsg.style.display = "none";
    tbody.innerHTML = "";

    // Sort scores from highest to lowest
    scores.sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0));

    // Display each player's score
    scores.forEach((entry, idx) => {

        const tr = document.createElement("tr");

        let rankBadge = `#${idx + 1}`;

        if (idx === 0) rankBadge = "🥇 1st";
        else if (idx === 1) rankBadge = "🥈 2nd";
        else if (idx === 2) rankBadge = "🥉 3rd";

        const dateStr = entry.date
            ? new Date(entry.date).toLocaleDateString()
            : "-";

        tr.innerHTML = `
            <td style="font-weight: bold;">${rankBadge}</td>
            <td>${escapeHtml(entry.player || "Player")}</td>
            <td>${escapeHtml(entry.difficulty || "Normal")}</td>
            <td><span class="score-badge">${Number(entry.score) || 0} </span></td>
            <td style="font-size: 0.9em; opacity: 0.85;">${dateStr}</td>
        `;

        tbody.appendChild(tr);
    });
}


// Clear saved score history
function clearScores() {

    if (confirm("Are you sure you want to clear your score history?")) {

        localStorage.removeItem("miniMartScores");
        loadScores();

    }
}


// Escape player information before displaying it
function escapeHtml(value) {

    const div = document.createElement("div");
    div.textContent = value;

    return div.innerHTML;
}


// Load scores when the page opens
document.addEventListener("DOMContentLoaded", loadScores);
