import express from 'express';
import {
  createShortUrl,
  getShortUrlStats,
  handleRedirect,
} from '../controllers/urlController';

const router = express.Router();

router.post('/', createShortUrl);
router.get('/:shortcode', getShortUrlStats);

// Redirection endpoint (separate route outside /shorturls)
router.get('/r/:shortcode', handleRedirect);

export default router;
