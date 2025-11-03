// Top Right Profile & Player Stats

const credits = 100;
const creditsElements = document.querySelectorAll("#credits");
creditsElements.forEach(element => {
    element.innerHTML = `Credits: <strong>${credits}</strong>`;
});

const elo = 4000;
const eloElements = document.querySelectorAll("#elo");
eloElements.forEach(element => {
    element.innerHTML = `Elo: <strong>${elo}</strong>`;
});

// Player Stats

const rank = "imgs/rank-icons/5-voidwalker.png";
const rankElements = document.querySelectorAll("#rank");
rankElements.forEach(element => {
    element.innerHTML = `Rank: <span class="rank-icon"><img src="${rank}" alt="Rank"></span>`;
});

const border = "imgs/border-icons/1-initiate.png";
const borderElements = document.querySelectorAll("#border");
borderElements.forEach(element => {
    element.innerHTML = `Border: <span class="border-icon"><img src="${border}" alt="Border"></span>`;
});