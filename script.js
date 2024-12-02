function handleAddTodo() {
  const data = {
    title: document.querySelector('#title').value,
    description: document.querySelector('#description').value
  }; 

  fetch("http://localhost:3001/todos", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json' // Specify that the content is in JSON format
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse the JSON response
  })
  .then(data => {
    console.log('Success:', data); // Handle the successful response
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error); // Handle any errors
  });
}

function handleDeleteTodo(id) {
  fetch(`http://localhost:3001/todos/${id}`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json' // Specify that the content is in JSON format (optional for DELETE)
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse the JSON response, if necessary
  })
  .then(data => {
    console.log('Success:', data); // Handle the successful response
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error); // Handle any errors
  });
}

function handleEditTodo(id) {
  const data = {
    title: document.querySelector('#title').value,
    description: document.querySelector('#description').value
  };

  fetch(`http://localhost:3001/todos/${id}`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json' // Specify that the content is in JSON format
    },
    body: JSON.stringify(data) // Send the updated data as the request body
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse the JSON response
  })
  .then(data => {
    console.log('Success:', data); // Handle the successful response
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error); // Handle any errors
  });
}
// Function to get and display todos from the backend
function handleGetTodos() {
  fetch("http://localhost:3001/")
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // Parse the JSON response
    })
    .then(todos => {
      const todoContainer = document.querySelector('.todo_items');
      todoContainer.innerHTML = ''; // Clear existing content before adding new todos

      // Loop through the todos array and create HTML elements for each todo
      todos.forEach(todo => {
        const todoElement = document.createElement('div');
        todoElement.classList.add('todo_item');

        todoElement.innerHTML = `
          <h2>${todo.id}</h2>
          <h2>${todo.title}</h2>
          <p>${todo.description}</p>
          <button onclick="handleDeleteTodo(${todo.id})">Delete</button>
          <button onclick="handleEditTodo(${todo.id})">Edit</button>
        `;

        todoContainer.appendChild(todoElement);
      });
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}

// Call handleGetTodos on page load to display existing todos
document.addEventListener('DOMContentLoaded', handleGetTodos);
