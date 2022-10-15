import express from 'express';
import cors from 'cors';
import pg from 'pg';
const { Pool } = pg;
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import joi from 'joi';
import dotenv from 'dotenv';
dotenv.config();

const connection = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const server = express();
server.use(cors());
server.use(express.json());

const signupSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().required()
})
const signinSchema = joi.object({
    email: joi.string().required(),
    password: joi.string().required()
})

server.post ('/signup', async (req, res) =>{
    const validation = signupSchema.validate(req.body);
   
    if(validation.error) return res.status(422).send(validation.error.message);
    const {name, email, password, confirmPassword} = req.body;
    
    if (password !== confirmPassword) return res.status(422).send("Os campos password e confirmPassord devem ser iguais.");
    const hashPassword = bcrypt.hashSync(password, 10);
    try {
        const emails = await connection.query (`SELECT * FROM users`);
        const temEmail = emails.rows.find(value => value.email === email)
        if (temEmail) return res.sendStatus(409);
        else {
            await connection.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3);", [name, email, hashPassword]); 
        }
    } catch (error) {
        res.sendStatus(error);
    }
    res.sendStatus(201);
})

server.post('/signin', async (req, res) => {
    const validation = signinSchema.validate(req.body);
    if (validation.error) return res.status(422).send(validation.error.message);
    const {email, password} = req.body;
    try {   
        const user = await connection.query ('SELECT * FROM users');
        const temUser = user.rows.find(value => value.email === email);
        const isValid = bcrypt.compareSync(password, temUser.password);
        if (!temUser || !isValid) return res.sendStatus(401);
        const token = uuid();
        await connection.query ('INSERT INTO sessions ("userId", token) VALUES ($1, $2);', [temUser.id, token]);
        res.status(200).send({token: token});

    } catch (error) {
    
        res.sendStatus(error);
    }

})

server.get('/status', (req, res) =>{
    res.send('ok');
})

const PORT = process.env.PORT || 4000
server.listen(PORT, () => console.log(`Listen on port ${PORT}`));