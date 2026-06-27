import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getRoutePackageDetail } from '../api';

export default function RouteDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [pkg, setPkg] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getRoutePackageDetail(Number(id));
        setPkg(res.data);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="loading">加载中...</div>;
  if (!pkg) return <div className="empty">路线套餐不存在</div>;

  const itineraries = pkg.itineraries || [];
  const tags = typeof pkg.tags === 'string' ? JSON.parse(pkg.tags) : (pkg.tags || []);

  return (
    <div>
      <Link to="/route" className="back-link">← 返回路线列表</Link>
      <div style={{ background: '#fff', borderRadius: 8, padding: 24, marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 12 }}>{pkg.name}</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span className="price">¥{pkg.price}</span>
          <span style={{ fontSize: 14, color: '#888' }}>{pkg.days} 天行程</span>
        </div>
        {tags.length > 0 && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
            {tags.map((t: string) => (
              <span key={t} style={{ background: '#f0f0f0', borderRadius: 4, padding: '2px 8px', fontSize: 12, color: '#666' }}>{t}</span>
            ))}
          </div>
        )}
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#555' }}>{pkg.description}</p>
        <button
          className="btn"
          style={{ marginTop: 16 }}
          onClick={() => nav(`/route/order/${pkg.id}`)}
        >
          立即预订
        </button>
      </div>

      {itineraries.length > 0 && (
        <div className="detail-section">
          <h2>行程安排</h2>
          {itineraries.map((it: any, idx: number) => (
            <div key={it.id || idx} style={{ background: '#fff', borderRadius: 8, padding: 20, marginBottom: 12 }}>
              <h3 style={{ fontSize: 16, marginBottom: 8, color: '#e94560' }}>
                第 {it.dayNo} 天：{it.title}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: '#555' }}>{it.description}</p>
              {(it.meals || it.accommodation) && (
                <div style={{ display: 'flex', gap: 24, marginTop: 12, fontSize: 13, color: '#888' }}>
                  {it.meals && <span>🍽️ {it.meals}</span>}
                  {it.accommodation && <span>🏨 {it.accommodation}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
