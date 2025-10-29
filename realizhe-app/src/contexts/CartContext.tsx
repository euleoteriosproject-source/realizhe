"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product } from "@/types/product";

type CartStateItem = {
  productId: string;
  quantity: number;
};

export type CartItem = Product & {
  quantity: number;
  lineTotal: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (productId: string) => void;
  decreaseItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  total: number;
  totalItems: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "realizhe-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CartStateItem[]>([]);
  const [productMap, setProductMap] = useState<Record<string, Product>>({});

  useEffect(() => {
    try {
      const serialized =
        typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (serialized) {
        const parsed: CartStateItem[] = JSON.parse(serialized);
        setState(parsed);
      }
    } catch (error) {
      console.error("Failed to restore cart", error);
    }
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    } catch (error) {
      console.error("Failed to persist cart", error);
    }
  }, [state]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch("/api/produtos");
        if (!response.ok) {
          throw new Error("Falha ao carregar produtos.");
        }
        const data = await response.json();
        if (Array.isArray(data.products)) {
          const map: Record<string, Product> = {};
          for (const product of data.products as Product[]) {
            map[product.id] = product;
          }
          setProductMap(map);
        }
      } catch (error) {
        console.error("Failed to load products", error);
      }
    };
    loadProducts().catch(console.error);
  }, []);

  const addItem = useCallback((productId: string) => {
    setState((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
  }, []);

  const decreaseItem = useCallback((productId: string) => {
    setState((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setState((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const clear = useCallback(() => {
    setState([]);
  }, []);

  const detailedItems = useMemo(() => {
    return state
      .map((stateItem) => {
        const product = productMap[stateItem.productId];
        if (!product) return null;
        const lineTotal = stateItem.quantity * product.price;
        return { ...product, quantity: stateItem.quantity, lineTotal };
      })
      .filter(Boolean) as CartItem[];
  }, [state, productMap]);

  const total = useMemo(
    () => detailedItems.reduce((sum, item) => sum + item.lineTotal, 0),
    [detailedItems],
  );

  const totalItems = useMemo(
    () => detailedItems.reduce((sum, item) => sum + item.quantity, 0),
    [detailedItems],
  );

  const value = useMemo(
    () => ({
      items: detailedItems,
      addItem,
      decreaseItem,
      removeItem,
      clear,
      total,
      totalItems,
    }),
    [addItem, decreaseItem, removeItem, clear, detailedItems, total, totalItems],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
