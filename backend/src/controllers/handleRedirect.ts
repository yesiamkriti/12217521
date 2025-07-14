import { Request, Response } from 'express';
import { ShortURL } from '../models/ShortURL';
import axios from 'axios';
import { logEvent, Level, Package } from '../utils/logger';

export const handleRedirect = async (req: Request, res: Response) => {
  const { shortcode } = req.params;

  const shortEntry = await ShortURL.findOne({ shortCode: shortcode });

  if (!shortEntry) {
    await logEvent(Level.WARN, Package.HANDLER, `Redirect failed: ${shortcode} not found`);
    return res.status(404).json({ error: 'Shortcode not found' });
  }

  if (shortEntry.expiresAt < new Date()) {
    await logEvent(Level.INFO, Package.HANDLER, `Link expired: ${shortcode}`);
    return res.status(410).json({ error: 'Link has expired' });
  }

  // Normalize IP
  let clientIp =
    (req.headers['x-forwarded-for'] as string) ||
    req.socket.remoteAddress ||
    '127.0.0.1';

  if (clientIp.startsWith('::ffff:')) {
    clientIp = clientIp.replace('::ffff:', '');
  }

  // Use fallback IP for local development
  if (
    clientIp === '127.0.0.1' ||
    clientIp === '::1' ||
    clientIp.startsWith('192.') ||
    clientIp.startsWith('172.') ||
    clientIp.startsWith('10.')
  ) {
    clientIp = '8.8.8.8'; // fallback public IP for local testing
  }

  const referrer = req.get('referer') || 'Direct';

  let location = 'Unknown';
  try {
    const geo = await axios.get(`http://ip-api.com/json/${clientIp}`);
    if (geo.data?.status === 'success') {
      location = `${geo.data.city || 'Unknown'}, ${geo.data.country || 'Unknown'}`;
    }
  } catch {
    await logEvent(Level.WARN, Package.UTILS, 'Geo IP lookup failed');
  }

  shortEntry.clicks.push({ timestamp: new Date(), referrer, location });
  await shortEntry.save();

  await logEvent(Level.INFO, Package.SERVICE, `Redirected for ${shortcode}`);

  res.redirect(shortEntry.originalUrl);
};
