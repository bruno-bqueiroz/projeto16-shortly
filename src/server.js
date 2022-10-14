import express from 'express';
import cors from 'cors';
import pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv';
dotenv.config();

const connection = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const server = express();
server.use(cors());
server.use(express.json());

server.get('/status', (req, res) =>{
    res.send('ok');
})

const PORT = process.env.PORT || 4000
server.listen(PORT, () => console.log(`Listen on port ${PORT}`));