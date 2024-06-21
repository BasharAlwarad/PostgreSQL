import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const client = new Client({
  host: PGHOST,
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: { rejectUnauthorized: false },
  application_name: `project=${ENDPOINT_ID}`,
});

client.connect()
  .then(() => console.log('Connected to the database'))
  .catch(err => console.error('Connection error', err.stack));

async function getPgVersion() {
  try {
    const res = await client.query('SELECT version()');
    console.log(res.rows[0]);
  } catch (err) {
    console.error('Error executing query', err.stack);
  }
}

getPgVersion();

export default client;
