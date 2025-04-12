// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  const achievementForm = document.getElementById('achievement-form');
  const achievementList = document.getElementById('achievement-list');
  const emptyState = document.getElementById('empty-state');
  const searchInput = document.getElementById('search-achievements');

  // Load achievements from localStorage
  loadAchievements();

  // Handle form submission
  achievementForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page reload

    // Get input values
    const title = document.getElementById('title').value.trim();
    const date = document.getElementById('date').value;
    const category = document.getElementById('category').value.trim();
    const description = document.getElementById('description')?.value.trim() || '';

    // Create a unique ID for the achievement
    const id = Date.now().toString();

    // Create achievement object
    const achievement = {
      id,
      title,
      date,
      category,
      description,
      createdAt: new Date().toISOString()
    };

    // Add achievement to the list
    addAchievementToList(achievement);

    // Save to localStorage
    saveAchievement(achievement);

    // Clear the form
    achievementForm.reset();

    // Scroll to achievements section
    document.getElementById('profile').scrollIntoView({ behavior: 'smooth' });

    // Show success message
    showNotification('Achievement added successfully!', 'success');
  });

  // Handle edit and delete actions
  achievementList.addEventListener('click', (e) => {
    const listItem = e.target.closest('li');
    if (!listItem) return;
    
    const achievementId = listItem.dataset.id;
    
    // Handle delete button click
    if (e.target.classList.contains('delete')) {
      // Confirm deletion
      if (confirm('Are you sure you want to delete this achievement?')) {
        deleteAchievement(achievementId);
        listItem.classList.add('fade-out');
        
        // Remove after animation completes
        setTimeout(() => {
          listItem.remove();
          updateEmptyState();
          showNotification('Achievement deleted!', 'info');
        }, 300);
      }
    }

    // Handle edit button click
    if (e.target.classList.contains('edit')) {
      const achievements = getAchievements();
      const achievement = achievements.find(a => a.id === achievementId);
      
      if (achievement) {
        // Populate the form with existing data
        document.getElementById('title').value = achievement.title;
        document.getElementById('date').value = achievement.date;
        document.getElementById('category').value = achievement.category;
        
        if (document.getElementById('description')) {
          document.getElementById('description').value = achievement.description || '';
        }
        
        // Scroll to form
        document.getElementById('add').scrollIntoView({ behavior: 'smooth' });
        
        // Delete the old achievement
        deleteAchievement(achievementId);
        listItem.remove();
        updateEmptyState();
      }
    }
  });

  // Search functionality
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const achievements = getAchievements();
    
    // Clear the list
    achievementList.innerHTML = '';
    
    // Filter and display achievements
    const filteredAchievements = achievements.filter(achievement => 
      achievement.title.toLowerCase().includes(searchTerm) || 
      achievement.category.toLowerCase().includes(searchTerm) ||
      achievement.description?.toLowerCase().includes(searchTerm)
    );
    
    // Add filtered achievements to the list
    filteredAchievements.forEach(achievement => {
      addAchievementToList(achievement);
    });
    
    // Show empty state if no results
    if (filteredAchievements.length === 0) {
      if (searchTerm) {
        emptyState.innerHTML = `
          <i class="fas fa-search fa-3x"></i>
          <p>No achievements match "${searchTerm}"</p>
        `;
      }
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
    }
  });

  // Helper Functions
  function addAchievementToList(achievement) {
    const { id, title, date, category, description } = achievement;
    
    // Format the date for display
    const formattedDate = formatDate(date);
    
    // Create a new list item
    const listItem = document.createElement('li');
    listItem.dataset.id = id;
    listItem.className = 'fade-in';
    
    // Create HTML structure
    listItem.innerHTML = `
      <div class="achievement-info">
        <div class="achievement-title">${title}</div>
        <div class="achievement-meta">
          <span><i class="fas fa-calendar-alt"></i> ${formattedDate}</span>
          <span class="category-badge">${category}</span>
        </div>
        ${description ? `<div class="achievement-description">${description}</div>` : ''}
      </div>
      <div class="achievement-actions">
        <button class="edit"><i class="fas fa-edit"></i></button>
        <button class="delete"><i class="fas fa-trash-alt"></i></button>
      </div>
    `;
    
    // Add the list item to the list
    achievementList.appendChild(listItem);
    
    // Hide empty state if there are achievements
    updateEmptyState();
  }

  function saveAchievement(achievement) {
    const achievements = getAchievements();
    achievements.push(achievement);
    localStorage.setItem('achievements', JSON.stringify(achievements));
  }

  function getAchievements() {
    return JSON.parse(localStorage.getItem('achievements') || '[]');
  }

  function deleteAchievement(id) {
    let achievements = getAchievements();
    achievements = achievements.filter(achievement => achievement.id !== id);
    localStorage.setItem('achievements', JSON.stringify(achievements));
  }

  function loadAchievements() {
    const achievements = getAchievements();
    
    // Sort by date (newest first)
    achievements.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Add each achievement to the list
    achievements.forEach(achievement => {
      addAchievementToList(achievement);
    });
    
    // Show/hide empty state
    updateEmptyState();
  }

  function updateEmptyState() {
    if (achievementList.children.length === 0) {
      emptyState.innerHTML = `
        <i class="fas fa-award fa-3x"></i>
        <p>No achievements yet. Add your first one!</p>
      `;
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
    }
  }

  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
      </div>
    `;
    
    // Add to the DOM
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
});
