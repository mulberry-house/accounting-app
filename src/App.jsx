

import { useState, useEffect } from "react";

export default function App() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved
      ? JSON.parse(saved)
      : [
          { name: "カレー", price: 500, category: "主菜" },
          { name: "サラダ", price: 200, category: "副菜" },
        ];
  });

  const [setMenus, setSetMenus] = useState(() => {
    const saved = localStorage.getItem("setMenus");
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: 0, category: "" });
  const [newSetMenu, setNewSetMenu] = useState({ name: "", price: 0 });
  const [showSetMenuForm, setShowSetMenuForm] = useState(false);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("setMenus", JSON.stringify(setMenus));
  }, [setMenus]);

  const addProduct = () => {
    if (!newProduct.name || newProduct.price <= 0 || !newProduct.category) return;
    setProducts([...products, newProduct]);
    setNewProduct({ name: "", price: 0, category: "" });
  };

  const addSetMenu = () => {
    if (!newSetMenu.name || newSetMenu.price <= 0) return;
    setSetMenus([...setMenus, newSetMenu]);
    setNewSetMenu({ name: "", price: 0 });
  };

  const placeOrder = (product) => {
    setOrders([...orders, product]);
  };

  const applySetMenu = (menu) => {
    setOrders([{ ...menu, isSet: true }]);
  };

  const calculateTotal = () => {
    const setMenu = orders.find((item) => item.isSet);
    if (setMenu) return setMenu.price;
    return orders.reduce((sum, item) => sum + item.price, 0);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>会計ツール</h1>

      <h2>注文</h2>
      <div>
        {products.map((p, index) => (
          <button
            key={index}
            onClick={() => placeOrder(p)}
            style={{ margin: 5 }}
          >
            {p.name} ({p.price}円)
          </button>
        ))}
      </div>

      <h2>セットメニュー適用</h2>
      <div>
        {setMenus.map((menu, index) => (
          <button
            key={index}
            onClick={() => applySetMenu(menu)}
            style={{ margin: 5 }}
          >
            {menu.name} ({menu.price}円)
          </button>
        ))}
      </div>

      <h2>注文一覧</h2>
      <ul>
        {orders.map((o, index) => (
          <li key={index}>{o.name} - {o.price}円</li>
        ))}
      </ul>
      <h3>合計: {calculateTotal()}円</h3>

      <h2>商品追加</h2>
      <input
        type="text"
        placeholder="商品名"
        value={newProduct.name}
        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="価格"
        value={newProduct.price}
        onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) })}
      />
      <input
        type="text"
        placeholder="カテゴリ"
        value={newProduct.category}
        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
      />
      <button onClick={addProduct}>追加</button>

      <h2>
        <button onClick={() => setShowSetMenuForm(!showSetMenuForm)}>
          {showSetMenuForm ? "▼ セットメニュー追加（クリックで閉じる）" : "▶ セットメニュー追加（クリックで開く）"}
        </button>
      </h2>

      {showSetMenuForm && (
        <div style={{ marginTop: 10 }}>
          <input
            type="text"
            placeholder="セットメニュー名"
            value={newSetMenu.name}
            onChange={(e) => setNewSetMenu({ ...newSetMenu, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="価格"
            value={newSetMenu.price}
            onChange={(e) => setNewSetMenu({ ...newSetMenu, price: parseInt(e.target.value) })}
          />
          <button onClick={addSetMenu}>追加</button>
        </div>
      )}
    </div>
  );
}
