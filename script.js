// Select form and list
const achievementForm = document.getElementById('achievement-form');
const achievementList = document.getElementById('achievement-list');

// Handle form submission
achievementForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent page reload

  // Get input values
  const title = document.getElementById('title').value;
  const date = document.getElementById('date').value;
  const category = document.getElementById('category').value;

  // Create a new list item
  const listItem = document.createElement('li');
  listItem.innerHTML = `
    <span><strong>${title}</strong> (${category}) - ${date}</span>
    <div>
      <button class="edit">Edit</button>
      <button class="delete">Delete</button>
    </div>
  `;

  // Add the list item to the list
  achievementList.appendChild(listItem);

  // Clear the form
  achievementForm.reset();
});

// Handle edit and delete actions
achievementList.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete')) {
    e.target.closest('li').remove(); // Delete the achievement
  }

  if (e.target.classList.contains('edit')) {
    const listItem = e.target.closest('li');
    const [titleText, categoryText, dateText] = listItem
      .querySelector('span')
      .innerText.match(/(.*?) \((.*?)\) - (.*)/)
      .slice(1);

    // Populate the form with existing data
    document.getElementById('title').value = titleText;
    document.getElementById('date').value = dateText;
    document.getElementById('category').value = categoryText;

    // Remove the existing list item after editing
    listItem.remove();
  }
});
