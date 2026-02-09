"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    signOut({ redirect: false }).then(() => {
      router.push("/admin/login");
    });
  }, [router]);

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
      <div className="text-zinc-400">Logging out...</div>
    </div>
  );
}
