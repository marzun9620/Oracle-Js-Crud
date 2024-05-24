// app.js

const express = require('express');
const oracledb = require('oracledb');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Configure Oracle Database connection
const dbConfig = {
  user: 'your_db_user',
  password: 'your_db_password',
  connectString: 'your_db_connection_string', // e.g., localhost:1521/xe
};

// Middleware
app.use(bodyParser.json());

// Routes
app.get('/items', async (req, res) => {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute('SELECT * FROM items');
    res.json(result.rows);
    await connection.close();
  } catch (error) {
    res.status(500).json({ error: 'Error fetching items' });
  }
});

app.post('/items', async (req, res) => {
  try {
    const { name, description } = req.body;
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute('INSERT INTO items (name, description) VALUES (:name, :description)', [name, description]);
    res.status(201).json({ message: 'Item created successfully' });
    await connection.close();
  } catch (error) {
    res.status(500).json({ error: 'Error creating item' });
  }
});

app.put('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute('UPDATE items SET name = :name, description = :description WHERE id = :id', [name, description, id]);
    res.json({ message: 'Item updated successfully' });
    await connection.close();
  } catch (error) {
    res.status(500).json({ error: 'Error updating item' });
  }
});

app.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute('DELETE FROM items WHERE id = :id', [id]);
    res.json({ message: 'Item deleted successfully' });
    await connection.close();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting item' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
