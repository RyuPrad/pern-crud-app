const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

// Middleware

app.use(cors());
app.use(express.json());

// Routes
// TODO: Add CRUD routes here

// ... (previous code)

// Create a todo
app.post('/todos', async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todos (title, description) VALUES($1, $2) RETURNING *",
      [title, description]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get all todos
app.get('/todos', async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todos");
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get a specific todo
app.get('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM todos WHERE id = $1", [id]);
    res.json(todo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Update a todo
app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    const updateTodo = await pool.query(
      "UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *",
      [completed, id]
    );
    res.json(updateTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Delete a todo
app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM todos WHERE id = $1", [id]);
    res.json("Todo was deleted");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ... (remaining code)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});