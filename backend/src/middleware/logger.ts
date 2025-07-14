
import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

const logFilePath = path.join(__dirname, '../../logs/access.log');
fs.mkdirSync(path.dirname(logFilePath), { recursive: true });

export const logger = (req: Request, res: Response, next: NextFunction) => {
  const log = `${new Date().toISOString()} | ${req.method} ${req.originalUrl}\n`;
  fs.appendFileSync(logFilePath, log);
  next();
};
