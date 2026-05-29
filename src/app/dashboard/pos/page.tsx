"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ShoppingCart,
  Trash2,
  CreditCard,
  Package,
  Plus,
  User,
  FileText,
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
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 CLIENTE
  const [customerName, setCustomerName] = useState("Cliente");
  const [documentType, setDocumentType] = useState("DNI");
  const [document, setDocument] = useState("99999999");
  const [address, setAddress] = useState("Lima");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

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
    if (qty <= 0) return;

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
      setLoading(true);

      const res = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          items: cart,
          customerName,
          document,
          address,
          documentType,
        }),
      });

      const sale = await res.json();

      if (!res.ok) {
        throw new Error(
          sale.error ||
            sale.message ||
            "Error procesando venta"
        );
      }

      if (!sale?.saleId) {
        throw new Error("No se generó saleId");
      }

      window.open(
        `/api/ticket?saleId=${sale.saleId}`,
        "_blank"
      );

      // 🔥 LIMPIAR CARRITO
      setCart([]);

      // 🔥 RESET CLIENTE
      setCustomerName("Cliente");
      setDocument("99999999");
      setAddress("Lima");

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
            Gestiona ventas rápidas y profesionales 🚀
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

          {/* CLIENTE */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 mb-6">

            <div className="flex items-center gap-2 mb-5">
              <User className="text-cyan-400" />
              <h2 className="text-xl font-bold">
                Datos del Cliente
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* NOMBRE */}
              <div>
                <label className="text-sm text-slate-400 mb-2 block">
                  Nombre / Razón Social
                </label>

                <input
                  type="text"
                  value={customerName}
                  onChange={(e) =>
                    setCustomerName(e.target.value)
                  }
                  placeholder="Cliente"
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3"
                />
              </div>

              {/* TIPO DOC */}
              <div>
                <label className="text-sm text-slate-400 mb-2 block">
                  Tipo Documento
                </label>

                <select
                  value={documentType}
                  onChange={(e) => {
                    setDocumentType(e.target.value);

                    if (e.target.value === "DNI") {
                      setDocument("99999999");
                    } else {
                      setDocument("");
                    }
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3"
                >
                  <option value="DNI">DNI</option>
                  <option value="RUC">RUC</option>
                </select>
              </div>

              {/* DOCUMENTO */}
              <div>
                <label className="text-sm text-slate-400 mb-2 block">
                  Número Documento
                </label>

                <div className="relative">
                  <FileText
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="text"
                    value={document}
                    onChange={(e) =>
                      setDocument(e.target.value)
                    }
                    placeholder={
                      documentType === "DNI"
                        ? "99999999"
                        : "20123456789"
                    }
                    maxLength={
                      documentType === "DNI"
                        ? 8
                        : 11
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-12 pr-4 py-3"
                  />
                </div>
              </div>

              {/* DIRECCION */}
              <div>
                <label className="text-sm text-slate-400 mb-2 block">
                  Dirección
                </label>

                <input
                  type="text"
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                  placeholder="Lima"
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3"
                />
              </div>

            </div>
          </div>

          {/* SEARCH */}
          <div className="relative mb-6">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar producto..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4"
            />
          </div>

          {/* PRODUCTS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">

            {filteredProducts.map((p) => (
              <button
                key={p.id}
                onClick={() => addToCart(p)}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-left hover:border-cyan-500 transition"
              >

                <div className="flex justify-between mb-4">
                  <Package />

                  <span className="text-emerald-400 text-sm">
                    Stock {p.stock}
                  </span>
                </div>

                <h2 className="text-white font-bold">
                  {p.name}
                </h2>

                <p className="text-2xl font-black mt-2">
                  S/ {p.price}
                </p>

                <div className="mt-4 flex justify-end">
                  <Plus />
                </div>

              </button>
            ))}

          </div>
        </div>

        {/* CART */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col">

          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-black">
              Carrito
            </h2>

            <ShoppingCart />
          </div>

          <div className="flex-1 space-y-4 overflow-auto">

            {cart.length === 0 && (
              <p className="text-slate-500 text-center">
                Carrito vacío
              </p>
            )}

            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 p-4 rounded-2xl"
              >

                <div className="flex justify-between">

                  <div>
                    <p>{item.name}</p>

                    <p className="text-sm text-slate-400">
                      S/ {item.price}
                    </p>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 />
                  </button>

                </div>

                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQty(
                      item.id,
                      Number(e.target.value)
                    )
                  }
                  className="mt-3 w-20 bg-slate-800 p-2 rounded"
                />

              </div>
            ))}

          </div>

          <div className="border-t border-slate-800 pt-4 mt-4">

            <div className="flex justify-between text-2xl font-bold">
              <span>Total</span>
              <span>S/ {total.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || cart.length === 0}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 transition py-4 rounded-2xl flex justify-center items-center gap-2 disabled:opacity-50"
            >

              <CreditCard />

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