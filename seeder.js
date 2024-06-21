import express from 'express'
import sql from './DB/db.js'

const users = [
    { first_name: 'John', last_name: 'Doe', age: 30 },
    { first_name: 'Jane', last_name: 'Smith', age: 25 },
    { first_name: 'Jim', last_name: 'Beam', age: 40 },
    { first_name: 'Jill', last_name: 'Valentine', age: 28 },
    { first_name: 'Jack', last_name: 'Sparrow', age: 35 },
];

const app = express();
app.use(express.json());

// Seeder route for creating dummy data
app.post('/api/v1/seeder', async (req, res) => {

  try {
    const results = [];
    for (const user of users) {
      const result = await sql`
      insert into users (first_name, last_name, age) 
      values (${user.first_name}, ${user.last_name}, ${user.age}) 
      returning *;
      `;
      results.push(result[0]);
    }
    res.status(201).json({ message: 'Seeding completed successfully', users: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(8000, () => {
  console.log(`Server is running on port 8000`);
});
