"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  ShoppingBag,
  User,
  CreditCard,
  Search,
  Package,
  Trash2,
  Plus,
  Minus,
  Receipt,
  Sparkles,
} from "lucide-react";

import { createSale } from "@/actions/sales";

export default function SalesPage() {
  const router = useRouter();

  // PRODUCTOS
  const [products, setProducts] = useState<any[]>([]);

  // CARRITO
  const [cart, setCart] = useState<any[]>([]);

  // CLIENTE
  const [customerName, setCustomerName] = useState("");

  // BUSCADOR
  const [search, setSearch] = useState("");

  // LOADING
  const [loading, setLoading] = useState(true);

  // TOTAL
  const total = cart.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );

  // CARGAR PRODUCTOS
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // FILTRAR PRODUCTOS
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  // AGREGAR PRODUCTO
  const addToCart = (product: any) => {
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // AUMENTAR
  const increaseQuantity = (id: number) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // DISMINUIR
  const decreaseQuantity = (id: number) => {
    const updated = cart
      .map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updated);
  };

  // ELIMINAR
  const removeItem = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // FINALIZAR VENTA
  const handleFinalizeSale = async () => {
    if (cart.length === 0) {
      return alert("El carrito está vacío");
    }

    try {
      const saleData = {
        items: cart,
        total: total,
        customerName: customerName || "Cliente General",
      };

      const response = await createSale(saleData);

      if (response.success) {
        setCart([]);
        setCustomerName("");
        alert("✅ Venta realizada con éxito");
      } else {
        alert("❌ Error: " + (response.error || "Error desconocido"));
      }
    } catch (error) {
      console.error(error);
      alert("❌ Error crítico");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div>
          <div className="flex items-center gap-3">

            {/* BOTÓN REGRESAR */}
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-slate-200 hover:bg-slate-300 px-4 py-2 rounded-2xl font-bold text-slate-700 transition"
            >
              ← Regresar
            </button>

            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
              <ShoppingBag className="text-white" size={28} />
            </div>

            <div>
              <h1 className="text-4xl font-black text-slate-800">
                Punto de Venta
              </h1>
              <p className="text-slate-500 font-medium mt-1">
                Sistema empresarial de ventas • InnovaSoft
              </p>
            </div>

          </div>
        </div>

        {/* TOTAL SUPERIOR */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl px-8 py-6 shadow-2xl shadow-blue-200">

          <p className="text-sm uppercase tracking-widest font-bold opacity-80">
            Venta Actual
          </p>

          <h2 className="text-5xl font-black mt-2">
            S/ {total.toFixed(2)}
          </h2>

        </div>
      </div>

      {/* CONTENIDO */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-8">

        {/* PRODUCTOS */}
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden">

          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <h2 className="text-2xl font-black text-slate-800">
                Productos Disponibles
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Gestiona ventas rápidas y modernas
              </p>
            </div>

            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Buscar producto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11 pr-4 py-3 rounded-2xl bg-slate-100 outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-[280px]"
              />
            </div>

          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">

            {loading ? (
              <div className="col-span-full text-center py-20 text-slate-400">
                Cargando productos...
              </div>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-slate-50 border border-slate-200 rounded-3xl p-5"
                >
                  <h3 className="font-black text-slate-800">
                    {product.name}
                  </h3>

                  <p className="text-3xl font-black text-blue-700 mt-3">
                    S/ {Number(product.price).toFixed(2)}
                  </p>

                  <button
                    onClick={() => addToCart(product)}
                    className="mt-5 w-full bg-blue-600 text-white py-3 rounded-2xl font-black"
                  >
                    <Plus className="inline" size={18} /> AGREGAR
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-slate-400">
                No se encontraron productos
              </div>
            )}

          </div>
        </div>

        {/* CARRITO */}
        <div className="bg-white rounded-[2rem] shadow-xl p-6">

          <h2 className="text-2xl font-black mb-4">Carrito</h2>

          {cart.map((item) => (
            <div key={item.id} className="mb-4 border-b pb-3">
              <p className="font-bold">{item.name}</p>

              <div className="flex justify-between items-center mt-2">

                <div className="flex gap-2 items-center">
                  <button onClick={() => decreaseQuantity(item.id)}>
                    <Minus />
                  </button>

                  <span>{item.quantity}</span>

                  <button onClick={() => increaseQuantity(item.id)}>
                    <Plus />
                  </button>
                </div>

                <button onClick={() => removeItem(item.id)}>
                  <Trash2 />
                </button>

              </div>

            </div>
          ))}

          <h3 className="text-xl font-black mt-6">
            Total: S/ {total.toFixed(2)}
          </h3>

          <button
            onClick={handleFinalizeSale}
            className="w-full mt-5 bg-green-600 text-white py-4 rounded-2xl font-black"
          >
            <CreditCard className="inline" /> FINALIZAR VENTA
          </button>

        </div>

      </div>
    </div>
  );
}