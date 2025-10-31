"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, Loader2, Send } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ModalTermos } from "@/components/ModalTermos";
import { normalizePhone as normalizePhoneNumber } from "@/lib/whatsapp";

const preferenciasOptions = [
  "Sem lactose",
  "Sem gluten",
  "Low carb",
  "Vegetariana",
  "Vegana",
  "Alta proteina",
  "Detox",
];

const steps = ["Informacoes pessoais", "Preferencias", "Plano nutricional"];

const digitsOnly = (value?: string | null) =>
  value ? value.replace(/\D/g, "") : "";

const formatPhone = (value?: string | null) => {
  const digits = digitsOnly(value);
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  if (digits.length > 2) {
    return `${digits.slice(0, 2)} ${digits.slice(2)}`;
  }
  return digits;
};

const formatCep = (value?: string | null) => {
  const digits = digitsOnly(value);
  if (digits.length === 8) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  return digits;
};

const normalizeCep = (value?: string) => {
  const digits = digitsOnly(value);
  return digits.length ? digits : undefined;
};

const formSchema = z.object({
  nome: z.string().min(3, "Informe o nome completo."),
  email: z.string().email("E-mail invalido.").optional().or(z.literal("")),
  telefone: z
    .string()
    .min(10, "Informe o telefone com DDD.")
    .superRefine((value, ctx) => {
      const digits = value.replace(/\D/g, "");
      if (digits.length < 10 || digits.length > 11) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Telefone invalido.",
        });
      }
    }),
  endereco: z.string().min(5, "Informe o endereco completo."),
  cidade: z.string().optional(),
  cep: z.string().optional(),
  formaPagamento: z.string().min(2, "Selecione uma forma de pagamento."),
  frequencia: z.string().min(3, "Informe a frequencia."),
  preferencias: z
    .array(z.string())
    .min(1, "Escolha ao menos uma preferencia."),
  objetivos: z.string().min(10, "Descreva seus objetivos nutricionais."),
  observacoes: z.string().optional(),
  arquivoPlano: z.any().optional(),
  aceitouTermos: z
    .boolean()
    .refine((value) => value === true, {
      message: "Aceite os Termos e a Politica de Privacidade para continuar.",
    }),
});

type FormValues = z.infer<typeof formSchema>;

type FormPersonalizadoProps = {
  onSuccess?: () => void;
};

