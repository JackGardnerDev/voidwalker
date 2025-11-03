document.addEventListener('DOMContentLoaded', () => {
  const addFriendBtn = document.getElementById('add-friend');
  const inputWrapper = document.getElementById('friend-input-wrapper');
  const submitBtn = document.getElementById('submit-friend');
  const inputField = document.getElementById('friend-name');

  // Locate the "Friends" box
  const friendsBox = [...document.querySelectorAll('.info-box')].find(box =>
    box.querySelector('.box-title')?.textContent === 'Friends'
  );

  // Load stored friends
  function loadFriends() {
    const friends = JSON.parse(localStorage.getItem('friendsList')) || [];
    friends.forEach(name => addFriendEntry(name));
  }

  // Save friend list to localStorage
  function saveFriends() {
    const currentNames = [...friendsBox.querySelectorAll('.bar-text')].map(span => span.textContent);
    localStorage.setItem('friendsList', JSON.stringify(currentNames));
  }

  // Add a new friend entry to DOM
  function addFriendEntry(name) {
    const entry = document.createElement('div');
    entry.className = 'bar-entry';
    entry.innerHTML = `
      <div class="bar-fill-container">
        <div class="bar-fill green" style="width: 100%;">
          <span class="bar-text">${name}</span>
          <button class="remove-friend" title="Remove ${name} as a Friend">&times;</button>
        </div>
      </div>
    `;
    friendsBox.appendChild(entry);

    // Attach delete event
    entry.querySelector('.remove-friend').addEventListener('click', () => {
      entry.remove();
      saveFriends();
    });
  }

  // Show input field on "Add Friend" click
  addFriendBtn.addEventListener('click', () => {
    inputWrapper.style.display = 'block';
    inputField.focus();
  });

  // Submit on Enter
  inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      submitBtn.click();
    }
  });

  // Add friend
  submitBtn.addEventListener('click', () => {
    const name = inputField.value.trim();
    if (name && ![...friendsBox.querySelectorAll('.bar-text')].some(span => span.textContent === name)) {
      addFriendEntry(name);
      saveFriends();
      inputField.value = '';
      inputWrapper.style.display = 'none';
    }
  });

  loadFriends();
});