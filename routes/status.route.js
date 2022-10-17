import { status } from "../controllers/status.controller.js";
import express from 'express';

const router = express.Router();

router.get('/status', status);

export default router;