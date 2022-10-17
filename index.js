import express from 'express';
import cors from 'cors';
import pg from 'pg';
const { Pool } = pg;
import { v4 as uuid } from 'uuid';
import { nanoid } from 'nanoid';
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

const isValidUrl = urlString=> {
    var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
  '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
return !!urlPattern.test(urlString);
}

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
        const user = await connection.query (`SELECT * FROM users`);
        const temUser = user.rows.find(value => value.email === email);
        const isValid = bcrypt.compareSync(password, temUser.password);
        if (!temUser || !isValid) return res.sendStatus(401);
        const token = uuid();
        await connection.query ('INSERT INTO sessions ("userId", token) VALUES ($1, $2);', [temUser.id, token]);
        res.status(200).send({token: token});
    } catch (error) {
        res.sendStatus(error);
    }
});

server.post ('/urls/shorten', async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    try {
        const haveSession = await connection.query(`SELECT * FROM sessions WHERE token = '${token}';`)
    if(!haveSession.rows[0]) return res.sendStatus(401);
        const {url} = req.body;

	if(!isValidUrl(url)) return res.status(422).send('O link não é uma url');
    
    const shortUrl = nanoid(10)
     await connection.query ('INSERT INTO urls ("userId", "shortUrl", url) VALUES ($1, $2, $3);', [haveSession.rows[0].userId, shortUrl, url]);

     const novaUrl = await connection.query(`SELECT id FROM urls WHERE "shortUrl" = '${shortUrl}'`)


     await connection.query ('INSERT INTO "visitCount" ("idUrl", "visitCount", "userId") VALUES ($1, $2, $3);', [novaUrl.rows[0].id, 0, haveSession.rows[0].userId]);

    res.status(201).send({
        shortUrl: shortUrl
    })

    } catch (error) {
        res.sendStatus(error);
    }
});

server.get('/urls/:id', async (req, res)=>{
    const id = req.params.id;
    
    try {
        const url = await connection.query(`SELECT id, "shortUrl", url FROM urls WHERE id = '${id}';`);
        console.log(url.rows[0]);
        if (!url.rows[0]) return res.sendStatus(404);
        res.status(200).send(url.rows);
    } catch (error) {
        res.sendStatus(error);
    } 
});

server.get('/urls/open/:shortUrl', async (req, res)=>{
    const shortUrl = req.params.shortUrl;
        
    try {
        const url = await connection.query(`SELECT * FROM urls WHERE "shortUrl" = '${shortUrl}';`);
        if(!url.rows[0]) return res.sendStatus(404)
        console.log(url.rows[0].url)
        
        const visitCount = await connection.query(`SELECT "visitCount" FROM "visitCount" WHERE "idUrl" = '${url.rows[0].id}';`);
        const updateVisitCount = visitCount.rows[0].visitCount + 1;

         await connection.query(`UPDATE "visitCount" SET "visitCount" = '${updateVisitCount}' WHERE "idUrl" = '${url.rows[0].id}';`)
         res.redirect(url.rows[0].url);
    } catch (error) {
        res.sendStatus(error);
    } 
});

server.delete('/urls/:id', async (req, res)=>{
    const token = req.headers.authorization?.replace('Bearer ', '');
    const id = req.params.id;

    try {
        const haveSession = await connection.query(`SELECT * FROM sessions WHERE token = '${token}';`);
        if(!haveSession.rows[0]) return res.sendStatus(401);
        
        const url = await connection.query(`SELECT * FROM urls WHERE id = '${id}'`);
        if (!url.rows[0]) return res.sendStatus(404);
        else if(url.rows[0].userId !== haveSession.rows[0].userId) return res.sendStatus(401);
        else {
            await connection.query(`DELETE FROM urls WHERE id = '${id}'`)
        }
    } catch (error) {
        res.sendStatus(error); 
    }
    res.sendStatus(204);
});

server.get('/users/me', async (req, res)=>{
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    try {
        const haveSession = await connection.query(`SELECT "userId" FROM sessions WHERE token = '${token}';`);
        if(!haveSession.rows[0]) return res.sendStatus(401);
        
        const name = await connection.query(`SELECT name FROM users WHERE id = '${haveSession.rows[0].userId}';`);
        
        const visitCount = await connection.query(`SELECT SUM ("visitCount") AS "visitCount" FROM "visitCount" WHERE "userId" = '${haveSession.rows[0].userId}';`);
        console.log(visitCount.rows[0].visitCount)

        const shortenedUrls = await connection.query(`SELECT 
        urls.id AS id, urls."shortUrl" AS "shortUrl", urls.url AS url,
        "visitCount"."visitCount" AS "visitCount" 
        FROM urls JOIN "visitCount"
        ON urls.id =  "visitCount"."idUrl" WHERE urls."userId" = '${haveSession.rows[0].userId}';`)

        res.status(200).send(
            {
            id: haveSession.rows[0].userId,
            name: name.rows[0].name,
            visitCount: visitCount.rows[0].visitCount,
            shortenedUrls: shortenedUrls.rows
            }
        );
    } catch (error) {
        res.sendStatus(error); 
    }
});

server.get('/ranking', async (req, res) =>{

    try {
        const ranking = await connection.query(`SELECT
		users.id AS id, users.name AS name, 
		COUNT (urls."shortUrl") AS "linksCount",
		SUM ("visitCount"."visitCount") AS "visitCount"
			FROM users
				LEFT JOIN urls ON urls."userId" = users.id
				LEFT JOIN "visitCount" ON "visitCount"."userId" = users.id GROUP BY users.id;`);
    
    res.status(200).send(ranking.rows);    
    } catch (error) {
        res.sendStatus(error); 
    }
});


server.get('/status', (req, res) =>{
    res.send('ok');
})

const PORT = process.env.PORT || 4000
server.listen(PORT, () => console.log(`Listen on port ${PORT}`));