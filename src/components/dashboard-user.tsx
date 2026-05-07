"use client";

export default function DashboardUser({ user }: any) {
  return (
    <div className="bg-white/10 px-4 py-2 rounded-xl">
      👤 {user?.name || "Invitado"}
    </div>
  );
}