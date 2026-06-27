import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ScenicManage from './pages/ScenicManage';
import TicketTypeManage from './pages/TicketTypeManage';
import RoutePackageManage from './pages/RoutePackageManage';
import ElectronicTicketList from './pages/ElectronicTicketList';
import InventoryManage from './pages/InventoryManage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('admin_token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
        <Route index element={<ScenicManage />} />
        <Route path="ticket-type" element={<TicketTypeManage />} />
        <Route path="route-package" element={<RoutePackageManage />} />
        <Route path="electronic-ticket" element={<ElectronicTicketList />} />
        <Route path="inventory" element={<InventoryManage />} />
      </Route>
    </Routes>
  );
}
