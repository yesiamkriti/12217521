import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  referrer: String,
  location: String,
});

const shortUrlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  clicks: [clickSchema],
});

shortUrlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const ShortURL = mongoose.model('ShortURL', shortUrlSchema);
