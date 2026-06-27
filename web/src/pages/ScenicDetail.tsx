import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getScenicSpotDetail, getTicketTypeList } from '../api';

export default function ScenicDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [spot, setSpot] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [sRes, tRes] = await Promise.all([
          getScenicSpotDetail(Number(id)),
          getTicketTypeList({ scenicSpotId: Number(id), page: 1, pageSize: 50 }),
        ]);
        setSpot(sRes.data);
        setTickets(tRes.data.list || []);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="loading">加载中...</div>;
  if (!spot) return <div className="empty">景区不存在</div>;

  return (
    <div>
      <Link to="/scenic" className="back-link">← 返回景区列表</Link>
      <div style={{ background: '#fff', borderRadius: 8, padding: 24, marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 12 }}>{spot.name}</h1>
        {spot.rating && <p style={{ color: '#f5a623', marginBottom: 8 }}>⭐ {spot.rating}</p>}
        <p style={{ color: '#888', fontSize: 13, marginBottom: 8 }}>📍 {spot.location} | 🕐 {spot.openTime}</p>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#555' }}>{spot.description}</p>
        {spot.tips && <p style={{ fontSize: 13, color: '#999', marginTop: 8 }}>💡 {spot.tips}</p>}
      </div>

      <div className="detail-section">
        <h2>可选票种</h2>
        {tickets.length === 0 ? (
          <div className="empty" style={{ padding: 30 }}>暂无可售票种</div>
        ) : (
          <div className="ticket-list">
            {tickets.map((t: any) => (
              <div key={t.id} className="ticket-card">
                <h4>{t.name}</h4>
                {t.description && <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>{t.description}</p>}
                <p style={{ fontSize: 12, color: '#999' }}>有效期 {t.validityDays} 天</p>
                <p className="price" style={{ marginTop: 8 }}>¥{t.price}</p>
                <button
                  className="btn"
                  style={{ marginTop: 12, width: '100%' }}
                  onClick={() => nav(`/ticket/order/${t.id}`)}
                >
                  立即预订
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
