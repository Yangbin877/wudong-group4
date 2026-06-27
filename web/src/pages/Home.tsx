import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const nav = useNavigate();
  return (
    <div>
      <h1 className="page-title">行 · 线路订票</h1>
      <p style={{ fontSize: 14, color: '#666', marginBottom: 24 }}>
        探索苗寨风光，预订景区门票与特色路线套餐
      </p>
      <div className="grid">
        <div className="card" onClick={() => nav('/scenic')}>
          <div style={{ height: 200, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 28 }}>
            景区门票
          </div>
          <h3 style={{ marginTop: 12 }}>景区门票预订</h3>
          <p className="desc">西江千户苗寨、乌东苗寨、雷公山等热门景区，在线选票下单</p>
        </div>
        <div className="card" onClick={() => nav('/route')}>
          <div style={{ height: 200, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 28 }}>
            路线套餐
          </div>
          <h3 style={{ marginTop: 12 }}>苗寨路线套餐</h3>
          <p className="desc">精心设计多日行程，深度体验苗族文化与山水风光</p>
        </div>
      </div>
    </div>
  );
}
