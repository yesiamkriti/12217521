import { Request, Response } from 'express';
import { ShortURL } from '../models/ShortURL';
import { logEvent, Level, Package } from '../utils/logger';

export const getShortUrlStats = async (req: Request, res: Response) => {
  const { shortcode } = req.params;

  const shortEntry = await ShortURL.findOne({ shortCode: shortcode });

  if (!shortEntry) {
    await logEvent(Level.WARN, Package.HANDLER, `Stats fetch failed: ${shortcode} not found`);
    return res.status(404).json({ error: 'Shortcode not found' });
  }

  await logEvent(Level.INFO, Package.SERVICE, `Stats retrieved for ${shortcode}`);

  return res.status(200).json({
    originalUrl: shortEntry.originalUrl,
    createdAt: shortEntry.createdAt,
    expiresAt: shortEntry.expiresAt,
    totalClicks: shortEntry.clicks.length,
    clicks: shortEntry.clicks,
  });
};
