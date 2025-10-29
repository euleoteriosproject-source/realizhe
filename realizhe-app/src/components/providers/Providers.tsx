"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { CartProvider } from "../../contexts/CartContext";
import { AuthProvider } from "../../contexts/AuthContext";

type Props = {
  children: ReactNode;
};

export function Providers({ children }: Props) {
  return (
    <LazyMotion features={domAnimation}>
      <AuthProvider>
        <CartProvider>
          {children}
          <Toaster richColors position="top-right" />
        </CartProvider>
      </AuthProvider>
    </LazyMotion>
  );
}
