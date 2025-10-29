"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Cliente = {
  id: string;
  user_id: string;
  nome: string | null;
  email: string | null;
  telefone: string | null;
  cpf: string | null;
  endereco: string | null;
  cidade: string | null;
  cep: string | null;
  aceite_termos: boolean | null;
  hash_termos: string | null;
  data_aceite: string | null;
};

type AuthState = {
  user: { id: string; email: string | null } | null;
  cliente: Cliente | null;
  loading: boolean;
  signIn: (payload: { email: string; password: string }) => Promise<void>;
  signUp: (
    payload: {
      email: string;
      password: string;
      nome?: string;
      telefone?: string;
      cpf?: string;
      endereco?: string;
      cidade?: string;
      cep?: string;
      aceiteTermos: boolean;
    },
  ) => Promise<void>;
  signOut: () => Promise<void>;
  refreshCliente: () => Promise<void>;
  updateClienteLocally: (data: Partial<Cliente>) => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

const STORAGE_KEY = "realizhe-cliente-session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthState["user"]>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user ?? null);
        setCliente(parsed.cliente ?? null);
      } catch {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }

    const sync = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          cache: "no-store",
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setCliente(data.cliente);
          sessionStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ user: data.user, cliente: data.cliente }),
          );
        } else {
          setUser(null);
          setCliente(null);
          sessionStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        console.error("Failed to sync session", error);
      } finally {
        setLoading(false);
      }
    };

    void sync();
  }, []);

  const persist = (nextUser: AuthState["user"], nextCliente: Cliente | null) => {
    setUser(nextUser);
    setCliente(nextCliente);
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ user: nextUser, cliente: nextCliente }),
    );
  };

  const signIn: AuthState["signIn"] = async ({ email, password }) => {
    setLoading(true);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      setLoading(false);
      throw new Error(result.message ?? "Falha ao autenticar.");
    }
    persist(result.user, result.cliente ?? null);
    setLoading(false);
    toast.success("Login realizado com sucesso!");
  };

  const signUp: AuthState["signUp"] = async (payload) => {
    setLoading(true);
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      setLoading(false);
      throw new Error(result.message ?? "Falha ao criar conta.");
    }
    toast.success("Conta criada! Entrando...");
    await signIn({ email: payload.email, password: payload.password });
    router.push("/");
    setLoading(false);
  };

  const signOut: AuthState["signOut"] = async () => {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    persist(null, null);
    setLoading(false);
    toast.success("Sessão encerrada.");
    router.push("/");
  };

  const refreshCliente = async () => {
    const response = await fetch("/api/auth/session", { cache: "no-store" });
    if (response.ok) {
      const data = await response.json();
      persist(data.user, data.cliente ?? null);
    }
  };

  const updateClienteLocally: AuthState["updateClienteLocally"] = (data) => {
    setCliente((current) =>
      current ? { ...current, ...data } : (data as Cliente),
    );
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            ...parsed,
            cliente: parsed.cliente
              ? { ...parsed.cliente, ...data }
              : { ...data },
          }),
        );
      } catch {
        // ignore
      }
    }
  };

  const value = useMemo<AuthState>(
    () => ({
      user,
      cliente,
      loading,
      signIn,
      signUp,
      signOut,
      refreshCliente,
      updateClienteLocally,
    }),
    [user, cliente, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