export function FormPersonalizado({ onSuccess }: FormPersonalizadoProps) {
  const { cliente, user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaults = useMemo(
    () => ({
      nome: cliente?.nome?.trim() ?? "",
      email: cliente?.email?.trim() ?? user?.email?.trim() ?? "",
      telefone: formatPhone(cliente?.telefone),
      endereco: cliente?.endereco?.trim() ?? "",
      cidade: cliente?.cidade?.trim() ?? "",
      cep: formatCep(cliente?.cep),
      formaPagamento: "PIX",
      frequencia: "Semanal",
      preferencias: [] as string[],
      objetivos: "",
      observacoes: "",
      arquivoPlano: undefined,
      aceitouTermos: cliente?.aceite_termos ?? false,
    }),
    [cliente, user],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaults,
  });

  const termsAlreadyAccepted = defaults.aceitouTermos;

  useEffect(() => {
    const current = form.getValues();
    const merged: FormValues = {
      ...current,
      nome: current.nome || defaults.nome,
      email: current.email || defaults.email,
      telefone: current.telefone || defaults.telefone,
      endereco: current.endereco || defaults.endereco,
      cidade: current.cidade || defaults.cidade,
      cep: current.cep || defaults.cep,
      formaPagamento: current.formaPagamento || defaults.formaPagamento,
      frequencia: current.frequencia || defaults.frequencia,
      preferencias: current.preferencias,
      objetivos: current.objetivos,
      observacoes: current.observacoes,
      arquivoPlano: current.arquivoPlano,
      aceitouTermos: defaults.aceitouTermos
        ? true
        : Boolean(current.aceitouTermos),
    };

    const shouldReset =
      merged.nome !== current.nome ||
      merged.email !== current.email ||
      merged.telefone !== current.telefone ||
      merged.endereco !== current.endereco ||
      merged.cidade !== current.cidade ||
      merged.cep !== current.cep ||
      merged.formaPagamento !== current.formaPagamento ||
      merged.frequencia !== current.frequencia ||
      merged.aceitouTermos !== current.aceitouTermos;

    if (shouldReset) {
      form.reset(merged);
    }
  }, [defaults, form]);

  const { errors } = form.formState;

  const validateStep = async () => {
    const fieldsByStep: (keyof FormValues)[][] = [
      ["nome", "telefone", "endereco", "formaPagamento"],
      ["frequencia", "preferencias"],
      ["objetivos", "aceitouTermos"],
    ];
    return form.trigger(fieldsByStep[currentStep]);
  };

  const nextStep = async () => {
    const isValid = await validateStep();
    if (!isValid) return;
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const previousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="nome">Nome completo *</Label>
              <Input id="nome" {...form.register("nome")} />
              {errors.nome && (
                <p className="mt-1 text-xs text-primary">
                  {errors.nome.message as string}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" {...form.register("email")} />
              {errors.email && (
                <p className="mt-1 text-xs text-primary">
                  {errors.email.message as string}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="telefone">Telefone/WhatsApp *</Label>
              <Input
                id="telefone"
                placeholder="(51) 99999-0000"
                {...form.register("telefone")}
              />
              {errors.telefone && (
                <p className="mt-1 text-xs text-primary">
                  {errors.telefone.message as string}
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="endereco">Endereco completo *</Label>
              <Input id="endereco" {...form.register("endereco")} />
              {errors.endereco && (
                <p className="mt-1 text-xs text-primary">
                  {errors.endereco.message as string}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" {...form.register("cidade")} />
            </div>
            <div>
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                placeholder="90000-000"
                {...form.register("cep")}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="formaPagamento">
                Forma de pagamento preferida *
              </Label>
              <select
                id="formaPagamento"
                className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                {...form.register("formaPagamento")}
              >
                <option value="PIX">PIX</option>
                <option value="Cartao de credito">Cartao de credito</option>
                <option value="Cartao de debito">Cartao de debito</option>
                <option value="Boleto">Boleto</option>
              </select>
              {errors.formaPagamento && (
                <p className="mt-1 text-xs text-primary">
                  {errors.formaPagamento.message as string}
                </p>
              )}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="frequencia">Frequencia desejada *</Label>
              <select
                id="frequencia"
                className="mt-2 h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                {...form.register("frequencia")}
              >
                <option value="Semanal">Semanal</option>
                <option value="Quinzenal">Quinzenal</option>
                <option value="Mensal">Mensal</option>
              </select>
              {errors.frequencia && (
                <p className="mt-1 text-xs text-primary">
                  {errors.frequencia.message as string}
                </p>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Preferencias alimentares *
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {preferenciasOptions.map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 text-sm text-muted-foreground shadow-sm transition hover:border-primary/60 hover:text-foreground"
                  >
                    <Checkbox
                      checked={form.watch("preferencias").includes(item)}
                      onCheckedChange={(checked) => {
                        const current = form.getValues("preferencias");
                        form.setValue(
                          "preferencias",
                          checked
                            ? [...current, item]
                            : current.filter((pref) => pref !== item),
                          { shouldValidate: true },
                        );
                      }}
                    />
                    {item}
                  </label>
                ))}
              </div>
              {errors.preferencias && (
                <p className="mt-1 text-xs text-primary">
                  {errors.preferencias.message as string}
                </p>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="objetivos">Objetivos nutricionais *</Label>
              <Textarea
                id="objetivos"
                placeholder="Conte sobre seus objetivos, rotina e desafios..."
                {...form.register("objetivos")}
              />
              {errors.objetivos && (
                <p className="mt-1 text-xs text-primary">
                  {errors.objetivos.message as string}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="observacoes">Observacoes adicionais</Label>
              <Textarea
                id="observacoes"
                placeholder="Restricoes, horarios, detalhes extras..."
                {...form.register("observacoes")}
              />
            </div>
            <div>
              <Label htmlFor="arquivoPlano">
                Upload do plano nutricional (PDF ou imagem)
              </Label>
              <Input
                id="arquivoPlano"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                {...form.register("arquivoPlano")}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Opcional. Tamanho maximo recomendado de 2 MB.
              </p>
            </div>
            {termsAlreadyAccepted ? null : (
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
                    Confirmo que li e aceito os Termos e a Politica de
                    Privacidade.
                  </Label>{" "}
                  <ModalTermos />
                  {errors.aceitouTermos && (
                    <p className="mt-1 text-xs text-primary">
                      {errors.aceitouTermos.message as string}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (values: FormValues) => {
    setStatus("loading");
    setErrorMessage(null);

    try {
      let attachment:
        | {
            name?: string;
            type?: string;
            data: string;
          }
        | undefined;
      const fileList = values.arquivoPlano as FileList | undefined;
      if (fileList && fileList.length > 0) {
        const file = fileList[0];
        attachment = {
          name: file.name,
          type: file.type || "application/octet-stream",
          data: await fileToBase64(file),
        };
      }

      const response = await fetch("/api/personalizados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            nome: values.nome.trim(),
            email: values.email?.trim() || undefined,
            telefone: normalizePhoneNumber(values.telefone),
            endereco: values.endereco.trim(),
            cidade: values.cidade?.trim() || undefined,
            cep: normalizeCep(values.cep),
            formaPagamento: values.formaPagamento,
          },
          plano: {
            frequencia: values.frequencia,
            preferencias: values.preferencias,
            objetivos: values.objetivos,
            observacoes: values.observacoes,
            valorEstimado: undefined,
            arquivoPlano: attachment,
          },
          termsAccepted: termsAlreadyAccepted ? true : values.aceitouTermos,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message ?? "Erro ao enviar plano personalizado.");
      }

      setStatus("success");
      onSuccess?.();
      window.open(data.whatsappUrl, "_blank");
      router.push("/");
      form.reset({
        ...defaults,
        preferencias: [],
        objetivos: "",
        observacoes: "",
        arquivoPlano: undefined,
        aceitouTermos: defaults.aceitouTermos,
      });
      setCurrentStep(0);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Falha ao cadastrar plano.",
      );
    }
  };

  const canSubmit = currentStep === steps.length - 1;

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit(handleSubmit)}
      noValidate
    >
      <div className="flex items-center gap-3">
        {steps.map((label, index) => (
          <div key={label} className="flex flex-1 flex-col items-start gap-1">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                index <= currentStep
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {index + 1}
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {label}
            </span>
          </div>
        ))}
      </div>

      {renderStep()}

      {errorMessage && (
        <p className="text-sm font-semibold text-primary">{errorMessage}</p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button
          type="button"
          variant="secondary"
          className="gap-2 sm:max-w-[180px]"
          disabled={currentStep === 0}
          onClick={previousStep}
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar
        </Button>
        {canSubmit ? (
          <Button
            type="submit"
            className="w-full justify-center gap-2 sm:max-w-[280px]"
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Enviar plano personalizado
              </>
            )}
          </Button>
        ) : (
          <Button
            type="button"
            className="w-full justify-center gap-2 sm:max-w-[280px]"
            onClick={nextStep}
          >
            Avancar
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  );
}

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result);
      } else {
        reject(new Error("Falha ao ler arquivo."));
      }
    };
    reader.onerror = () => reject(new Error("Falha ao ler arquivo."));
    reader.readAsDataURL(file);
  });
}

