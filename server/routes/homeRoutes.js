import express from 'express';
import { postHome, getSubmitPage, postAnalyze } from '../controllers/homeController.js';

const router = express.Router();

router.post('/home', postHome);
router.get('/submitpage', getSubmitPage);
router.post('/analyze', postAnalyze);

export default router;
