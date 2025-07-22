import React from 'react';

function SalesSummary({ menus, orders }) {
  const total = orders.filter(o => o.paid).reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.price, 0), 0);

  const summary = menus.map(menu => {
    const count = orders.filter(o => o.paid).flatMap(o => o.items).filter(i => i.name === menu.name).length;
    return { name: menu.name, count, total: count * menu.price };
  });

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-2">売上集計</h2>
      <div>総売上: ¥{total}</div>
      <ul>
        {summary.map((item, i) => (
          <li key={i}>{item.name}: {item.count}個 - ¥{item.total}</li>
        ))}
      </ul>
    </div>
  );
}

export default SalesSummary;