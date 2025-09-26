"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { addRepair, Repair } from "@/services/repairs";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const repairFormSchema = z.object({
  customer: z.string().min(2, { message: "El nombre del cliente debe tener al menos 2 caracteres." }),
  device: z.string().min(2, { message: "El nombre del equipo es obligatorio." }),
  deviceType: z.enum(["Celular", "Tablet", "Reloj", "Laptop"], {
    errorMap: () => ({ message: "Por favor seleccione un tipo de equipo." }),
  }),
  problemDescription: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres." }),
  imeiOrSn: z.string().min(5, { message: "El IMEI o S/N debe tener al menos 5 caracteres." }),
  password: z.string().optional(),
  technician: z.string().optional(),
});

type RepairFormValues = z.infer<typeof repairFormSchema>;

export default function RepairForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<RepairFormValues>({
    resolver: zodResolver(repairFormSchema),
    defaultValues: {
      customer: "",
      device: "",
      problemDescription: "",
      imeiOrSn: "",
      password: "",
      technician: "No Asignado",
    },
  });

  async function onSubmit(data: RepairFormValues) {
    setLoading(true);
    try {
      await addRepair(data);
      toast({
        title: "Entrada Registrada",
        description: "La nueva orden de reparación ha sido creada exitosamente.",
      });
      router.push("/dashboard/entradas");
      router.refresh(); // To show the new entry in the table
    } catch (error) {
      console.error("Error creating repair:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la orden de reparación. Inténtelo de nuevo.",
        variant: "destructive",
      });
    } finally {
        setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="customer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Cliente</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="device"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Producto a Reparar</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej: iPhone 14 Pro" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
        </div>
        <div className="grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="deviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Equipo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Celular">Celular</SelectItem>
                      <SelectItem value="Tablet">Tablet</SelectItem>
                      <SelectItem value="Reloj">Reloj</SelectItem>
                      <SelectItem value="Laptop">Laptop</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imeiOrSn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IMEI o Número de Serie</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña del Equipo</FormLabel>
                  <FormControl>
                    <Input placeholder="(Opcional)" {...field} />
                  </FormControl>
                  <FormDescription>Dejar en blanco si no tiene.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <FormField
          control={form.control}
          name="problemDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción del Problema</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ej: La pantalla está rota y la batería no carga..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Guardando..." : "Registrar Entrada"}
            </Button>
        </div>
      </form>
    </Form>
  );
}
