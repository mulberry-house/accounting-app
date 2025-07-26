

import { useState, useEffect, useMemo } from "react";

export default function App() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved
      ? JSON.parse(saved)
      : [
          { name: "カレー", price: 500, category: "主菜", department: "フード" },
          { name: "サラダ", price: 200, category: "副菜", department: "フード" },
          { name: "ドリンク", price: 150, category: "ドリンク", department: "ドリンク" },
        ];
  });

  const [setMenus, setSetMenus] = useState(() => {
    const saved = localStorage.getItem("setMenus");
    return saved ? JSON.parse(saved) : [{ name: "Aセット", price: 1000 }];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("orders");
    return saved ? JSON.parse(saved) : [];
  });

  const [customer, setCustomer] = useState("");
  const [quantities, setQuantities] = useState({});
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("");
  const [newProductDepartment, setNewProductDepartment] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({});
  
  const [newSetMenuName, setNewSetMenuName] = useState("");
  const [newSetMenuPrice, setNewSetMenuPrice] = useState("");
  const [selectedSetMenu, setSelectedSetMenu] = useState("");

  const [isEditorVisible, setIsEditorVisible] = useState(false);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("setMenus", JSON.stringify(setMenus));
  }, [setMenus]);

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
      appliedSetMenu,
      date: new Date().toLocaleString(),
      paid: false,
    };

    setOrders([newOrder, ...orders]);
    setCustomer("");
    setQuantities({});
    setSelectedSetMenu("");
  };

  const handleAddProduct = () => {
    if (!newProductName || !newProductPrice || !newProductCategory || !newProductDepartment) return;
    setProducts([
      ...products,
      {
        name: newProductName,
        price: parseInt(newProductPrice),
        category: newProductCategory,
        department: newProductDepartment,
      },
    ]);
    setNewProductName("");
    setNewProductPrice("");
    setNewProductCategory("");
    setNewProductDepartment("");
  };

  const handleDeleteProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleUpdateProduct = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = field === "price" ? parseInt(value) : value;
    setProducts(updated);
  };

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

  const handleDeleteOrder = (index) => {
    const updatedOrders = [...orders];
    updatedOrders.splice(index, 1);
    setOrders(updatedOrders);
  };

  const handleMarkAsPaid = (index) => {
    const updatedOrders = [...orders];
    updatedOrders[index].paid = true;
    setOrders(updatedOrders);
  };

  const totalSales = useMemo(() => 
    orders.reduce((sum, order) => sum + order.total, 0)
  , [orders]);

  const productSales = useMemo(() => products.map((p) => {
    let totalQty = 0;
    let totalAmount = 0;
    orders.forEach((order) => {
      if (!order.appliedSetMenu) {
        order.items.forEach((item) => {
          if (item.name === p.name) {
            totalQty += item.qty;
            totalAmount += item.subtotal;
          }
        });
      }
    });
    return { name: p.name, qty: totalQty, amount: totalAmount };
  }), [orders, products]);

  // 部門ごとの売上を計算する
  const departmentSales = useMemo(() => {
    const sales = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.qty > 0) {
          const product = products.find((p) => p.name === item.name);
          if (product && product.department) {
            sales[product.department] =
              (sales[product.department] || 0) + item.subtotal;
          }
        }
      });
    });
    return sales;
  }, [orders, products]);

  // ========== ▼ ここから追加 ▼ ==========
  // セットメニューごとの売上を計算する
  const setMenuSales = useMemo(() => {
    const sales = {};
    setMenus.forEach((menu) => {
      sales[menu.name] = { qty: 0, amount: 0 };
    });

    orders.forEach((order) => {
      if (order.appliedSetMenu) {
        const menuName = order.appliedSetMenu.name;
        if (sales[menuName]) {
          sales[menuName].qty += 1;
          sales[menuName].amount += order.total;
        }
      }
    });

    return Object.entries(sales).map(([name, data]) => ({
      name,
      ...data,
    }));
  }, [orders, setMenus]);
  // ========== ▲ ここまで追加 ▲ ==========

  const unpaidOrders = orders.filter((o) => !o.paid);
  const paidOrders = orders.filter((o) => o.paid);

  const groupedProducts = useMemo(() => products.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {}), [products]);

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
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-yellow-700">未会計の注文</h2>
        {unpaidOrders.map((order, index) => (
          <div key={index} className="bg-yellow-50 p-4 rounded-lg">
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
                      {!order.appliedSetMenu && `（${item.subtotal}円）`}
                    </li>
                  )
              )}
            </ul>
            <div className="font-semibold">
              合計: {order.total}円
              {order.appliedSetMenu && (
                <span className="text-sm font-normal ml-2">
                  ({order.appliedSetMenu.name}適用)
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-green-700">会計済みの注文</h2>
        {paidOrders.map((order, index) => (
          <div key={index} className="bg-green-50 p-4 rounded-lg">
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
                      {!order.appliedSetMenu && `（${item.subtotal}円）`}
                    </li>
                  )
              )}
            </ul>
            <div className="font-semibold">
              合計: {order.total}円
              {order.appliedSetMenu && (
                <span className="text-sm font-normal ml-2">
                  ({order.appliedSetMenu.name}適用)
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ========== ▼ ここから変更 ▼ ========== */}
      <div className="bg-yellow-100 p-4 rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">売上集計</h2>
        <div>🧾 総売上金額: <strong>{totalSales}円</strong></div>
        
        <div>
          <h3 className="font-semibold mt-2">部門別 売上</h3>
          <ul className="list-disc list-inside">
            {Object.entries(departmentSales).map(([department, amount]) => (
                <li key={department}>
                  {department}: {amount}円
                </li>
            ))}
          </ul>
        </div>
        <div>
            <h3 className="font-semibold mt-2">商品別 売上 (単品注文のみ)</h3>
            <ul className="list-disc list-inside">
            {productSales.map((s, i) => (
                s.qty > 0 && <li key={i}>
                {s.name}: {s.qty}個、{s.amount}円
                </li>
            ))}
            </ul>
        </div>
        <div>
            <h3 className="font-semibold mt-2">セットメニュー別 売上</h3>
            <ul className="list-disc list-inside">
            {setMenuSales.map((s, i) => (
                s.qty > 0 && <li key={i}>
                {s.name}: {s.qty}個、{s.amount}円
                </li>
            ))}
            </ul>
        </div>
      </div>
      {/* ========== ▲ ここまで変更 ▲ ========== */}

      <div className="space-y-4">
        <button
          onClick={() => setIsEditorVisible(!isEditorVisible)}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
        >
          {isEditorVisible ? "各種設定を閉じる ▲" : "各種設定を開く ▼"}
        </button>

        {isEditorVisible && (
          <div className="space-y-6">
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

            <div className="bg-white shadow p-4 rounded-lg space-y-4">
              <h2 className="text-xl font-semibold">メニューを追加・編集</h2>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
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
                <input
                  className="border p-2 rounded"
                  placeholder="部門"
                  value={newProductDepartment}
                  onChange={(e) => setNewProductDepartment(e.target.value)}
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
                  <li key={i} className="grid grid-cols-5 gap-2 items-center">
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
                    <input
                      value={p.department}
                      onChange={(e) => handleUpdateProduct(i, "department", e.target.value)}
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
          </div>
        )}
      </div>
    </div>
  );
}
