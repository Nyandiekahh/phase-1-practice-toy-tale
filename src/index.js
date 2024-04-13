let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById('toy-collection');
  const toyForm = document.querySelector('.add-toy-form');

  // Fetch Andy's Toys
  fetchToys();

  function fetchToys() {
    fetch('http://localhost:3000/toys')
      .then(response => response.json())
      .then(toys => {
        toys.forEach(toy => renderToyCard(toy));
      })
      .catch(error => console.error('Error fetching toys:', error));
  }

  // Render Toy Card
  function renderToyCard(toy) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');

    cardDiv.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" data-id="${toy.id}">Like ❤️</button>
    `;

    toyCollection.appendChild(cardDiv);
  }

  // Add New Toy
  toyForm.addEventListener('submit', event => {
    event.preventDefault();

    const formData = new FormData(toyForm);
    const name = formData.get('name');
    const image = formData.get('image');

    const newToyData = {
      name,
      image,
      likes: 0
    };

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(newToyData)
    })
      .then(response => response.json())
      .then(newToy => {
        renderToyCard(newToy);
        toyForm.reset();
      })
      .catch(error => console.error('Error adding new toy:', error));
  });

  // Increase Toy Likes
  toyCollection.addEventListener('click', event => {
    if (event.target.classList.contains('like-btn')) {
      const toyId = event.target.dataset.id;
      const card = event.target.closest('.card');
      const likesElement = card.querySelector('p');
      const currentLikes = parseInt(likesElement.textContent);

      const updatedLikes = currentLikes + 1;

      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          likes: updatedLikes
        })
      })
        .then(response => response.json())
        .then(updatedToy => {
          likesElement.textContent = `${updatedToy.likes} Likes`;
        })
        .catch(error => console.error('Error updating toy likes:', error));
    }
  });

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});
