import { connection } from '../database/database.js';
 async function usersMe (req, res) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    try {
        const haveSession = await connection.query(`SELECT "userId" FROM sessions WHERE token = '${token}';`);
        if(!haveSession.rows[0]) return res.sendStatus(401);
        
        const name = await connection.query(`SELECT name FROM users WHERE id = '${haveSession.rows[0].userId}';`);
        
        const visitCount = await connection.query(`SELECT SUM ("visitCount") AS "visitCount" FROM "visitCount" WHERE "userId" = '${haveSession.rows[0].userId}';`);
        
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
}

export {usersMe};