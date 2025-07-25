

import { useState, useEffect } from "react";

export default function App() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved
      ? JSON.parse(saved)
      : [
          { name: "カレー", price: 500, category: "主菜" },
          { name: "サラダ", price: 200, category: "副菜" },
          { name: "ドリンク", price: 150, category: "ドリンク" },
        ];
  });

  // ========== ▼ ここから追加 ▼ ==========
  const [setMenus, setSetMenus] = useState(() => {
    const saved = localStorage.getItem("setMenus");
    return saved ? JSON.parse(saved) : [{ name: "Aセット", price: 1000 }];
  });
  // ========== ▲ ここまで追加 ▲ ==========

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("orders");
    return saved ? JSON.parse(saved) : [];
  });

  const [customer, setCustomer] = useState("");
  const [quantities, setQuantities] = useState({});
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({});
  
  // ========== ▼ ここから追加 ▼ ==========
  const [newSetMenuName, setNewSetMenuName] = useState("");
  const [newSetMenuPrice, setNewSetMenuPrice] = useState("");
  const [selectedSetMenu, setSelectedSetMenu] = useState("");
  // ========== ▲ ここまで追加 ▲ ==========

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  // ========== ▼ ここから追加 ▼ ==========
  useEffect(() => {
    localStorage.setItem("setMenus", JSON.stringify(setMenus));
  }, [setMenus]);
  // ========== ▲ ここまで追加 ▲ ==========

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const handleAddOrder = () => {
    const orderItems = products.map((product) => {
      const qty = parseInt(quantities[product.name] || 0);
      return {
        name: product.name,
        qty,
        subtotal: qty * product.price,
      };
    });
    
    // ========== ▼ ここから変更 ▼ ==========
    let total;
    let appliedSetMenu = null;

    if (selectedSetMenu) {
      const setMenu = setMenus.find((m) => m.name === selectedSetMenu);
      if (setMenu) {
        total = setMenu.price;
        appliedSetMenu = setMenu;
      }
    } else {
      total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    }

    const newOrder = {
      customer,
      items: orderItems,
      total,
      appliedSetMenu, // 適用されたセットメニュー情報を保存
      date: new Date().toLocaleString(),
      paid: false,
    };
    // ========== ▲ ここまで変更 ▲ ==========

    setOrders([newOrder, ...orders]);
    setCustomer("");
    setQuantities({});
    // ========== ▼ ここから追加 ▼ ==========
    setSelectedSetMenu("");
    // ========== ▲ ここまで追加 ▲ ==========
  };

  const handleAddProduct = () => {
    // ... (変更なし)
    if (!newProductName || !newProductPrice || !newProductCategory) return;
    setProducts([
      ...products,
      {
        name: newProductName,
        price: parseInt(newProductPrice),
        category: newProductCategory,
      },
    ]);
    setNewProductName("");
    setNewProductPrice("");
    setNewProductCategory("");
  };

  const handleDeleteProduct = (index) => {
    // ... (変更なし)
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleUpdateProduct = (index, field, value) => {
    // ... (変更なし)
    const updated = [...products];
    updated[index][field] = field === "price" ? parseInt(value) : value;
    setProducts(updated);
  };

  // ========== ▼ ここから追加 ▼ ==========
  const handleAddSetMenu = () => {
    if (!newSetMenuName || !newSetMenuPrice) return;
    setSetMenus([
      ...setMenus,
      { name: newSetMenuName, price: parseInt(newSetMenuPrice) },
    ]);
    setNewSetMenuName("");
    setNewSetMenuPrice("");
  };

  const handleDeleteSetMenu = (index) => {
    setSetMenus(setMenus.filter((_, i) => i !== index));
  };

  const handleUpdateSetMenu = (index, field, value) => {
    const updated = [...setMenus];
    updated[index][field] = field === "price" ? parseInt(value) : value;
    setSetMenus(updated);
  };
  // ========== ▲ ここまで追加 ▲ ==========

  const handleDeleteOrder = (index) => {
    // ... (変更なし)
    const updatedOrders = [...orders];
    updatedOrders.splice(index, 1);
    setOrders(updatedOrders);
  };

  const handleMarkAsPaid = (index) => {
    // ... (変更なし)
    const updatedOrders = [...orders];
    updatedOrders[index].paid = true;
    setOrders(updatedOrders);
  };

  // ... (totalSales, productSales, unpaidOrders, paidOrders, groupedProducts, toggleCategory の各変数は変更なし)
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);

  const productSales = products.map((p) => {
    let totalQty = 0;
    let totalAmount = 0;
    orders.forEach((order) => {
      // セットメニュー適用時は、個々の商品の売上には加算しない
      if (!order.appliedSetMenu) {
        order.items.forEach((item) => {
          if (item.name === p.name) {
            totalQty += item.qty;
            totalAmount += item.subtotal;
          }
        });
      }
    });
    return {
      name: p.name,
      qty: totalQty,
      amount: totalAmount,
    };
  });

  const unpaidOrders = orders.filter((o) => !o.paid);
  const paidOrders = orders.filter((o) => o.paid);

  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {});

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">レストラン会計ツール</h1>

      <div className="bg-white shadow p-4 rounded-lg space-y-4">
        <input
          className="border p-2 w-full rounded"
          placeholder="客名を入力"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
        />
        {/* ========== ▼ ここから追加 ▼ ========== */}
        <select
          value={selectedSetMenu}
          onChange={(e) => setSelectedSetMenu(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option value="">セットメニューを選択 (未選択の場合は通常会計)</option>
          {setMenus.map((menu, i) => (
            <option key={i} value={menu.name}>
              {menu.name} ({menu.price}円)
            </option>
          ))}
        </select>
        {/* ========== ▲ ここまで追加 ▲ ========== */}
        {Object.entries(groupedProducts).map(([category, items]) => (
          <div key={category}>
            <button
              onClick={() => toggleCategory(category)}
              className="font-semibold text-left w-full bg-gray-100 px-3 py-2 rounded hover:bg-gray-200"
            >
              {category}
            </button>
            {expandedCategories[category] && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                {items.map((product) => (
                  <div key={product.name}>
                    <label className="block font-medium mb-1">
                      {product.name}（{product.price}円）
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={quantities[product.name] || ""}
                      onChange={(e) =>
                        setQuantities({
                          ...quantities,
                          [product.name]: e.target.value,
                        })
                      }
                      className="border p-2 w-full rounded"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <button
          onClick={handleAddOrder}
          disabled={!customer}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          注文を追加
        </button>
      </div>
      
      {/* ========== ▼ ここから追加（セットメニュー管理UI）▼ ========== */}
      <div className="bg-white shadow p-4 rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">セットメニューを追加・編集</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            className="border p-2 rounded"
            placeholder="セット名"
            value={newSetMenuName}
            onChange={(e) => setNewSetMenuName(e.target.value)}
          />
          <input
            type="number"
            className="border p-2 rounded"
            placeholder="セット料金"
            value={newSetMenuPrice}
            onChange={(e) => setNewSetMenuPrice(e.target.value)}
          />
          <button
            onClick={handleAddSetMenu}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            ＋追加
          </button>
        </div>
        <ul className="space-y-2">
          {setMenus.map((menu, i) => (
            <li key={i} className="grid grid-cols-3 gap-2 items-center">
              <input
                value={menu.name}
                onChange={(e) => handleUpdateSetMenu(i, "name", e.target.value)}
                className="border px-2 py-1 rounded"
              />
              <input
                type="number"
                value={menu.price}
                onChange={(e) => handleUpdateSetMenu(i, "price", e.target.value)}
                className="border px-2 py-1 rounded text-right"
              />
              <button
                onClick={() => handleDeleteSetMenu(i)}
                className="text-red-500"
              >
                🗑
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* ========== ▲ ここまで追加 ▲ ========== */}
      
      <div className="bg-white shadow p-4 rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">メニューを追加・編集</h2>
        {/* ... (変更なし) ... */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <input
            className="border p-2 rounded"
            placeholder="商品名"
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
          />
          <input
            type="number"
            className="border p-2 rounded"
            placeholder="価格"
            value={newProductPrice}
            onChange={(e) => setNewProductPrice(e.target.value)}
          />
          <input
            className="border p-2 rounded"
            placeholder="カテゴリ"
            value={newProductCategory}
            onChange={(e) => setNewProductCategory(e.target.value)}
          />
          <button
            onClick={handleAddProduct}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            ＋追加
          </button>
        </div>
        <ul className="space-y-2">
          {products.map((p, i) => (
            <li key={i} className="grid grid-cols-4 gap-2 items-center">
              <input
                value={p.name}
                onChange={(e) => handleUpdateProduct(i, "name", e.target.value)}
                className="border px-2 py-1 rounded"
              />
              <input
                type="number"
                value={p.price}
                onChange={(e) => handleUpdateProduct(i, "price", e.target.value)}
                className="border px-2 py-1 rounded text-right"
              />
              <input
                value={p.category}
                onChange={(e) => handleUpdateProduct(i, "category", e.target.value)}
                className="border px-2 py-1 rounded"
              />
              <button
                onClick={() => handleDeleteProduct(i)}
                className="text-red-500"
              >
                🗑
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-yellow-700">未会計の注文</h2>
        {unpaidOrders.map((order, index) => (
          <div key={index} className="bg-yellow-50 p-4 rounded-lg">
            {/* ... (中身はほぼ同じ、合計金額の表示部分だけ変更) ... */}
            <div className="flex justify-between">
              <div>
                <div className="font-bold">{order.customer}</div>
                <div className="text-sm text-gray-600">{order.date}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleMarkAsPaid(orders.indexOf(order))}
                  className="text-green-600"
                >
                  ✅ 会計済みにする
                </button>
                <button
                  onClick={() => handleDeleteOrder(orders.indexOf(order))}
                  className="text-red-500"
                >
                  🗑 削除
                </button>
              </div>
            </div>
            <ul className="list-disc list-inside">
              {order.items.map(
                (item, i) =>
                  item.qty > 0 && (
                    <li key={i}>
                      {item.name}: {item.qty}個
                      {/* ========== ▼ ここから変更 ▼ ========== */}
                      {!order.appliedSetMenu && `（${item.subtotal}円）`}
                      {/* ========== ▲ ここまで変更 ▲ ========== */}
                    </li>
                  )
              )}
            </ul>
            {/* ========== ▼ ここから変更 ▼ ========== */}
            <div className="font-semibold">
              合計: {order.total}円
              {order.appliedSetMenu && (
                <span className="text-sm font-normal ml-2">
                  ({order.appliedSetMenu.name}適用)
                </span>
              )}
            </div>
            {/* ========== ▲ ここまで変更 ▲ ========== */}
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-green-700">会計済みの注文</h2>
        {paidOrders.map((order, index) => (
          <div key={index} className="bg-green-50 p-4 rounded-lg">
            {/* ... (中身はほぼ同じ、合計金額の表示部分だけ変更) ... */}
            <div className="flex justify-between">
              <div>
                <div className="font-bold">{order.customer}</div>
                <div className="text-sm text-gray-600">{order.date}</div>
              </div>
              <button
                onClick={() => handleDeleteOrder(orders.indexOf(order))}
                className="text-red-500"
              >
                🗑 削除
              </button>
            </div>
            <ul className="list-disc list-inside">
              {order.items.map(
                (item, i) =>
                  item.qty > 0 && (
                    <li key={i}>
                      {item.name}: {item.qty}個
                      {/* ========== ▼ ここから変更 ▼ ========== */}
                      {!order.appliedSetMenu && `（${item.subtotal}円）`}
                      {/* ========== ▲ ここまで変更 ▲ ========== */}
                    </li>
                  )
              )}
            </ul>
            {/* ========== ▼ ここから変更 ▼ ========== */}
            <div className="font-semibold">
              合計: {order.total}円
              {order.appliedSetMenu && (
                <span className="text-sm font-normal ml-2">
                  ({order.appliedSetMenu.name}適用)
                </span>
              )}
            </div>
            {/* ========== ▲ ここまで変更 ▲ ========== */}
          </div>
        ))}
      </div>

      <div className="bg-yellow-100 p-4 rounded-lg space-y-2">
        <h2 className="text-xl font-semibold">売上集計</h2>
        <div>🧾 総売上金額: <strong>{totalSales}円</strong></div>
        <ul className="list-disc list-inside">
          {productSales.map((s, i) => (
            <li key={i}>
              {s.name}: {s.qty}個、{s.amount}円
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```
