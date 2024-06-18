import express from 'express';
import sql from './DB/db.js';
import cors from 'cors';

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: "Hello world!" });
});

app.get('/api/v1/users', async (req, res) => {
  try {
    const users = await sql`select * from users`;
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/v1/orders', async (req, res) => {
  try {
    const users = await sql`select * from orders`;
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get route for reading one user
app.get('/api/v1/users/:user_id', async (req, res) => {
    const { user_id } = req.params;
    try {
        const user = await sql`select * from users where id = ${user_id}`;
        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get route for reading one order
app.get('/api/v1/orders/:order_id', async (req, res) => {
    const { order_id } = req.params;
    try {
      const order = await sql`select * from orders where id = ${order_id}`;
      if (order.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.status(200).json(order[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


// POST route for creating a new user
app.post('/api/v1/users', async (req, res) => {
  const { first_name, last_name,age } = req.body;
  if (!first_name || !last_name || !age) {
    return res.status(400).json({ error: 'Name and age are required' });
  }
  
  try {
    const result = await sql`
    insert into users (first_name, last_name, age) 
    values (${first_name}, ${last_name}, ${age}) 
    returning *;
    `;
    res.status(201).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// POST route for creating a new order
app.post('/api/v1/orders', async (req, res) => {
  const { user_id, price } = req.body;
  if (!user_id || !price) {
    return res.status(400).json({ error: 'User ID and price are required' });
  }

  const date = new Date().toISOString();

  try {
    const result = await sql`
      insert into orders (user_id, price, date) 
      values (${user_id}, ${price}, ${date}) 
      returning *;
    `;
    res.status(201).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// DELETE route for deleting a user
app.delete('/api/v1/users/:user_id', async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const result = await sql`
      delete from users 
      where id = ${user_id} 
      returning *;
    `;
    if (result.count === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully', user: result[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE route for deleting an order
app.delete('/api/v1/orders/:order_id', async (req, res) => {
  const { order_id } = req.params;
  if (!order_id) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  try {
    const result = await sql`
      delete from orders 
      where id = ${order_id} 
      returning *;
    `;
    if (result.count === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully', order: result[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// PUT route for updating an order
app.put('/api/v1/orders/:order_id', async (req, res) => {
  const { order_id } = req.params;
  const { user_id, price } = req.body;

  const date = new Date().toISOString();

  if (!user_id || !price) {
    return res.status(400).json({ error: 'User ID, price, and date are required' });
  }

  try {
    const result = await sql`
      update orders 
      set user_id = ${user_id}, price = ${price}, date = ${date} 
      where id = ${order_id} 
      returning *;
    `;
    if (result.count === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json({ message: 'Order updated successfully', order: result[0] });
  } catch (error) {
    res.status  .status(500).json({ error: error.message });
  }
});


// PUT route for updating a user
app.put('/api/v1/users/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { first_name, last_name, age } = req.body;
  if (!first_name || !last_name ||!age) {
    return res.status(400).json({ error: 'First_name, last_name, and age are required' });
  }

  try {
    const result = await sql`
      update users 
      set first_name = ${first_name}, last_name = ${last_name}, age = ${age} 
      where id = ${user_id} 
      returning *;
    `;
    if (result.count === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User updated successfully', user: result[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(8000, () => console.log("Server is running on port 8000"));
