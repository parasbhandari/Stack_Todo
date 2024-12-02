const express = require('express');
const app = express();
const port = 3001;
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

// Use CORS to allow all origins by default

app.use(bodyParser.json());
app.use(cors());
app.get('/', (req, res) => {
  fs.readFile('todofile.json', 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send(`Error reading file: ${err}`);
    }
    try {
      const todos = JSON.parse(data);
      res.json(todos);
    } catch (parseErr) {
      res.status(500).send('Error parsing JSON data');
    }
  });
});

app.post('/todos', (req, res) => {
  fs.readFile('todofile.json', 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send(`Can't read the todo file: ${err}`);
    }

    let todos;
    try {
      todos = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).send('Error parsing JSON data');
    }

    const newData = {
      id: Math.floor(Math.random() * 1000),
      title: req.body.title,
      description: req.body.description
    };

    if (!newData.title || !newData.description) {
      return res.status(400).send('Todo data is required');
    }

    todos.push(newData);

    fs.writeFile('todofile.json', JSON.stringify(todos, null, 2), 'utf-8', (writeErr) => {
      if (writeErr) {
        return res.status(500).send(`Can't post new todo due to: ${writeErr}`);
      }
      res.send('Successfully posted new todo');
    });
  });
});

app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id); // Ensure the id is an integer
  const title = req.body.title;
  const description = req.body.description;

  fs.readFile('todofile.json', 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send(`Error reading file: ${err}`);
    }

    let todos;
    try {
      todos = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).send('Error parsing JSON data');
    }

    let todoFound = false;
    todos = todos.map(todo => {
      if (todo.id === id) {
        todoFound = true;
        return { ...todo, title, description };
      }
      return todo;
    });

    if (!todoFound) {
      return res.status(404).send('Todo item not found');
    }

    fs.writeFile('todofile.json', JSON.stringify(todos, null, 2), 'utf-8', (writeErr) => {
      if (writeErr) {
        return res.status(500).send(`Error writing to file: ${writeErr}`);
      }
      res.send('Todo item updated successfully');
    });
  });
});

app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id); // Ensure the id is an integer

  fs.readFile('todofile.json', 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send(`Error reading file: ${err}`);
    }

    let todos;
    try {
      todos = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).send('Error parsing JSON data');
    }

    // Remove the todo item with the matching id
    todos = todos.filter(todo => todo.id !== id);

    fs.writeFile('todofile.json', JSON.stringify(todos, null, 2), 'utf-8', (writeErr) => {
      if (writeErr) {
        return res.status(500).send(`Error writing to file: ${writeErr}`);
      }
      res.send('Item deleted successfully');
    });
  });
});

// Start the server and log confirmation
app.listen(port);

// Handle 404 errors for unmatched routes
app.use((req, res, next) => {
  res.status(404).send('Route not found');
});
