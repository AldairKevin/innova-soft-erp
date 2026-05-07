"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
};

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const addToCart = (product: Product) => {
    const exist = cart.find((p) => p.id === product.id);

    if (exist) {
      setCart(
        cart.map((p) =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQty = (id: number, qty: number) => {
    setCart(
      cart.map((p) =>
        p.id === id ? { ...p, quantity: qty } : p
      )
    );
  };

  const removeItem = (id: number) => {
    setCart(cart.filter((p) => p.id !== id));
  };

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
  if (cart.length === 0) return;

  try {
    const res = await fetch("/api/sales", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: cart,
        customerName: "Cliente",
      }),
    });

    const sale = await res.json();

    if (!res.ok) {
      throw new Error(sale.message);
    }

    // 🔥 ABRIR TICKET
    window.open(`/api/ticket?saleId=${sale.id}`, "_blank");

    alert("Venta realizada 🔥");
    setCart([]);

  } catch (error: any) {
    alert(error.message);
  }
};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* PRODUCTOS */}
      <div className="lg:col-span-2 bg-slate-900 p-6 rounded-2xl">
        <h2 className="text-xl font-bold mb-4">Productos</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-slate-800 p-4 rounded-xl cursor-pointer hover:bg-slate-700"
              onClick={() => addToCart(p)}
            >
              <p className="font-bold">{p.name}</p>
              <p>S/ {p.price}</p>
              <p className="text-xs text-slate-400">
                Stock: {p.stock}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CARRITO */}
      <div className="bg-slate-900 p-6 rounded-2xl flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-4">Carrito</h2>

          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center mb-3"
            >
              <div>
                <p>{item.name}</p>
                <input
                  type="number"
                  value={item.quantity}
                  min={1}
                  className="w-16 bg-slate-800"
                  onChange={(e) =>
                    updateQty(item.id, Number(e.target.value))
                  }
                />
              </div>

              <div>
                <p>S/ {item.price * item.quantity}</p>
                <button onClick={() => removeItem(item.id)}>
                  ❌
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div>
          <h3 className="text-xl font-bold">
            Total: S/ {total}
          </h3>

          <button
            onClick={handleCheckout}
            className="mt-4 w-full bg-blue-600 p-3 rounded-xl"
          >
            Cobrar
          </button>
        </div>
      </div>
    </div>
  );
}