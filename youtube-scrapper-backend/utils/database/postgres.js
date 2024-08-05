import { Pool } from 'pg';

const pool = new Pool({
  user: 'sammy',
  host: 'localhost',
  database: "sammy", // replace with your database name
  password: '1234',
  port: 5432, // default PostgreSQL port
});

pool.connect((err) => {
  if (err) {
    console.error('Error connecting to the database', err.stack);
  } else {
    console.log('Connected to the database');
  }
});

export default pool;
