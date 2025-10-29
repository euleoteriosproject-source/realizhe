"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ModalTermos } from "@/components/ModalTermos";

const schema = z
  .object({
    nome: z.string().min(3, "Informe seu nome completo."),
    email: z.string().email("E-mail inválido."),
    telefone: z.string().min(10, "Informe um telefone válido."),
    cpf: z.string().min(11, "Informe um CPF válido."),
    endereco: z.string().min(5, "Endereço obrigatório."),
    cidade: z.string().min(2, "Cidade obrigatória."),
    cep: z.string().min(8, "CEP obrigatório."),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres."),
    aceiteTermos: z.boolean(),
  })
  .refine((data) => data.aceiteTermos, {
    path: ["aceiteTermos"],
    message: "Confirme o aceite dos Termos e Política de Privacidade.",
  });

type FormValues = z.infer<typeof schema>;

export default function CadastroPage() {
  const { signUp, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      cpf: "",
      endereco: "",
      cidade: "",
      cep: "",
      password: "",
      aceiteTermos: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      await signUp(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta.");
    }
  };

  return (
    <div className="py-12 sm:py-16">
      <div className="container max-w-2xl">
        <div className="card-surface border border-border p-8">
          <h1 className="text-3xl font-display font-semibold text-foreground">
            Criar conta
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Cadastre-se para acompanhar pedidos e personalizar planos com a Realizhe.
          </p>

          <form className="mt-8 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="nome">Nome completo</Label>
                <Input id="nome" {...form.register("nome")} />
                {form.formState.errors.nome && (
                  <p className="text-xs text-primary">
                    {form.formState.errors.nome.message}
                  </p>
                )}
              </div>
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
                <Label htmlFor="telefone">Telefone (WhatsApp)</Label>
                <Input id="telefone" {...form.register("telefone")} />
                {form.formState.errors.telefone && (
                  <p className="text-xs text-primary">
                    {form.formState.errors.telefone.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" {...form.register("cpf")} />
                {form.formState.errors.cpf && (
                  <p className="text-xs text-primary">
                    {form.formState.errors.cpf.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input id="cep" {...form.register("cep")} />
                {form.formState.errors.cep && (
                  <p className="text-xs text-primary">
                    {form.formState.errors.cep.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input id="cidade" {...form.register("cidade")} />
                {form.formState.errors.cidade && (
                  <p className="text-xs text-primary">
                    {form.formState.errors.cidade.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="endereco">Endereço completo</Label>
                <Input id="endereco" {...form.register("endereco")} />
                {form.formState.errors.endereco && (
                  <p className="text-xs text-primary">
                    {form.formState.errors.endereco.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" {...form.register("password")} />
                {form.formState.errors.password && (
                  <p className="text-xs text-primary">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-accent/60 p-4">
              <Checkbox
                id="aceiteTermos"
                checked={form.watch("aceiteTermos")}
                onCheckedChange={(checked) =>
                  form.setValue("aceiteTermos", Boolean(checked))
                }
              />
              <div className="text-sm text-muted-foreground">
                <Label htmlFor="aceiteTermos" className="font-semibold text-foreground">
                  Li e aceito os Termos e Condições e a Política de Privacidade.
                </Label>{" "}
                <ModalTermos />
                {form.formState.errors.aceiteTermos && (
                  <p className="mt-1 text-xs text-primary">
                    {form.formState.errors.aceiteTermos.message}
                  </p>
                )}
              </div>
            </div>

            {error ? <p className="text-sm font-semibold text-primary">{error}</p> : null}

            <Button
              type="submit"
              className="w-full justify-center"
              disabled={loading || form.formState.isSubmitting}
            >
              Criar conta
            </Button>
          </form>

          <div className="mt-6 text-sm text-muted-foreground">
            Já tem conta?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Fazer login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
