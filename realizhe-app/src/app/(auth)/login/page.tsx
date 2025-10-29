"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email("Informe um e-mail válido."),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres."),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const { signIn, loading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirectedFrom");
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      await signIn(values);
      router.push(redirectTo ?? "/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao autenticar.");
    }
  };

  return (
    <div className="py-12 sm:py-16">
      <div className="container max-w-lg">
        <div className="card-surface border border-border p-8">
          <h1 className="text-3xl font-display font-semibold text-foreground">
            Entrar
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Acesse sua conta para continuar seus pedidos e planos personalizados.
          </p>

          <form className="mt-8 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="text-xs text-primary">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" {...form.register("password")} />
              {form.formState.errors.password && (
                <p className="text-xs text-primary">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {error ? <p className="text-sm font-semibold text-primary">{error}</p> : null}

            <Button
              type="submit"
              className="w-full justify-center"
              disabled={loading || form.formState.isSubmitting}
            >
              Entrar
            </Button>
          </form>

          <div className="mt-6 text-sm text-muted-foreground">
            Ainda não tem conta?{" "}
            <Link
              href="/cadastro"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Criar minha conta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
