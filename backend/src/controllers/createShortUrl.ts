import { Request, Response } from 'express';
import { ShortURL } from '../models/ShortURL';
import { v4 as uuidv4 } from 'uuid';
import { logEvent, Level, Package } from '../utils/logger';

const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

function getExpiry(minutes: number) {
  return new Date(Date.now() + minutes * 60000);
}

export const createShortUrl = async (req: Request, res: Response) => {
  try {
    const { url, validity = 30, shortcode } = req.body;

    if (!url || !isValidURL(url)) {
      await logEvent(Level.WARN, Package.HANDLER, 'Invalid or missing URL');
      return res.status(400).json({ error: 'Invalid or missing URL' });
    }

    if (validity <= 0 || typeof validity !== 'number') {
      await logEvent(Level.WARN, Package.HANDLER, 'Invalid validity input');
      return res.status(400).json({ error: 'Validity must be a positive number' });
    }

    const finalShortcode = shortcode || uuidv4().slice(0, 6);
    if (!/^[a-zA-Z0-9]{4,10}$/.test(finalShortcode)) {
      await logEvent(Level.WARN, Package.HANDLER, 'Invalid shortcode format');
      return res.status(400).json({ error: 'Shortcode must be alphanumeric and 4-10 characters' });
    }

    const existing = await ShortURL.findOne({ shortCode: finalShortcode });
    if (existing) {
      await logEvent(Level.INFO, Package.DB, `Shortcode ${finalShortcode} already exists`);
      return res.status(409).json({ error: 'Shortcode already in use' });
    }

    const expiry = getExpiry(validity);
    await ShortURL.create({
      originalUrl: url,
      shortCode: finalShortcode,
      expiresAt: expiry,
    });

    await logEvent(Level.INFO, Package.SERVICE, `Short URL created: ${finalShortcode}`);

    return res.status(201).json({
      shortLink: `http://localhost:5000/shorturls/r/${finalShortcode}`,
      expiry: expiry.toISOString(),
    });
  } catch {
    await logEvent(Level.ERROR, Package.HANDLER, 'Server error during createShortUrl');
    return res.status(500).json({ error: 'Server error' });
  }
};
