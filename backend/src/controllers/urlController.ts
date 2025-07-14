import { Request, Response } from 'express';
import { ShortURL } from '../models/ShortURL';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Helper to get expiry date
function getExpiry(minutes: number) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

export const createShortUrl = async (req: Request, res: Response) => {
  try {
    const { url, validity = 30, shortcode } = req.body;

    if (!url || !isValidURL(url)) {
      return res.status(400).json({ error: 'Invalid or missing URL' });
    }

    if (validity <= 0 || typeof validity !== 'number') {
      return res.status(400).json({ error: 'Validity must be a positive number' });
    }

    let finalShortcode = shortcode || uuidv4().slice(0, 6);

    // Ensure shortcode is alphanumeric and reasonable length
    const isValidCode = /^[a-zA-Z0-9]{4,10}$/.test(finalShortcode);
    if (!isValidCode) {
      return res.status(400).json({ error: 'Shortcode must be alphanumeric and 4-10 characters' });
    }

    // Check for uniqueness
    const existing = await ShortURL.findOne({ shortCode: finalShortcode });
    if (existing) {
      return res.status(409).json({ error: 'Shortcode already in use' });
    }

    const expiry = new Date(Date.now() + validity * 60000); // Convert to ms
    const newUrl = await ShortURL.create({
      originalUrl: url,
      shortCode: finalShortcode,
      expiresAt: expiry,
    });

    return res.status(201).json({
      shortLink: `http://localhost:5000/shorturls/r/${finalShortcode}`,
      expiry: expiry.toISOString(),
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};

export const getShortUrlStats = async (req: Request, res: Response) => {
  const { shortcode } = req.params;

  const shortEntry = await ShortURL.findOne({ shortCode: shortcode });

  if (!shortEntry) {
    return res.status(404).json({ error: 'Shortcode not found' });
  }

  return res.status(200).json({
    originalUrl: shortEntry.originalUrl,
    createdAt: shortEntry.createdAt,
    expiresAt: shortEntry.expiresAt,
    totalClicks: shortEntry.clicks.length,
    clicks: shortEntry.clicks,
  });
};


export const handleRedirect = async (req: Request, res: Response) => {
  const { shortcode } = req.params;

  const shortEntry = await ShortURL.findOne({ shortCode: shortcode });

  if (!shortEntry) {
    return res.status(404).json({ error: 'Shortcode not found' });
  }

  const now = new Date();
  if (shortEntry.expiresAt < now) {
    return res.status(410).json({ error: 'Link has expired' });
  }

  // Get IP and referrer
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const referrer = req.get('referer') || 'Direct';

  // Get location from IP
  let location = 'Unknown';
  try {
    const geo = await axios.get(`http://ip-api.com/json/${ip}`);
    location = `${geo.data.city || 'Unknown'}, ${geo.data.country || 'Unknown'}`;
  } catch (err) {
    if (err instanceof Error) {
      console.warn('Geo API failed', err.message);
    } else {
      console.warn('Geo API failed', err);
    }
  }

  // Log click
  shortEntry.clicks.push({ timestamp: new Date(), referrer, location });
  await shortEntry.save();

  res.redirect(shortEntry.originalUrl);
};

