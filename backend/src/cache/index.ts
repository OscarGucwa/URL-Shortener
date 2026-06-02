import { createClient } from 'redis';

export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('Redis error:', err));

export async function initCache() {
  await redisClient.connect();
  console.log('Redis connected');
}

// Cache a short code -> original URL mapping for 24 hours
export async function cacheUrl(shortCode: string, originalUrl: string) {
  await redisClient.setEx(shortCode, 86400, originalUrl);
}

export async function getCachedUrl(shortCode: string): Promise<string | null> {
  return redisClient.get(shortCode);
}
