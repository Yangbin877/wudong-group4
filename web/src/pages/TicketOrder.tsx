import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { createElectronicTicket } from '../api';

export default function TicketOrder() {
  const { ticketId, routeId } = useParams();
  const nav = useNavigate();
  const loc = useLocation();
  const isRoute = loc.pathname.includes('/route/order');
  const id = ticketId || routeId;

  const [date, setDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async () => {
    if (!date || !phone) {
      alert('请填写完整信息');
      return;
    }
    setSubmitting(true);
    try {
      const body: any = {
        quantity,
        validStart: date,
        validEnd: date,
      };
      if (isRoute) {
        body.routePackageId = Number(id);
      } else {
        body.ticketTypeId = Number(id);
      }
      const res = await createElectronicTicket(body);
      if (res.code === 200) {
        setResult(res.data);
      } else {
        alert(res.message);
      }
    } catch {
      alert('提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
        <h2 style={{ marginBottom: 12 }}>预订成功！</h2>
        <p style={{ fontSize: 14, color: '#555', marginBottom: 8 }}>
          订单号：{result.orderNo}
        </p>
        <p style={{ fontSize: 14, color: '#555', marginBottom: 8 }}>
          电子票二维码：{result.qrCode}
        </p>
        <p style={{ fontSize: 13, color: '#999' }}>
          有效日期：{result.validStart || date}
        </p>
        <button className="btn" style={{ marginTop: 24 }} onClick={() => nav('/')}>返回首页</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <h1 className="page-title">{isRoute ? '预订路线套餐' : '预订门票'}</h1>
      <div style={{ background: '#fff', borderRadius: 8, padding: 24 }}>
        <div className="form-group">
          <label>游玩日期</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label>数量</label>
          <input type="number" min={1} max={10} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        </div>
        <div className="form-group">
          <label>联系手机</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="请输入手机号" />
        </div>
        <button className="btn" style={{ width: '100%', marginTop: 12 }} disabled={submitting} onClick={handleSubmit}>
          {submitting ? '提交中...' : '确认预订'}
        </button>
      </div>
    </div>
  );
}
