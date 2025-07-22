import React, { useState, useEffect } from 'react';
import MenuForm from './components/MenuForm';
import OrderList from './components/OrderList';
import SalesSummary from './components/SalesSummary';
import './index.css';

function App() {
  const [menus, setMenus] = useState(() => JSON.parse(localStorage.getItem('menus') || '[]'));
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem('orders') || '[]'));

  useEffect(() => {
    localStorage.setItem('menus', JSON.stringify(menus));
  }, [menus]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  return (
    <div className="p-4 space-y-6">
      <MenuForm menus={menus} setMenus={setMenus} />
      <OrderList menus={menus} orders={orders} setOrders={setOrders} />
      <SalesSummary menus={menus} orders={orders} />
    </div>
  );
}

export default App;