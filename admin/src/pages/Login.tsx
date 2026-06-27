import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Card, message } from 'antd';
import { login } from '../api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      message.warning('请输入用户名和密码');
      return;
    }
    setLoading(true);
    try {
      const res = await login(username, password);
      if (res.code === 200) {
        localStorage.setItem('admin_token', res.data.token);
        localStorage.setItem('admin_user', JSON.stringify(res.data.user));
        message.success('登录成功');
        nav('/', { replace: true });
      } else {
        message.error(res.message);
      }
    } catch {
      message.error('登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <Card title="乌东文旅 · 后台管理" style={{ width: 400 }}>
        <Input
          placeholder="用户名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginBottom: 16 }}
          size="large"
          onPressEnter={handleLogin}
        />
        <Input.Password
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: 24 }}
          size="large"
          onPressEnter={handleLogin}
        />
        <Button type="primary" block size="large" loading={loading} onClick={handleLogin}>
          登录
        </Button>
      </Card>
    </div>
  );
}
