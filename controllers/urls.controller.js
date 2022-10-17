import { connection } from '../database/database.js';
import { nanoid } from 'nanoid';

const isValidUrl = urlString=> {
    var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
  '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
return !!urlPattern.test(urlString);
}

 async function urlShorten (req, res)  {
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
 }

 async function urlId (req, res){
    const id = req.params.id;
    
    try {
        const url = await connection.query(`SELECT id, "shortUrl", url FROM urls WHERE id = '${id}';`);
        
        if (!url.rows[0]) return res.sendStatus(404);
        res.status(200).send(url.rows);
    } catch (error) {
        res.sendStatus(error);
    } 
}


 async function urlOpen (req, res) {
    const shortUrl = req.params.shortUrl;
        
    try {
        const url = await connection.query(`SELECT * FROM urls WHERE "shortUrl" = '${shortUrl}';`);
        if(!url.rows[0]) return res.sendStatus(404)
        
        const visitCount = await connection.query(`SELECT "visitCount" FROM "visitCount" WHERE "idUrl" = '${url.rows[0].id}';`);
        const updateVisitCount = visitCount.rows[0].visitCount + 1;

         await connection.query(`UPDATE "visitCount" SET "visitCount" = '${updateVisitCount}' WHERE "idUrl" = '${url.rows[0].id}';`)
         res.redirect(url.rows[0].url);
    } catch (error) {
        res.sendStatus(error);
    } 
}

async function urlDelete (req, res) {
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
}





 export{urlShorten, urlId, urlOpen, urlDelete};