import React, { useState } from 'react';

function OrderList({ menus, orders, setOrders }) {
  const [selected, setSelected] = useState('');
  const [customer, setCustomer] = useState('');

  const handleAddOrder = () => {
    if (!selected || !customer) return;
    const menu = menus.find(m => m.name === selected);
    const newOrder = {
      customer,
      items: [{ name: menu.name, price: menu.price }],
      paid: false,
      timestamp: Date.now()
    };
    setOrders([...orders, newOrder]);
    setCustomer('');
    setSelected('');
  };

  const handleTogglePaid = index => {
    const updated = [...orders];
    updated[index].paid = !updated[index].paid;
    setOrders(updated);
  };

  const handleDelete = index => {
    const updated = [...orders];
    updated.splice(index, 1);
    setOrders(updated);
  };

  const unpaid = orders.filter(o => !o.paid);
  const paid = orders.filter(o => o.paid);

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-2">注文管理</h2>
      <input placeholder="お客様名" value={customer} onChange={e => setCustomer(e.target.value)} className="border p-1 mr-2" />
      <select value={selected} onChange={e => setSelected(e.target.value)} className="border p-1 mr-2">
        <option value="">メニュー選択</option>
        {menus.map((menu, i) => (
          <option key={i} value={menu.name}>{menu.name}</option>
        ))}
      </select>
      <button onClick={handleAddOrder} className="bg-green-500 text-white px-2 py-1 rounded">追加</button>

      <div className="mt-4">
        <h3 className="font-semibold">未会計</h3>
        {unpaid.map((order, i) => (
          <div key={i} className="border p-2 my-1">
            {order.customer} - {order.items.map(item => item.name).join(', ')} - ¥{order.items.reduce((sum, item) => sum + item.price, 0)}
            <button onClick={() => handleTogglePaid(i)} className="ml-2 text-blue-600">会計済みにする</button>
            <button onClick={() => handleDelete(i)} className="ml-2 text-red-600">削除</button>
          </div>
        ))}
        <h3 className="font-semibold mt-4">会計済み</h3>
        {paid.map((order, i) => (
          <div key={i} className="border p-2 my-1 bg-gray-100">
            {order.customer} - {order.items.map(item => item.name).join(', ')} - ¥{order.items.reduce((sum, item) => sum + item.price, 0)}
            <button onClick={() => handleTogglePaid(i)} className="ml-2 text-yellow-600">未会計に戻す</button>
            <button onClick={() => handleDelete(i)} className="ml-2 text-red-600">削除</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderList;