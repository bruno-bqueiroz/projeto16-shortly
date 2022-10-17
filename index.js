import express from 'express';
import cors from 'cors';


import statusRouter from './routes/status.route.js';
import rankingRouter  from './routes/ranking.route.js';
import usersMe from './routes/users.me.route.js';
import urls from './routes/urls.route.js';
import auth from './routes/auth.route.js'

  const server = express();
server.use(cors());
server.use(express.json());

server.use(auth);
server.use(urls);
server.use(usersMe);
server.use(rankingRouter);
server.use(statusRouter);



server.listen(process.env.PORT || 4000, () => console.log(`Listen on port ${process.env.PORT || 4000}`));