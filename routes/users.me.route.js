import { usersMe } from "../controllers/users.me.controller.js";
import express from 'express';

const router = express.Router();

router.get('/users/me', usersMe);

export default router;