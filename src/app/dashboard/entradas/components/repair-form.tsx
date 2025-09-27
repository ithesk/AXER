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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { addRepair } from "@/services/repairs";
import { useState, useEffect } from "react";
import { Loader2, ArrowLeft, ChevronsUpDown, Check } from "lucide-react";
import { getDeviceData, DeviceData } from "@/services/devices";
import { cn } from "@/lib/utils";

const repairFormSchema = z.object({
  customer: z.string().min(2, { message: "El nombre del cliente debe tener al menos 2 caracteres." }),
  deviceType: z.enum(["Celular", "Tablet", "Reloj", "Laptop"], {
    errorMap: () => ({ message: "Por favor seleccione un tipo de equipo." }),
  }),
  device: z.string({ required_error: "Debe seleccionar un equipo." }),
  problemDescription: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres." }),
  imeiOrSn: z.string().optional(),
  password: z.string().optional(),
  technician: z.string().optional(),
});

type RepairFormValues = z.infer<typeof repairFormSchema>;

type DeviceOption = {
  label: string;
  value: string;
};

// Mock customer data, in a real app this would come from a service/API
const customers = [
  { value: "John Doe", label: "John Doe" },
  { value: "Jane Smith", label: "Jane Smith" },
  { value: "Peter Jones", label: "Peter Jones" },
  { value: "Mary Johnson", label: "Mary Johnson" },
  { value: "David Williams", label: "David Williams" },
];


export default function RepairForm() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);
  const [deviceOptions, setDeviceOptions] = useState<DeviceOption[]>([]);
  const [devicePopoverOpen, setDevicePopoverOpen] = useState(false);
  const [customerPopoverOpen, setCustomerPopoverOpen] = useState(false);


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
    mode: "onChange",
  });

  const selectedDeviceType = form.watch("deviceType");

  useEffect(() => {
    if (selectedDeviceType && deviceData) {
      const options = deviceData[selectedDeviceType].brands.flatMap(brand =>
        brand.models.map(model => ({
          label: `${brand.name} ${model}`,
          value: `${brand.name} ${model}`,
        }))
      );
      setDeviceOptions(options);
      form.setValue("device", ""); // Reset device selection
    }
  }, [selectedDeviceType, deviceData, form]);

  async function onSubmit(data: RepairFormValues) {
    setLoading(true);
    try {
      await addRepair(data);
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
    const fieldsToValidate: (keyof RepairFormValues)[] = step === 1 ? ['deviceType', 'customer'] : ['device', 'problemDescription'];
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
                name="customer"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Nombre del Cliente</FormLabel>
                    <Popover open={customerPopoverOpen} onOpenChange={setCustomerPopoverOpen}>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "w-full justify-between",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    {field.value || "Seleccione o cree un cliente"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                                <CommandInput 
                                    placeholder="Buscar cliente..." 
                                    onValueChange={(currentValue) => {
                                        if (!customers.some(c => c.value.toLowerCase() === currentValue.toLowerCase())) {
                                            form.setValue("customer", currentValue)
                                        }
                                    }}
                                />
                                <CommandList>
                                    <CommandEmpty>
                                        <Button 
                                            variant="ghost" 
                                            className="w-full text-left justify-start"
                                            onClick={() => {
                                                // Value is already set by onValueChange
                                                setCustomerPopoverOpen(false);
                                            }}
                                        >
                                            Crear nuevo cliente: "{form.getValues("customer")}"
                                        </Button>
                                    </CommandEmpty>
                                    <CommandGroup>
                                        {customers.map((customer) => (
                                            <CommandItem
                                                value={customer.label}
                                                key={customer.value}
                                                onSelect={() => {
                                                    form.setValue("customer", customer.value);
                                                    setCustomerPopoverOpen(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        customer.value === field.value
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                {customer.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <FormField
                control={form.control}
                name="device"
                render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>Equipo</FormLabel>
                    <Popover open={devicePopoverOpen} onOpenChange={setDevicePopoverOpen}>
                    <PopoverTrigger asChild>
                        <FormControl>
                        <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                            )}
                        >
                            {field.value
                            ? deviceOptions.find(
                                (option) => option.value === field.value
                                )?.label
                            : "Seleccione un equipo"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                        <CommandInput placeholder="Buscar equipo..." />
                        <CommandList>
                            <CommandEmpty>No se encontró el equipo.</CommandEmpty>
                            <CommandGroup>
                            {deviceOptions.map((option) => (
                                <CommandItem
                                value={option.label}
                                key={option.value}
                                onSelect={() => {
                                    form.setValue("device", option.value);
                                    setDevicePopoverOpen(false);
                                }}
                                >
                                <Check
                                    className={cn(
                                    "mr-2 h-4 w-4",
                                    option.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                />
                                {option.label}
                                </CommandItem>
                            ))}
                            </CommandGroup>
                        </CommandList>
                        </Command>
                    </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
                )}
            />

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
            <div className="grid md:grid-cols-2 gap-8">
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
              <Button type="button" onClick={nextStep} disabled={!selectedDeviceType || !form.getValues("customer")}>
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
