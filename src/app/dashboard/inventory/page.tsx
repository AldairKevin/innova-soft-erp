"use client";

import { useState, useEffect } from "react";

import {
  Trash2,
  PlusCircle,
  ArrowLeft,
  Package,
  Boxes,
  DollarSign,
  Search,
  AlertTriangle,
  RefreshCcw,
  Pencil,
  Save,
  X,
} from "lucide-react";

import Link from "next/link";

import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../../actions/products";

export default function InventoryPage() {

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  // EDITAR
  const [editingId, setEditingId] = useState<number | null>(null);

  const [editData, setEditData] = useState({
    name: "",
    price: "",
    stock: "",
  });

  // CARGAR PRODUCTOS
  const loadData = async () => {

    try {

      setLoading(true);

      const res = await getProducts();

      if (res.success) {

        setProducts(res.data || []);

      }

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // CREAR PRODUCTO
  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {

    e.preventDefault();

    const form = e.currentTarget;

    const formData = new FormData(form);

    try {

      const res = await createProduct(formData);

      if (res.success) {

        form.reset();

        await loadData();

        alert("✅ Producto agregado correctamente");

      } else {

        alert("❌ " + res.error);

      }

    } catch (error) {

      console.error(error);

    }
  }

  // ELIMINAR
  async function handleDelete(id: number) {

    const confirmDelete =
      confirm("¿Eliminar producto?");

    if (!confirmDelete) return;

    await deleteProduct(id);

    loadData();
  }

  // EDITAR
  function startEdit(product: any) {

    setEditingId(product.id);

    setEditData({
      name: product.name,
      price: String(product.price),
      stock: String(product.stock),
    });
  }

  // CANCELAR
  function cancelEdit() {

    setEditingId(null);

    setEditData({
      name: "",
      price: "",
      stock: "",
    });
  }

  // GUARDAR CAMBIOS
  async function handleSave(id: number) {

    try {

      const formData = new FormData();

      formData.append("id", String(id));
      formData.append("name", editData.name);
      formData.append("price", editData.price);
      formData.append("stock", editData.stock);

      const res = await updateProduct(formData);

      if (res.success) {

        alert("✅ Producto actualizado");

        cancelEdit();

        loadData();

      } else {

        alert("❌ " + res.error);

      }

    } catch (error) {

      console.error(error);

      alert("❌ Error al actualizar");

    }
  }

  // FILTRAR PRODUCTOS
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // KPIs
  const totalProducts = products.length;

  const totalStock = products.reduce(
    (acc, p) => acc + Number(p.stock || 0),
    0
  );

  const totalValue = products.reduce(
    (acc, p) =>
      acc + Number(p.stock || 0) * Number(p.price || 0),
    0
  );

  const lowStock = products.filter(
    (p) => Number(p.stock) < 5
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 p-8 flex flex-col gap-8">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div>

          <h1 className="text-5xl font-black text-slate-800 tracking-tight">
            Inventario Empresarial
          </h1>

          <p className="text-slate-500 mt-2 font-medium text-lg">
            Control inteligente de stock y productos
          </p>

        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={loadData}
            className="bg-white border border-slate-200 shadow-lg rounded-2xl p-4 hover:scale-105 hover:bg-slate-100 transition-all"
          >

            <RefreshCcw
              size={20}
              className={loading ? "animate-spin text-blue-600" : "text-blue-600"}
            />

          </button>

          <Link
            href="/dashboard"
            className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
          >

            <ArrowLeft size={18} />

            Dashboard

          </Link>

        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* PRODUCTOS */}
        <div className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-xl border border-slate-200">

          <div className="flex items-center justify-between mb-5">

            <div>

              <p className="text-xs uppercase tracking-[3px] text-slate-400 font-black">
                Productos
              </p>

              <h2 className="text-5xl font-black text-blue-700 mt-3">
                {totalProducts}
              </h2>

            </div>

            <div className="bg-blue-100 p-5 rounded-3xl">

              <Package
                size={34}
                className="text-blue-700"
              />

            </div>

          </div>

          <p className="text-sm text-slate-500 font-semibold">
            Productos registrados
          </p>

        </div>

        {/* STOCK */}
        <div className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-xl border border-slate-200">

          <div className="flex items-center justify-between mb-5">

            <div>

              <p className="text-xs uppercase tracking-[3px] text-slate-400 font-black">
                Stock Total
              </p>

              <h2 className="text-5xl font-black text-purple-700 mt-3">
                {totalStock}
              </h2>

            </div>

            <div className="bg-purple-100 p-5 rounded-3xl">

              <Boxes
                size={34}
                className="text-purple-700"
              />

            </div>

          </div>

          <p className="text-sm text-slate-500 font-semibold">
            Unidades disponibles
          </p>

        </div>

        {/* VALOR */}
        <div className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-xl border border-slate-200">

          <div className="flex items-center justify-between mb-5">

            <div>

              <p className="text-xs uppercase tracking-[3px] text-slate-400 font-black">
                Valor Total
              </p>

              <h2 className="text-4xl font-black text-emerald-600 mt-3">
                S/ {totalValue.toFixed(2)}
              </h2>

            </div>

            <div className="bg-emerald-100 p-5 rounded-3xl">

              <DollarSign
                size={34}
                className="text-emerald-600"
              />

            </div>

          </div>

          <p className="text-sm text-slate-500 font-semibold">
            Capital almacenado
          </p>

        </div>

        {/* ALERTAS */}
        <div className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-xl border border-slate-200">

          <div className="flex items-center justify-between mb-5">

            <div>

              <p className="text-xs uppercase tracking-[3px] text-slate-400 font-black">
                Stock Bajo
              </p>

              <h2 className="text-5xl font-black text-red-500 mt-3">
                {lowStock}
              </h2>

            </div>

            <div className="bg-red-100 p-5 rounded-3xl">

              <AlertTriangle
                size={34}
                className="text-red-500"
              />

            </div>

          </div>

          <p className="text-sm text-slate-500 font-semibold">
            Productos críticos
          </p>

        </div>
      </div>

      {/* CONTENIDO */}
      <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-8">

        {/* FORM */}
        <div className="bg-white rounded-[2rem] p-8 shadow-2xl border border-slate-200 h-fit">

          <div className="flex items-center gap-3 mb-8">

            <PlusCircle className="text-blue-600" />

            <h2 className="text-3xl font-black text-slate-800">
              Nuevo Producto
            </h2>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>

              <label className="text-xs font-black uppercase tracking-[2px] text-slate-400">
                Nombre
              </label>

              <input
                name="name"
                placeholder="Ej. Laptop ASUS"
                required
                className="w-full mt-2 p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-semibold"
              />

            </div>

            <div className="grid grid-cols-2 gap-4">

              <div>

                <label className="text-xs font-black uppercase tracking-[2px] text-slate-400">
                  Precio
                </label>

                <input
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  required
                  className="w-full mt-2 p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-semibold"
                />

              </div>

              <div>

                <label className="text-xs font-black uppercase tracking-[2px] text-slate-400">
                  Stock
                </label>

                <input
                  name="stock"
                  type="number"
                  placeholder="0"
                  required
                  className="w-full mt-2 p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-semibold"
                />

              </div>

            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:scale-[1.02] text-white py-5 rounded-2xl font-black shadow-xl transition-all"
            >

              GUARDAR PRODUCTO

            </button>

          </form>
        </div>

        {/* TABLA */}
        <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden">

          {/* TOP */}
          <div className="p-7 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white">

            <div>

              <h2 className="text-3xl font-black text-slate-800">
                Inventario General
              </h2>

              <p className="text-slate-500 mt-1">
                Administración avanzada de productos
              </p>

            </div>

            {/* BUSCADOR */}
            <div className="relative">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Buscar producto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11 pr-4 py-4 rounded-2xl bg-slate-100 outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-[320px] text-slate-900 font-semibold"
              />

            </div>

          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-100">

                <tr>

                  <th className="p-5 text-left text-xs uppercase tracking-[2px] text-slate-500 font-black">
                    Producto
                  </th>

                  <th className="p-5 text-center text-xs uppercase tracking-[2px] text-slate-500 font-black">
                    Precio
                  </th>

                  <th className="p-5 text-center text-xs uppercase tracking-[2px] text-slate-500 font-black">
                    Stock
                  </th>

                  <th className="p-5 text-right text-xs uppercase tracking-[2px] text-slate-500 font-black">
                    Acciones
                  </th>

                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan={4}
                      className="text-center p-12 text-slate-400 animate-pulse"
                    >

                      Cargando inventario...

                    </td>

                  </tr>

                ) : filteredProducts.length > 0 ? (

                  filteredProducts.map((prod) => (

                    <tr
                      key={prod.id}
                      className="border-t hover:bg-slate-50 transition-all"
                    >

                      {/* PRODUCTO */}
                      <td className="p-5">

                        {editingId === prod.id ? (

                          <input
                            value={editData.name}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                name: e.target.value,
                              })
                            }
                            className="bg-slate-100 rounded-xl px-4 py-3 w-full outline-none text-slate-900 font-bold"
                          />

                        ) : (

                          <div>

                            <p className="font-black text-slate-800 text-lg">
                              {prod.name}
                            </p>

                            <p className="text-sm text-slate-400">
                              ID #{prod.id}
                            </p>

                          </div>

                        )}

                      </td>

                      {/* PRECIO */}
                      <td className="p-5 text-center">

                        {editingId === prod.id ? (

                          <input
                            type="number"
                            value={editData.price}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                price: e.target.value,
                              })
                            }
                            className="bg-slate-100 rounded-xl px-4 py-3 w-[120px] outline-none text-center text-slate-900 font-bold"
                          />

                        ) : (

                          <span className="font-black text-blue-600 text-lg">
                            S/ {Number(prod.price).toFixed(2)}
                          </span>

                        )}

                      </td>

                      {/* STOCK */}
                      <td className="p-5 text-center">

                        {editingId === prod.id ? (

                          <input
                            type="number"
                            value={editData.stock}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                stock: e.target.value,
                              })
                            }
                            className="bg-slate-100 rounded-xl px-4 py-3 w-[100px] outline-none text-center text-slate-900 font-bold"
                          />

                        ) : (

                          <span
                            className={`px-5 py-2 rounded-2xl text-sm font-black ${
                              Number(prod.stock) < 5
                                ? "bg-red-100 text-red-500"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >

                            {prod.stock}

                          </span>

                        )}

                      </td>

                      {/* ACCIONES */}
                      <td className="p-5 text-right">

                        <div className="flex items-center justify-end gap-3">

                          {editingId === prod.id ? (

                            <>
                              <button
                                onClick={() => handleSave(prod.id)}
                                className="bg-emerald-100 hover:bg-emerald-200 text-emerald-600 p-3 rounded-2xl transition"
                              >

                                <Save size={18} />

                              </button>

                              <button
                                onClick={cancelEdit}
                                className="bg-slate-200 hover:bg-slate-300 text-slate-700 p-3 rounded-2xl transition"
                              >

                                <X size={18} />

                              </button>
                            </>

                          ) : (

                            <>
                              <button
                                onClick={() => startEdit(prod)}
                                className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-3 rounded-2xl transition"
                              >

                                <Pencil size={18} />

                              </button>

                              <button
                                onClick={() => handleDelete(prod.id)}
                                className="bg-red-100 hover:bg-red-200 text-red-500 p-3 rounded-2xl transition"
                              >

                                <Trash2 size={18} />

                              </button>
                            </>

                          )}

                        </div>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan={4}
                      className="text-center p-12 text-slate-400"
                    >

                      No se encontraron productos

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>
        </div>
      </div>
    </div>
  );
}