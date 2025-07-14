import express from 'express';
import { createShortUrl } from '../controllers/createShortUrl';
import { getShortUrlStats } from '../controllers/getShortUrlStats';
import { handleRedirect } from '../controllers/handleRedirect';

const router = express.Router();

router.post('/', createShortUrl);
router.get('/:shortcode', getShortUrlStats);
router.get('/r/:shortcode', handleRedirect);

export default router;
