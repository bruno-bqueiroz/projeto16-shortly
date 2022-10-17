import { urlShorten, urlId, urlOpen, urlDelete } from "../controllers/urls.controller.js";
import express from 'express';

const router = express.Router();

router.post('/urls/shorten', urlShorten);
router.get('/urls/:id', urlId);
router.get('/urls/open/:shortUrl', urlOpen);
router.delete('/urls/:id', urlDelete);

export default router;