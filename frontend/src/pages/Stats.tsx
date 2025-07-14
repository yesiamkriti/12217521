import React, { useEffect, useState } from 'react';
import api from '../api';
import './Stats.css';

interface Click {
  timestamp: string;
  referrer: string;
  location: string;
}

interface Stats {
  originalUrl: string;
  createdAt: string;
  expiresAt: string;
  totalClicks: number;
  clicks: Click[];
}

export const Stats: React.FC = () => {
  const [stats, setStats] = useState<{ code: string; data: Stats }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const codes = JSON.parse(localStorage.getItem('my_shortcodes') || '[]');
      const allStats = [];

      for (const code of codes) {
        try {
          const res = await api.get(`/${code}`);
          allStats.push({ code, data: res.data });
        } catch {
          // ignore broken/expired codes
        }
      }

      setStats(allStats);
      setLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <div className="stats-page">
      <h2>URL Analytics</h2>
      {loading && <p>Loading stats...</p>}

      {!loading && stats.length === 0 && <p>No shortened URLs found for this session.</p>}

      {!loading &&
        stats.map(({ code, data }) => (
          <div className="stat-block" key={code}>
            <h3><a href={`http://localhost:5000/shorturls/r/${code}`} target="_blank">{code}</a></h3>
            <p><strong>Original:</strong> {data.originalUrl}</p>
            <p><strong>Created:</strong> {new Date(data.createdAt).toLocaleString()}</p>
            <p><strong>Expires:</strong> {new Date(data.expiresAt).toLocaleString()}</p>
            <p><strong>Total Clicks:</strong> {data.totalClicks}</p>

            {data.clicks.length > 0 && (
              <div className="click-table">
                <table>
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Referrer</th>
                      <th>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.clicks.map((c, i) => (
                      <tr key={i}>
                        <td>{new Date(c.timestamp).toLocaleString()}</td>
                        <td>{c.referrer}</td>
                        <td>{c.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};
