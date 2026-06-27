import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRoutePackageList } from '../api';

export default function RouteList() {
  const nav = useNavigate();
  const [list, setList] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const pageSize = 12;

  const fetchList = useCallback(async (p: number, kw: string) => {
    setLoading(true);
    try {
      const res = await getRoutePackageList({ page: p, pageSize, keyword: kw });
      setList(res.data.list || []);
      setTotal(res.data.total || 0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchList(page, keyword); }, [page]);

  const onSearch = () => { setPage(1); fetchList(1, keyword); };

  return (
    <div>
      <h1 className="page-title">路线套餐</h1>
      <div className="search-bar">
        <input
          placeholder="搜索路线套餐..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        />
        <button className="btn" onClick={onSearch}>搜索</button>
      </div>
      {loading ? (
        <div className="loading">加载中...</div>
      ) : list.length === 0 ? (
        <div className="empty">暂无路线套餐</div>
      ) : (
        <>
          <div className="grid">
            {list.map((item: any) => (
              <div key={item.id} className="card" onClick={() => nav(`/route/${item.id}`)}>
                <div style={{ height: 200, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 28 }}>
                  🗺️
                </div>
                <h3>{item.name}</h3>
                <p className="desc">{item.description}</p>
                <div className="extra">
                  <span className="price">¥{item.price}</span>
                  <span style={{ fontSize: 13, color: '#888' }}>{item.days}天</span>
                </div>
                {item.tags && (
                  <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    {(typeof item.tags === 'string' ? JSON.parse(item.tags) : item.tags).map((t: string) => (
                      <span key={t} style={{ background: '#f0f0f0', borderRadius: 4, padding: '2px 8px', fontSize: 12, color: '#666' }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          {total > pageSize && (
            <div style={{ textAlign: 'center', marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>上一页</button>
              <span style={{ lineHeight: '40px', fontSize: 14 }}>
                第 {page}/ {Math.ceil(total / pageSize)} 页（共 {total} 条）
              </span>
              <button className="btn" disabled={page >= Math.ceil(total / pageSize)} onClick={() => setPage(page + 1)}>下一页</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
