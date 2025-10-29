"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";

import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ModalTermos } from "@/components/ModalTermos";

const formSchema = z.object({
  nome: z.string().min(3, "Informe o nome completo."),
  email: z.string().email("E-mail inválido.").optional().or(z.literal("")),
  telefone: z
    .string()
    .min(10, "Informe o telefone com DDD.")
    .regex(/^\+?\d[\d\s-]{8,}$/, "Telefone inválido."),
  endereco: z.string().min(5, "Informe o endereço completo."),
  cidade: z.string().optional(),
  cep: z.string().optional(),
  formaPagamento: z.string().min(2, "Selecione a forma de pagamento."),
  observacoes: z.string().optional(),
  aceitouTermos: z
    .boolean()
    .refine((value) => value === true, {
      message: "Aceite os Termos e a Política de Privacidade.",
    }),
});

type FormValues = z.infer<typeof formSchema>;

type FormCadastroProps = {
  onSuccess?: () => void;
};

export function FormCadastro({ onSuccess }: FormCadastroProps) {
  const { items, total, clear } = useCart();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      endereco: "",
      cidade: "",
      cep: "",
      formaPagamento: "PIX",
      observacoes: "",
      aceitouTermos: false,
    },
  });

  const disabled = items.length === 0 || status === "loading";

  const onSubmit = async (values: FormValues) => {
    if (!items.length) return;
    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            nome: values.nome,
            email: values.email,
            telefone: values.telefone,
            endereco: values.endereco,
            cidade: values.cidade,
            cep: values.cep,
            formaPagamento: values.formaPagamento,
          },
          order: {
            tipo: "padrao",
            itens: items.map((item) => ({
              productId: item.id,
              name: item.name,
              quantity: item.quantity,
              unitPrice: item.price,
            })),
            valorTotal: total,
            observacoes: values.observacoes,
          },
          termsAccepted: values.aceitouTermos,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message ?? "Erro ao finalizar pedido.");
      }

      setStatus("success");
      clear();
      onSuccess?.();
      window.open(data.whatsappUrl, "_blank");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Falha ao enviar pedido.",
      );
    }
  };

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="nome">Nome completo *</Label>
          <Input id="nome" {...form.register("nome")} />
          {form.formState.errors.nome && (
            <p className="mt-1 text-xs text-primary">
              {form.formState.errors.nome.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" {...form.register("email")} />
          {form.formState.errors.email && (
            <p className="mt-1 text-xs text-primary">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="telefone">Telefone/WhatsApp *</Label>
          <Input id="telefone" placeholder="51 99999-0000" {...form.register("telefone")} />
          {form.formState.errors.telefone && (
            <p className="mt-1 text-xs text-primary">
              {form.formState.errors.telefone.message}
            </p>
          )}
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="endereco">Endereço completo *</Label>
          <Input id="endereco" {...form.register("endereco")} />
          {form.formState.errors.endereco && (
            <p className="mt-1 text-xs text-primary">
              {form.formState.errors.endereco.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="cidade">Cidade</Label>
          <Input id="cidade" {...form.register("cidade")} />
        </div>
        <div>
          <Label htmlFor="cep">CEP</Label>
          <Input id="cep" placeholder="90000-000" {...form.register("cep")} />
        </div>
        <div>
          <Label htmlFor="formaPagamento">Forma de pagamento *</Label>
          <select
            id="formaPagamento"
            className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            {...form.register("formaPagamento")}
          >
            <option value="PIX">PIX</option>
            <option value="Cartao de credito">Cartão de crédito</option>
            <option value="Cartao de debito">Cartão de débito</option>
            <option value="Dinheiro">Dinheiro</option>
          </select>
          {form.formState.errors.formaPagamento && (
            <p className="mt-1 text-xs text-primary">
              {form.formState.errors.formaPagamento.message}
            </p>
          )}
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea
            id="observacoes"
            placeholder="Preferências, alergias, horários..."
            {...form.register("observacoes")}
          />
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl bg-accent/70 p-4">
        <Checkbox
          id="aceitouTermos"
          checked={form.watch("aceitouTermos")}
          onCheckedChange={(checked) =>
            form.setValue("aceitouTermos", Boolean(checked))
          }
        />
        <div className="text-sm leading-relaxed text-muted-foreground">
          <Label
            htmlFor="aceitouTermos"
            className="inline text-sm font-semibold text-foreground"
          >
            Li e aceito os Termos e Condições e a Política de Privacidade.
          </Label>{" "}
          <ModalTermos />
          <div>
            {form.formState.errors.aceitouTermos && (
              <p className="mt-1 text-xs text-primary">
                {form.formState.errors.aceitouTermos.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {errorMessage && (
        <p className="text-sm font-semibold text-primary">{errorMessage}</p>
      )}

      <Button
        type="submit"
        disabled={disabled}
        className="w-full justify-center gap-2"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Finalizar pedido
          </>
        )}
      </Button>
    </form>
  );
}
