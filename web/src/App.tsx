import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import ScenicList from './pages/ScenicList';
import ScenicDetail from './pages/ScenicDetail';
import RouteList from './pages/RouteList';
import RouteDetail from './pages/RouteDetail';
import TicketOrder from './pages/TicketOrder';

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo">乌东文旅 · 行·线路订票</Link>
          <nav>
            <Link to="/scenic">景区门票</Link>
            <Link to="/route">路线套餐</Link>
          </nav>
        </div>
      </header>
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scenic" element={<ScenicList />} />
          <Route path="/scenic/:id" element={<ScenicDetail />} />
          <Route path="/ticket/order/:ticketId" element={<TicketOrder />} />
          <Route path="/route" element={<RouteList />} />
          <Route path="/route/:id" element={<RouteDetail />} />
          <Route path="/route/order/:routeId" element={<TicketOrder />} />
        </Routes>
      </main>
    </div>
  );
}
