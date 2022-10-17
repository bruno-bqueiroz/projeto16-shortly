import { connection } from '../database/database.js';
 
 async function ranking (req, res) {

    try {
        const ranking = await connection.query(`SELECT
		users.id AS id, users.name AS name, 
		COUNT (urls."shortUrl") AS "linksCount",
		SUM ("visitCount"."visitCount") AS "visitCount"
			FROM users
				LEFT JOIN urls ON urls."userId" = users.id
				LEFT JOIN "visitCount" ON "visitCount"."userId" = users.id GROUP BY users.id LIMIT 10;`);
    
    res.status(200).send(ranking.rows);    
    } catch (error) {
        res.sendStatus(error); 
    }
}

export {ranking};
