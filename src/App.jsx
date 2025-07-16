
import { useState, useEffect } from "react";

export default function App() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : [
      { name: "カレー", price: 500 },
      { name: "サラダ", price: 200 },
      { name: "ドリンク", price: 150 },
    ];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("orders");
    return saved ? JSON.parse(saved) : [];
  });

  const [customer, setCustomer] = useState("");
  const [quantities, setQuantities] = useState({});
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const handleAddOrder = () => {
    const orderItems = products.map((product) => {
      const qty = parseInt(quantities[product.name] || 0);
      return {
        name: product.name,
        qty,
        subtotal: qty * product.price,
      };
    });

    const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    const newOrder = {
      customer,
      items: orderItems,
      total,
      date: new Date().toLocaleString(),
    };

    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    setCustomer("");
    setQuantities({});
  };

  const handleAddProduct = () => {
    if (!newProductName || !newProductPrice) return;
    const newProduct = { name: newProductName, price: parseInt(newProductPrice) };
    setProducts([...products, newProduct]);
    setNewProductName("");
    setNewProductPrice("");
  };

  const handleDeleteProduct = (index) => {
    const updated = products.filter((_, i) => i !== index);
    setProducts(updated);
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">レストラン会計ツール</h1>

      <div className="bg-white shadow p-4 rounded-lg space-y-4">
        <input
          className="border p-2 w-full rounded"
          placeholder="客名を入力"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.name}>
              <label className="block font-medium mb-1">
                {product.name}（{product.price}円）
              </label>
              <input
                type="number"
                min="0"
                value={quantities[product.name] || ""}
                onChange={(e) =>
                  setQuantities({ ...quantities, [product.name]: e.target.value })
                }
                className="border p-2 w-full rounded"
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleAddOrder}
          disabled={!customer}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          注文を追加
        </button>
      </div>

      <div className="bg-white shadow p-4 rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">メニューを追加</h2>
        <div className="flex gap-2">
          <input
            className="border p-2 rounded w-full"
            placeholder="商品名"
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
          />
          <input
            type="number"
            className="border p-2 rounded w-32"
            placeholder="価格"
            value={newProductPrice}
            onChange={(e) => setNewProductPrice(e.target.value)}
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
            <li key={i} className="flex justify-between items-center">
              <span>{p.name}（{p.price}円）</span>
              <button onClick={() => handleDeleteProduct(i)} className="text-red-500">🗑</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">注文履歴</h2>
        {orders.map((order, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg">
            <div className="font-bold">{order.customer}</div>
            <div className="text-sm text-gray-600">{order.date}</div>
            <ul className="list-disc list-inside">
              {order.items.map(
                (item, i) =>
                  item.qty > 0 && (
                    <li key={i}>
                      {item.name}: {item.qty}個（{item.subtotal}円）
                    </li>
                  )
              )}
            </ul>
            <div className="font-semibold">合計: {order.total}円</div>
          </div>
        ))}
      </div>
    </div>
  );
}
