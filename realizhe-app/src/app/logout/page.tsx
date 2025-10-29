"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { SpinnerIcon } from "@/components/icons/SpinnerIcon";

export default function LogoutPage() {
  const { signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      await signOut();
      router.replace("/");
    };
    void run();
  }, [signOut, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex items-center gap-3 rounded-2xl border border-border px-6 py-4 text-sm text-muted-foreground">
        <SpinnerIcon className="h-4 w-4 animate-spin text-primary" />
        Encerrando sessão...
      </div>
    </div>
  );
}
