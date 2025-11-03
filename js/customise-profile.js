// document.addEventListener("DOMContentLoaded", () => {
//   const nameInput = document.getElementById("nameInput");
//   const profilePreview = document.getElementById("profilePreview");
//   let selectedImage = localStorage.getItem("profilePicture") || "imgs/favicon.png";

//   // Load saved data
//   nameInput.value = localStorage.getItem("playerName") || "";
//   profilePreview.src = selectedImage;

//   // Set selected highlight on load
//   const images = document.querySelectorAll(".selectable-img");
//   images.forEach(img => {
//     if (img.dataset.img === selectedImage) {
//       img.classList.add("selected");
//     }

//     img.addEventListener("click", () => {
//       selectedImage = img.dataset.img;
//       profilePreview.src = selectedImage;

//       // Update selected style
//       images.forEach(i => i.classList.remove("selected"));
//       img.classList.add("selected");
//     });
//   });

//   // Save changes
//   document.getElementById("customiseForm").addEventListener("submit", (e) => {
//     e.preventDefault();
//     localStorage.setItem("playerName", nameInput.value.trim());
//     localStorage.setItem("profilePicture", selectedImage);
//     location.reload();
//   });
// });



document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("nameInput");
  const profilePreview = document.getElementById("profilePreview");
  let selectedImage = localStorage.getItem("profilePicture") || "imgs/favicon.png";

  // Load saved data
  nameInput.value = localStorage.getItem("playerName") || "";
  profilePreview.src = selectedImage;

  // Set selected highlight on load
  const images = document.querySelectorAll(".selectable-img");
  images.forEach(img => {
    if (img.dataset.img === selectedImage) {
      img.classList.add("selected");
    }

    img.addEventListener("click", () => {
      selectedImage = img.dataset.img;
      profilePreview.src = selectedImage;

      // Update selected style
      images.forEach(i => i.classList.remove("selected"));
      img.classList.add("selected");
    });
  });

  // Save changes
  document.getElementById("customiseForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const newName = nameInput.value.trim();
    if (newName) {
      localStorage.setItem("playerName", newName);
    }
    localStorage.setItem("profilePicture", selectedImage);
    location.reload();
  });
});