"use client";

import { useState, useEffect } from "react";

import {
  Trash2,
  PlusCircle,
  Package,
  Boxes,
  DollarSign,
  Search,
  AlertTriangle,
  RefreshCcw,
  Pencil,
  Save,
  X,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

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
  const [editingId, setEditingId] = useState<number | null>(
    null
  );

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

  // GUARDAR
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

  // FILTRO
  const filteredProducts = products.filter((p) =>
    p.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // KPIs
  const totalProducts = products.length;

  const totalStock = products.reduce(
    (acc, p) => acc + Number(p.stock || 0),
    0
  );

  const totalValue = products.reduce(
    (acc, p) =>
      acc +
      Number(p.stock || 0) *
        Number(p.price || 0),
    0
  );

  const lowStock = products.filter(
    (p) => Number(p.stock) < 5
  ).length;

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-8 shadow-2xl">

        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400 mb-6">
              <Sparkles size={16} />
              Gestión empresarial avanzada
            </div>

            <h1 className="text-5xl font-black text-white tracking-tight leading-tight">
              Inventario
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {" "}
                Inteligente
              </span>
            </h1>

            <p className="text-slate-400 mt-4 text-lg max-w-2xl">
              Control total de productos,
              stock y valorización en
              tiempo real.
            </p>

          </div>

          <div className="flex items-center gap-4">

            <button
              onClick={loadData}
              className="h-14 w-14 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
            >
              <RefreshCcw
                size={20}
                className={`text-blue-400 ${
                  loading
                    ? "animate-spin"
                    : ""
                }`}
              />
            </button>

            <div className="rounded-3xl border border-emerald-500/10 bg-emerald-500/5 px-6 py-4">
              <div className="flex items-center gap-2">

                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

                <span className="text-sm text-emerald-400 font-semibold">
                  Sistema activo
                </span>

              </div>

              <p className="text-xs text-slate-400 mt-1">
                Inventario sincronizado
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* PRODUCTOS */}
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl">

          <div className="absolute top-0 right-0 h-24 w-24 bg-blue-500/10 rounded-full blur-2xl" />

          <div className="relative z-10">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs uppercase tracking-[3px] text-slate-500 font-black">
                  Productos
                </p>

                <h2 className="text-5xl font-black text-white mt-4">
                  {totalProducts}
                </h2>

              </div>

              <div className="h-16 w-16 rounded-3xl bg-blue-500/10 flex items-center justify-center">
                <Package
                  size={30}
                  className="text-blue-400"
                />
              </div>

            </div>

            <p className="text-slate-400 text-sm mt-6">
              Productos registrados
            </p>

          </div>

        </div>

        {/* STOCK */}
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl">

          <div className="absolute top-0 right-0 h-24 w-24 bg-purple-500/10 rounded-full blur-2xl" />

          <div className="relative z-10">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs uppercase tracking-[3px] text-slate-500 font-black">
                  Stock
                </p>

                <h2 className="text-5xl font-black text-white mt-4">
                  {totalStock}
                </h2>

              </div>

              <div className="h-16 w-16 rounded-3xl bg-purple-500/10 flex items-center justify-center">
                <Boxes
                  size={30}
                  className="text-purple-400"
                />
              </div>

            </div>

            <p className="text-slate-400 text-sm mt-6">
              Unidades disponibles
            </p>

          </div>

        </div>

        {/* VALOR */}
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl">

          <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-500/10 rounded-full blur-2xl" />

          <div className="relative z-10">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs uppercase tracking-[3px] text-slate-500 font-black">
                  Valorización
                </p>

                <h2 className="text-3xl font-black text-white mt-4">
                  S/{" "}
                  {totalValue.toFixed(2)}
                </h2>

              </div>

              <div className="h-16 w-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center">
                <DollarSign
                  size={30}
                  className="text-emerald-400"
                />
              </div>

            </div>

            <p className="text-slate-400 text-sm mt-6">
              Capital en almacén
            </p>

          </div>

        </div>

        {/* ALERTAS */}
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl">

          <div className="absolute top-0 right-0 h-24 w-24 bg-red-500/10 rounded-full blur-2xl" />

          <div className="relative z-10">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs uppercase tracking-[3px] text-slate-500 font-black">
                  Stock Bajo
                </p>

                <h2 className="text-5xl font-black text-white mt-4">
                  {lowStock}
                </h2>

              </div>

              <div className="h-16 w-16 rounded-3xl bg-red-500/10 flex items-center justify-center">
                <AlertTriangle
                  size={30}
                  className="text-red-400"
                />
              </div>

            </div>

            <p className="text-slate-400 text-sm mt-6">
              Productos críticos
            </p>

          </div>

        </div>

      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-8">

        {/* FORM */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 backdrop-blur-xl p-8 shadow-2xl h-fit">

          <div className="flex items-center gap-3 mb-8">

            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <PlusCircle className="text-blue-400" />
            </div>

            <div>

              <h2 className="text-2xl font-black text-white">
                Nuevo Producto
              </h2>

              <p className="text-slate-400 text-sm">
                Registrar producto
              </p>

            </div>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>

              <label className="text-xs uppercase tracking-[2px] text-slate-500 font-black">
                Nombre
              </label>

              <input
                name="name"
                placeholder="Laptop ASUS"
                required
                className="w-full mt-2 bg-slate-950 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition"
              />

            </div>

            <div className="grid grid-cols-2 gap-4">

              <div>

                <label className="text-xs uppercase tracking-[2px] text-slate-500 font-black">
                  Precio
                </label>

                <input
                  name="price"
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  className="w-full mt-2 bg-slate-950 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition"
                />

              </div>

              <div>

                <label className="text-xs uppercase tracking-[2px] text-slate-500 font-black">
                  Stock
                </label>

                <input
                  name="stock"
                  type="number"
                  required
                  placeholder="0"
                  className="w-full mt-2 bg-slate-950 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition"
                />

              </div>

            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-[1.02] transition-all text-white py-5 rounded-2xl font-black shadow-lg shadow-blue-500/20"
            >
              GUARDAR PRODUCTO
            </button>

          </form>

        </div>

        {/* TABLE */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 backdrop-blur-xl shadow-2xl overflow-hidden">

          {/* TOP */}
          <div className="border-b border-white/5 p-7 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div>

              <h2 className="text-3xl font-black text-white">
                Inventario General
              </h2>

              <p className="text-slate-400 mt-1">
                Gestión avanzada de productos
              </p>

            </div>

            <div className="relative">

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
                className="pl-11 pr-4 py-4 rounded-2xl bg-slate-950 border border-white/10 outline-none focus:border-blue-500 w-full lg:w-[320px] text-white"
              />

            </div>

          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="border-b border-white/5 bg-slate-950/50">

                <tr>

                  <th className="p-5 text-left text-xs uppercase tracking-[2px] text-slate-500">
                    Producto
                  </th>

                  <th className="p-5 text-center text-xs uppercase tracking-[2px] text-slate-500">
                    Precio
                  </th>

                  <th className="p-5 text-center text-xs uppercase tracking-[2px] text-slate-500">
                    Stock
                  </th>

                  <th className="p-5 text-right text-xs uppercase tracking-[2px] text-slate-500">
                    Acciones
                  </th>

                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan={4}
                      className="text-center p-16 text-slate-500"
                    >
                      Cargando inventario...
                    </td>

                  </tr>

                ) : filteredProducts.length > 0 ? (

                  filteredProducts.map((prod) => (

                    <tr
                      key={prod.id}
                      className="border-b border-white/5 hover:bg-white/[0.03] transition"
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
                            className="bg-slate-950 border border-white/10 rounded-2xl px-4 py-3 w-full outline-none text-white"
                          />

                        ) : (

                          <div>

                            <div className="flex items-center gap-3">

                              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                                <Package
                                  size={20}
                                  className="text-blue-400"
                                />
                              </div>

                              <div>

                                <p className="font-bold text-white text-lg">
                                  {prod.name}
                                </p>

                                <p className="text-sm text-slate-500">
                                  ID #{prod.id}
                                </p>

                              </div>

                            </div>

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
                                price:
                                  e.target.value,
                              })
                            }
                            className="bg-slate-950 border border-white/10 rounded-2xl px-4 py-3 w-[120px] outline-none text-center text-white"
                          />

                        ) : (

                          <span className="font-black text-cyan-400 text-lg">
                            S/{" "}
                            {Number(
                              prod.price
                            ).toFixed(2)}
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
                                stock:
                                  e.target.value,
                              })
                            }
                            className="bg-slate-950 border border-white/10 rounded-2xl px-4 py-3 w-[100px] outline-none text-center text-white"
                          />

                        ) : (

                          <span
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold ${
                              Number(
                                prod.stock
                              ) < 5
                                ? "bg-red-500/10 text-red-400"
                                : "bg-emerald-500/10 text-emerald-400"
                            }`}
                          >

                            <ShieldCheck size={14} />

                            {prod.stock}

                          </span>

                        )}

                      </td>

                      {/* ACCIONES */}
                      <td className="p-5">

                        <div className="flex justify-end gap-3">

                          {editingId === prod.id ? (

                            <>
                              <button
                                onClick={() =>
                                  handleSave(
                                    prod.id
                                  )
                                }
                                className="h-12 w-12 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 flex items-center justify-center text-emerald-400 transition"
                              >
                                <Save size={18} />
                              </button>

                              <button
                                onClick={
                                  cancelEdit
                                }
                                className="h-12 w-12 rounded-2xl bg-slate-500/10 hover:bg-slate-500/20 flex items-center justify-center text-slate-300 transition"
                              >
                                <X size={18} />
                              </button>
                            </>

                          ) : (

                            <>
                              <button
                                onClick={() =>
                                  startEdit(
                                    prod
                                  )
                                }
                                className="h-12 w-12 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 flex items-center justify-center text-blue-400 transition"
                              >
                                <Pencil size={18} />
                              </button>

                              <button
                                onClick={() =>
                                  handleDelete(
                                    prod.id
                                  )
                                }
                                className="h-12 w-12 rounded-2xl bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition"
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
                      className="text-center p-16 text-slate-500"
                    >

                      <div className="flex flex-col items-center gap-3">

                        <TrendingUp
                          size={40}
                        />

                        No se encontraron productos

                      </div>

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