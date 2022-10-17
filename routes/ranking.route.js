import { ranking } from "../controllers/ranking.controller.js";
import express from 'express';

const router = express.Router();

router.get('/ranking', ranking);

export default router;
