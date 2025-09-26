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
import { addRepair } from "@/services/repairs";
import { useState, useEffect } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import { getDeviceData, DeviceData } from "@/services/devices";
import { cn } from "@/lib/utils";

const repairFormSchema = z.object({
  customer: z.string().min(2, { message: "El nombre del cliente debe tener al menos 2 caracteres." }),
  deviceType: z.enum(["Celular", "Tablet", "Reloj", "Laptop"], {
    errorMap: () => ({ message: "Por favor seleccione un tipo de equipo." }),
  }),
  brand: z.string().min(1, { message: "Por favor seleccione una marca." }),
  model: z.string().min(1, { message: "Por favor seleccione un modelo." }),
  problemDescription: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres." }),
  imeiOrSn: z.string().optional(),
  password: z.string().optional(),
  technician: z.string().optional(),
}).transform(data => ({
    ...data,
    device: `${data.brand} ${data.model}`,
}));

type RepairFormValues = z.infer<typeof repairFormSchema>;

export default function RepairForm() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function loadDeviceData() {
      const data = await getDeviceData();
      setDeviceData(data);
    }
    loadDeviceData();
  }, []);

  const form = useForm<RepairFormValues>({
    resolver: zodResolver(repairFormSchema),
    defaultValues: {
      customer: "",
      problemDescription: "",
      imeiOrSn: "",
      password: "",
      technician: "No Asignado",
    },
    mode: "onChange"
  });

  const selectedDeviceType = form.watch("deviceType");
  const selectedBrand = form.watch("brand");
  
  const brands = selectedDeviceType ? deviceData?.[selectedDeviceType]?.brands || [] : [];
  const models = selectedBrand ? brands.find(b => b.name === selectedBrand)?.models || [] : [];

   useEffect(() => {
    if (selectedDeviceType) {
      form.setValue("brand", "");
      form.setValue("model", "");
    }
  }, [selectedDeviceType, form.setValue]);
  
   useEffect(() => {
    if (selectedBrand) {
      form.setValue("model", "");
    }
  }, [selectedBrand, form.setValue]);


  async function onSubmit(data: RepairFormValues) {
    setLoading(true);
    try {
      // The `device` field is created by the transform function in the schema
      const { brand, model, ...repairData } = data;
      await addRepair(repairData);
      toast({
        title: "Entrada Registrada",
        description: "La nueva orden de reparación ha sido creada exitosamente.",
      });
      router.push("/dashboard/entradas");
      router.refresh();
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

  const nextStep = async () => {
    let fieldsToValidate: (keyof RepairFormValues)[] = [];
    if (step === 1) {
        fieldsToValidate = ['deviceType'];
    }
    
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {step === 1 && (
            <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
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
                            <Input placeholder="(Opcional)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
            </div>
        )}

        {step === 2 && (
             <div className="space-y-8">
                 <div className="grid md:grid-cols-3 gap-8">
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marca</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedDeviceType}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={selectedDeviceType ? "Seleccione una marca" : "Seleccione un tipo primero"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {brands.map(brand => (
                                <SelectItem key={brand.name} value={brand.name}>{brand.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Modelo</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedBrand}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={selectedBrand ? "Seleccione un modelo" : "Seleccione una marca primero"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                               {models.map(model => (
                                <SelectItem key={model} value={model}>{model}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
        )}

        <div className="flex justify-between">
            {step > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Anterior
                </Button>
            )}
            <div className={cn(step === 1 && "w-full flex justify-end")}>
                {step < 2 ? (
                    <Button type="button" onClick={nextStep} disabled={!selectedDeviceType}>
                        Siguiente
                    </Button>
                ) : (
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {loading ? "Guardando..." : "Registrar Entrada"}
                    </Button>
                )}
            </div>
        </div>
      </form>
    </Form>
  );
}
