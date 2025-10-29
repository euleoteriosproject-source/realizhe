"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const schema = z.object({
  nome: z.string().min(3, "Informe seu nome completo."),
  telefone: z.string().min(10, "Informe um telefone válido."),
  cpf: z.string().min(11, "Informe o CPF."),
  endereco: z.string().min(5, "Informe o endereço."),
  cidade: z.string().min(2, "Informe a cidade."),
  cep: z.string().min(8, "Informe o CEP."),
});

type FormValues = z.infer<typeof schema>;

export default function PerfilPage() {
  const { cliente, updateClienteLocally, refreshCliente } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: cliente?.nome ?? "",
      telefone: cliente?.telefone ?? "",
      cpf: cliente?.cpf ?? "",
      endereco: cliente?.endereco ?? "",
      cidade: cliente?.cidade ?? "",
      cep: cliente?.cep ?? "",
    },
  });

  useEffect(() => {
    if (cliente) {
      form.reset({
        nome: cliente.nome ?? "",
        telefone: cliente.telefone ?? "",
        cpf: cliente.cpf ?? "",
        endereco: cliente.endereco ?? "",
        cidade: cliente.cidade ?? "",
        cep: cliente.cep ?? "",
      });
    }
  }, [cliente, form]);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const response = await fetch("/api/cliente/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message ?? "Falha ao atualizar dados.");
      }
      updateClienteLocally(data.cliente);
      await refreshCliente();
      toast.success("Dados atualizados com sucesso!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao atualizar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-16">
      <div className="container max-w-2xl">
        <div className="card-surface border border-border p-8">
          <h1 className="text-3xl font-display font-semibold text-foreground">
            Meus dados
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Atualize os dados do seu cadastro. Eles são utilizados para entrega dos pedidos e comunicações.
          </p>

          <form className="mt-8 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input id="nome" {...form.register("nome")} />
              {form.formState.errors.nome && (
                <p className="text-xs text-primary">
                  {form.formState.errors.nome.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
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
              <Label htmlFor="endereco">Endereço</Label>
              <Input id="endereco" {...form.register("endereco")} />
              {form.formState.errors.endereco && (
                <p className="text-xs text-primary">
                  {form.formState.errors.endereco.message}
                </p>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input id="cidade" {...form.register("cidade")} />
                {form.formState.errors.cidade && (
                  <p className="text-xs text-primary">
                    {form.formState.errors.cidade.message}
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
            </div>

            <Button
              type="submit"
              className="w-full justify-center"
              disabled={loading || form.formState.isSubmitting}
            >
              Salvar alterações
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
