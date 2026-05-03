"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { login } from "../actions/auth";

export default function LoginPage() {

const router = useRouter();

const [email, setEmail] = useState("");

const [password, setPassword] = useState("");

const [error, setError] = useState("");

const [loading, setLoading] = useState(false);

const handleLogin = async (
e: React.FormEvent<HTMLFormElement>
) => {

e.preventDefault();

try {

  setLoading(true);

  setError("");

  const response = await login(
    email,
    password
  );

  if (response.success) {

    router.push("/dashboard");

  } else {

    setError(
      response.error || "Error al iniciar sesión"
    );

  }

} catch (err) {

  console.error(err);

  setError("Error interno del servidor");

} finally {

  setLoading(false);

}

};

return (

<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-black to-slate-950 text-white">

  <form
    onSubmit={handleLogin}
    className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-5"
  >

    <div>

      <h1 className="text-4xl font-black">
        InnovaSoft 🚀
      </h1>

      <p className="text-zinc-400 mt-2">
        Sistema Empresarial Profesional
      </p>

    </div>

    <div className="space-y-2">

      <label className="text-sm text-zinc-400">
        Correo
      </label>

      <input
        type="email"
        placeholder="admin@gmail.com"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        className="w-full p-4 rounded-2xl bg-zinc-900 border border-zinc-700 outline-none focus:border-blue-500"
        required
      />

    </div>

    <div className="space-y-2">

      <label className="text-sm text-zinc-400">
        Contraseña
      </label>

      <input
        type="password"
        placeholder="******"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
        className="w-full p-4 rounded-2xl bg-zinc-900 border border-zinc-700 outline-none focus:border-blue-500"
        required
      />

    </div>

    <button
      type="submit"
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 p-4 rounded-2xl font-bold transition-all"
    >

      {loading
        ? "Ingresando..."
        : "Iniciar sesión"}

    </button>

    {error && (

      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm">

        {error}

      </div>

    )}

  </form>

</div>

);
}
