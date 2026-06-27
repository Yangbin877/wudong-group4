import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import {
  EnvironmentOutlined,
  TagOutlined,
  NodeIndexOutlined,
  QrcodeOutlined,
  CalendarOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

const { Sider, Header, Content } = Layout;

const menuItems = [
  { key: '/', icon: <EnvironmentOutlined />, label: '景区管理' },
  { key: '/ticket-type', icon: <TagOutlined />, label: '票种管理' },
  { key: '/route-package', icon: <NodeIndexOutlined />, label: '路线套餐' },
  { key: '/electronic-ticket', icon: <QrcodeOutlined />, label: '电子票' },
  { key: '/inventory', icon: <CalendarOutlined />, label: '库存管理' },
];

export default function Dashboard() {
  const nav = useNavigate();
  const loc = useLocation();

  const onLogout = () => {
    localStorage.clear();
    nav('/login', { replace: true });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={220} theme="dark">
        <div style={{ color: '#e94560', fontSize: 16, fontWeight: 'bold', padding: '20px 24px' }}>
          乌东文旅 · 行
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[loc.pathname]}
          items={menuItems}
          onClick={({ key }) => nav(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button icon={<LogoutOutlined />} onClick={onLogout}>退出登录</Button>
        </Header>
        <Content style={{ margin: 24, padding: 24, background: '#fff', borderRadius: 8 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
