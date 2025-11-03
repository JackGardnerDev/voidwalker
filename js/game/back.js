function goBackToIndex() {
    // Remember which section to show when we go back
    localStorage.setItem('targetPage', 'game');
    // Navigate back to index.html
    window.location.href = 'index.html';
}
