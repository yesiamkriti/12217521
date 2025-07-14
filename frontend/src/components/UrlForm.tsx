import React, { useState } from 'react';
import api from '../api';
import './UrlForm.css';

interface ShortenedURL {
  shortLink: string;
  expiry: string;
}

export const UrlForm: React.FC = () => {
  const [longUrl, setLongUrl] = useState('');
  const [shortcode, setShortcode] = useState('');
  const [validity, setValidity] = useState('');
  const [result, setResult] = useState<ShortenedURL | null>(null);
  const [error, setError] = useState('');

  const isValidURL = (url: string): boolean => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    setError('');
    setResult(null);

    if (!longUrl || !isValidURL(longUrl)) {
      return setError('Please enter a valid URL (starting with http:// or https://)');
    }

    const payload: any = { url: longUrl };

    if (validity) {
      const v = parseInt(validity);
      if (isNaN(v) || v <= 0) return setError('Validity must be a positive number');
      payload.validity = v;
    }

    if (shortcode) {
      if (!/^[a-zA-Z0-9]{4,10}$/.test(shortcode)) {
        return setError('Shortcode must be 4-10 alphanumeric characters');
      }
      payload.shortcode = shortcode;
    }

    try {
      const res = await api.post('/', payload);
      setResult(res.data);

      const code = res.data.shortLink.split('/').pop();
      const saved = JSON.parse(localStorage.getItem('my_shortcodes') || '[]');
      if (!saved.includes(code)) {
        saved.push(code);
        localStorage.setItem('my_shortcodes', JSON.stringify(saved));
      }

      // Reset fields
      setLongUrl('');
      setShortcode('');
      setValidity('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Server error occurred');
    }
  };

  return (
    <div className="form-container">
      <h2>Shorten a URL</h2>

      <label htmlFor="url">Long URL</label>
      <input
        id="url"
        type="text"
        value={longUrl}
        onChange={(e) => setLongUrl(e.target.value)}
        placeholder="https://example.com/page"
      />

      <label htmlFor="code">Custom Shortcode (optional)</label>
      <input
        id="code"
        type="text"
        value={shortcode}
        onChange={(e) => setShortcode(e.target.value)}
        placeholder="e.g. mylink123"
      />

      <label htmlFor="validity">Validity in Minutes (optional)</label>
      <input
        id="validity"
        type="number"
        value={validity}
        onChange={(e) => setValidity(e.target.value)}
        placeholder="Default is 30"
      />

      <button onClick={handleSubmit}>Shorten</button>

      {result && (
        <div className="result">
          <p><strong>Short Link:</strong> <a href={result.shortLink} target="_blank" rel="noopener noreferrer">{result.shortLink}</a></p>
          <p><strong>Expires At:</strong> {new Date(result.expiry).toLocaleString()}</p>
        </div>
      )}

      {error && <div className="error">{error}</div>}
    </div>
  );
};
