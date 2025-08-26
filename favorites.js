let favorites = [];
let lastVisit = null;

function loadData() {
    // Load favorites from storage
    const storedFavorites = localStorage.getItem('malaysianFoodFavorites');
    if (storedFavorites) {
        favorites = JSON.parse(storedFavorites);
    }

    // Load last visit from storage
    const storedLastVisit = localStorage.getItem('lastVisitedFood');
    if (storedLastVisit) {
        lastVisit = JSON.parse(storedLastVisit);
    }
}

function saveData() {
    localStorage.setItem('malaysianFoodFavorites', JSON.stringify(favorites));
}

function displayFavorites() {
    const lastVisitDiv = document.getElementById('lastVisitSection');
    const favoritesDiv = document.getElementById('favoritesList');
    const totalFavoritesEl = document.getElementById('totalFavorites');

    // Update stats
    totalFavoritesEl.textContent = favorites.length;

    // Display last visit info
    if (lastVisit) {
        lastVisitDiv.innerHTML = `
          <div class="last-visit-card">
            <h3>🕒 Last Visited Food</h3>
            <h4><strong>${lastVisit.food}</strong></h4>
            <p>Visited on: ${lastVisit.date}</p>
          </div>
        `;
    } else {
        lastVisitDiv.innerHTML = `
          <div class="last-visit-card">
            <h4>No foods visited yet</h4>
            <p>Visit <a href="food.html" style="color: white; text-decoration: underline;">Food Details</a> or <a href="malaysia.html" style="color: white; text-decoration: underline;"> Malaysian Food</a> and click on any food to get started! 🍽️</p>
          </div>
        `;
    }

    // Display favorites list
    if (favorites.length === 0) {
        favoritesDiv.innerHTML = `
          <div class="no-favorites">
            <span class="emoji">🍜</span>
            <h3>No favourite foods yet!</h3>
            <p>Visit the <a href="food.html" style="color: #5a5a42; text-decoration: none; font-weight: bold;">Food Details</a> or <a href="malaysia.html" style="color: #5a5a42; text-decoration: none; font-weight: bold;">Malaysian Food</a> and click "Add to Favourites" on your favourite Malaysian street foods to add them here.</p>
          </div>
        `;
    } else {
        const favoritesHTML = favorites.map((fav, index) => `
          <div class="favorite-item">
            <div class="favorite-info">
              <h5>${fav.name}</h5>
              <div class="favorite-date">Added: ${fav.addedDate}</div>
            </div>
            <button class="btn btn-danger-custom" onclick="deleteFavorite(${index})">🗑️ Delete</button>
          </div>
    `).join('');
        
    favoritesDiv.innerHTML = favoritesHTML;
    }
}

function deleteFavorite(index) {
    const foodName = favorites[index].name;
    if (confirm(`Are you sure you want to remove "${foodName}" from your favourites?`)) {
        favorites.splice(index, 1);
        saveData();
        displayFavorites();
        
        // Show success message using Bootstrap alert
        showAlert(`${foodName} has been removed from your favourites!`, 'success');
    }
}

function clearFavorites() {
    if (confirm('Are you sure you want to clear all your favourites?')) {
        favorites = [];
        lastVisit = null;
        localStorage.removeItem('malaysianFoodFavorites');
        localStorage.removeItem('lastVisitedFood');
        displayFavorites();
        showAlert('All favourites have been cleared!', 'success');
    }
}

function showAlert(message, type) {
    // Create Bootstrap alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
      
    // Auto remove after 3 seconds
    setTimeout(() => {
    if (alertDiv.parentNode) {
        alertDiv.remove();
    }
    }, 3000);
}

// Initialize the page
function init() {
    loadData();
    displayFavorites();
}

if (typeof Storage === "undefined") {
    // Fallback for environments without localStorage
    window.localStorage = {
        data: {},
        getItem: function(key) { return this.data[key] || null; },
        setItem: function(key, value) { this.data[key] = value; },
        removeItem: function(key) { delete this.data[key]; }
    };
}

// Load data when page loads
$(document).ready(function() {
    init();
      
    // Refresh data when page becomes visible (in case user added favorites in another tab)
    document.addEventListener('visibilitychange', function() {
     if (!document.hidden) {
          loadData();
          displayFavorites();
    }
    });
});