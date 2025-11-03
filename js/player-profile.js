// // Player will be able to select a username & profile picture using local host data on 'Profile' page.

// document.addEventListener("DOMContentLoaded", () => {
//   const playerName = localStorage.getItem("playerName") || "Starkiller";
//   const profilePicture = localStorage.getItem("profilePicture") || "imgs/favicon.png";

//   document.getElementById("playerName").innerHTML = `<strong>${playerName}</strong>`;
//   document.getElementById("profilePicture").src = profilePicture;
// });






// Player will be able to select a username & profile picture using local host data on 'Profile' page.

document.addEventListener("DOMContentLoaded", () => {
  const playerName = localStorage.getItem("playerName") || "Starkiller";
  const profilePicture = localStorage.getItem("profilePicture") || "imgs/favicon.png";

  // Update all instances of player name on the page
  const playerNameElements = document.querySelectorAll("#playerName");
  playerNameElements.forEach(element => {
    element.innerHTML = `<strong>${playerName}</strong>`;
  });

  // Update all instances of profile picture on the page
  const profilePictureElements = document.querySelectorAll("#profilePicture");
  profilePictureElements.forEach(element => {
    element.src = profilePicture;
  });
});