// Navigation system for single-page Voidwalker application

document.addEventListener('DOMContentLoaded', function() {
    // Check if we’re returning from another page
    const targetPage = localStorage.getItem('targetPage');
    
    if (targetPage) {
        // Show the saved target page
        showPage(targetPage);
        localStorage.removeItem('targetPage'); // clear it for next time
    } else {
        // Default behavior (show loading then main after 1 second)
        setTimeout(function() {
            showPage('main');
        }, 1000);
    }
});

/**
 * Main navigation function - shows specified page and hides all others
 * @param {string} pageName - The name of the page to show (e.g., 'main', 'play', 'profile')
 */
function showPage(pageName) {
    // Get all page containers
    const pages = document.querySelectorAll('.page-container');
    
    // Hide all pages
    pages.forEach(page => {
        page.classList.add('hidden');
    });
    
    // Show the requested page
    const targetPage = document.getElementById('page-' + pageName);
    if (targetPage) {
        targetPage.classList.remove('hidden');
    }
    
    // Optional: Scroll to top when changing pages
    window.scrollTo(0, 0);
}

/**
 * Toggle visibility of an element by ID
 * @param {string} elementId - The ID of the element to toggle
 */
function toggleElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.toggle('hidden');
    }
}

/**
 * Show an element by ID
 * @param {string} elementId - The ID of the element to show
 */
function showElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('hidden');
    }
}

/**
 * Hide an element by ID
 * @param {string} elementId - The ID of the element to hide
 */
function hideElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('hidden');
    }
}

/**
 * Close popup (for voidwalkers page)
 */
function closePopup() {
    const popup = document.getElementById('character-popup');
    if (popup) {
        popup.classList.add('hidden');
    }
}

// Prevent default link behavior for navigation links
document.addEventListener('click', function(e) {
    const target = e.target.closest('a[href="#"]');
    if (target && target.hasAttribute('onclick')) {
        e.preventDefault();
    }
});