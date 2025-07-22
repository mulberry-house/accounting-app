import React, { useState } from 'react';

function MenuForm({ menus, setMenus }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);

  const handleAddMenu = () => {
    if (!name || price <= 0) return;
    setMenus([...menus, { name, price }]);
    setName('');
    setPrice(0);
  };

  const handleEditPrice = (index, newPrice) => {
    const updated = [...menus];
    updated[index].price = newPrice;
    setMenus(updated);
  };

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-2">メニュー管理</h2>
      <input placeholder="名前" value={name} onChange={e => setName(e.target.value)} className="border p-1 mr-2" />
      <input type="number" placeholder="価格" value={price} onChange={e => setPrice(Number(e.target.value))} className="border p-1 mr-2" />
      <button onClick={handleAddMenu} className="bg-blue-500 text-white px-2 py-1 rounded">追加</button>
      <ul className="mt-4">
        {menus.map((menu, i) => (
          <li key={i}>
            {menu.name} - ¥{menu.price}
            <input type="number" value={menu.price} onChange={e => handleEditPrice(i, Number(e.target.value))} className="ml-2 border p-1 w-20" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MenuForm;