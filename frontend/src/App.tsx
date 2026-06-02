import { useState, useEffect } from 'react';
import { shortenUrl, getAllUrls } from './api';
import { ShortUrl } from './types';
import './index.css';

const BASE_URL = window.location.origin;

export default function App() {
  const [inputUrl, setInputUrl] = useState('');
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    getAllUrls().then(setUrls).catch(console.error);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const newUrl = await shortenUrl(inputUrl);
      setUrls([newUrl, ...urls]);
      setInputUrl('');
    } catch {
      setError('Failed to shorten URL. Make sure it starts with http:// or https://');
    } finally {
      setLoading(false);
    }
  }

  async function copyToClipboard(shortCode: string) {
    await navigator.clipboard.writeText(`${BASE_URL}/${shortCode}`);
    setCopied(shortCode);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="app">
      <header>
        <h1>snip.</h1>
        <p>Paste a long URL. Get a short one.</p>
      </header>

      <form onSubmit={handleSubmit} className="shorten-form">
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="https://your-very-long-url.com/goes/here"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Shortening...' : 'Shorten'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <section className="url-list">
        <h2>Your Links</h2>
        {urls.length === 0 && <p className="empty">No links yet. Create one above.</p>}
        {urls.map((url) => (
          <div key={url.id} className="url-card">
            <div className="url-card-main">
              <a
                href={`/${url.short_code}`}
                target="_blank"
                rel="noreferrer"
                className="short-url"
              >
                {BASE_URL}/{url.short_code}
              </a>
              <p className="original-url">{url.original_url}</p>
            </div>
            <div className="url-card-meta">
              <span className="clicks">{url.click_count} clicks</span>
              <button
                className="copy-btn"
                onClick={() => copyToClipboard(url.short_code)}
              >
                {copied === url.short_code ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
