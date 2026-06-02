import { Router, Request, Response } from 'express';
import { nanoid } from 'nanoid';
import { pool } from '../db';
import { cacheUrl, getCachedUrl } from '../cache';

const router = Router();

// POST /api/shorten — create a short URL
router.post('/shorten', async (req: Request, res: Response) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: 'originalUrl is required' });
  }

  try {
    new URL(originalUrl); // validate URL format
  } catch {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  try {
    const shortCode = nanoid(7);
    const result = await pool.query(
      'INSERT INTO urls (short_code, original_url) VALUES ($1, $2) RETURNING *',
      [shortCode, originalUrl]
    );
    await cacheUrl(shortCode, originalUrl);
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/urls — list all URLs
router.get('/urls', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM urls ORDER BY created_at DESC'
    );
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /:shortCode — redirect to original URL
router.get('/:shortCode', async (req: Request, res: Response) => {
  const { shortCode } = req.params;

  try {
    // Check Redis first
    const cached = await getCachedUrl(shortCode);
    if (cached) {
      await pool.query(
        'UPDATE urls SET click_count = click_count + 1 WHERE short_code = $1',
        [shortCode]
      );
      return res.redirect(cached);
    }

    // Fall back to Postgres
    const result = await pool.query(
      'UPDATE urls SET click_count = click_count + 1 WHERE short_code = $1 RETURNING original_url',
      [shortCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    const { original_url } = result.rows[0];
    await cacheUrl(shortCode, original_url);
    return res.redirect(original_url);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
