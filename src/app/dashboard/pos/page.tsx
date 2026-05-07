"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Search,
  ShoppingCart,
  Trash2,
  CreditCard,
  Package,
  Plus,
} from "lucide-react";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
};

type CartItem = Product & {
  quantity: number;
};

export default function POSPage() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [cart, setCart] =
    useState<CartItem[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [products, search]);

  const addToCart = (product: Product) => {
    const exist = cart.find(
      (p) => p.id === product.id
    );

    if (exist) {
      setCart(
        cart.map((p) =>
          p.id === product.id
            ? {
                ...p,
                quantity: p.quantity + 1,
              }
            : p
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  };

  const updateQty = (
    id: number,
    qty: number
  ) => {
    if (qty <= 0) return;

    setCart(
      cart.map((p) =>
        p.id === id
          ? { ...p, quantity: qty }
          : p
      )
    );
  };

  const removeItem = (id: number) => {
    setCart(
      cart.filter((p) => p.id !== id)
    );
  };

  const total = cart.reduce(
    (acc, item) =>
      acc + item.price * item.quantity,
    0
  );

  const items = cart.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    try {
      setLoading(true);

      const res = await fetch(
        "/api/sales",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            items: cart,
            customerName: "Cliente",
          }),
        }
      );

      const sale = await res.json();

      if (!res.ok) {
        throw new Error(sale.message);
      }

      window.open(
        `/api/ticket?saleId=${sale.id}`,
        "_blank"
      );

      setCart([]);

    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

        <div>
          <h1 className="text-4xl font-black text-white">
            Punto de Venta
          </h1>

          <p className="text-slate-400 mt-2">
            Gestiona ventas rápidas y
            profesionales 🚀
          </p>
        </div>

        <div className="flex items-center gap-4">

          <div className="bg-slate-950 border border-slate-800 px-5 py-4 rounded-2xl">
            <p className="text-slate-400 text-sm">
              Productos
            </p>

            <h2 className="text-2xl font-black">
              {products.length}
            </h2>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-4 rounded-2xl shadow-xl">
            <p className="text-white/70 text-sm">
              Venta actual
            </p>

            <h2 className="text-2xl font-black text-white">
              S/ {total.toFixed(2)}
            </h2>
          </div>

        </div>

      </div>

      {/* MAIN */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* PRODUCTS */}
        <div className="xl:col-span-2 bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl">

          {/* SEARCH */}
          <div className="relative mb-6">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-blue-500 transition"
            />

          </div>

          {/* PRODUCT GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">

            {filteredProducts.map((p) => (
              <button
                key={p.id}
                onClick={() =>
                  addToCart(p)
                }
                className="group relative overflow-hidden text-left bg-slate-900 border border-slate-800 hover:border-blue-500/40 rounded-3xl p-5 transition-all duration-300 hover:scale-[1.02]"
              >

                <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 blur-3xl rounded-full" />

                <div className="relative z-10">

                  <div className="flex items-center justify-between mb-5">

                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                      <Package size={26} />
                    </div>

                    <div className="bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-full border border-emerald-500/20">
                      Stock {p.stock}
                    </div>

                  </div>

                  <h2 className="text-lg font-bold text-white">
                    {p.name}
                  </h2>

                  <p className="text-3xl font-black mt-3 text-white">
                    S/ {p.price}
                  </p>

                  <div className="mt-5 flex items-center justify-between">

                    <span className="text-sm text-slate-400">
                      Click para agregar
                    </span>

                    <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center">
                      <Plus size={18} />
                    </div>

                  </div>

                </div>

              </button>
            ))}

          </div>

        </div>

        {/* CART */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col">

          {/* TITLE */}
          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-2xl font-black">
                Carrito
              </h2>

              <p className="text-slate-400 text-sm mt-1">
                {items} productos agregados
              </p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShoppingCart size={24} />
            </div>

          </div>

          {/* ITEMS */}
          <div className="flex-1 space-y-4 overflow-auto pr-1">

            {cart.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">

                <ShoppingCart
                  size={50}
                  className="text-slate-700"
                />

                <p className="text-slate-500 mt-4">
                  El carrito está vacío
                </p>

              </div>
            )}

            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4"
              >

                <div className="flex items-start justify-between gap-3">

                  <div className="flex-1">

                    <h3 className="font-semibold">
                      {item.name}
                    </h3>

                    <p className="text-sm text-slate-400 mt-1">
                      S/ {item.price} c/u
                    </p>

                    <div className="flex items-center gap-3 mt-4">

                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQty(
                            item.id,
                            Number(
                              e.target.value
                            )
                          )
                        }
                        className="w-20 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 outline-none"
                      />

                      <button
                        onClick={() =>
                          removeItem(item.id)
                        }
                        className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </div>

                  <div className="text-right">

                    <p className="text-lg font-bold">
                      S/{" "}
                      {(
                        item.price *
                        item.quantity
                      ).toFixed(2)}
                    </p>

                  </div>

                </div>

              </div>
            ))}

          </div>

          {/* FOOTER */}
          <div className="pt-6 mt-6 border-t border-slate-800 space-y-5">

            <div className="flex items-center justify-between">

              <span className="text-slate-400">
                Total
              </span>

              <h2 className="text-4xl font-black">
                S/ {total.toFixed(2)}
              </h2>

            </div>

            <button
              onClick={handleCheckout}
              disabled={
                loading ||
                cart.length === 0
              }
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 font-bold text-lg flex items-center justify-center gap-3 hover:scale-[1.01] transition-all disabled:opacity-50"
            >

              <CreditCard size={22} />

              {loading
                ? "Procesando..."
                : "Cobrar Venta"}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}