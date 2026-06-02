import axios from 'axios';
import { ShortUrl } from '../types';

const api = axios.create({ baseURL: '/api' });

export async function shortenUrl(originalUrl: string): Promise<ShortUrl> {
  const res = await api.post('/shorten', { originalUrl });
  return res.data;
}

export async function getAllUrls(): Promise<ShortUrl[]> {
  const res = await api.get('/urls');
  return res.data;
}
