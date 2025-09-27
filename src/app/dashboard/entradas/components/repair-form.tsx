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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { addRepair, FunctionalityTestResults } from "@/services/repairs";
import { useState, useEffect } from "react";
import { Loader2, ArrowLeft, ChevronsUpDown, Check, Wrench } from "lucide-react";
import { getDeviceData, DeviceData } from "@/services/devices";
import { getCustomers, addCustomer, Customer } from "@/services/customers";
import { cn } from "@/lib/utils";
import CustomerForm from "../../customers/components/customer-form";
import { Switch } from "@/components/ui/switch";
import FunctionalityTestForm from "./functionality-test-form";
import { Label } from "@/components/ui/label";

const repairFormSchema = z.object({
  customer: z.string().min(2, { message: "Debe seleccionar o crear un cliente." }),
  deviceType: z.enum(["Celular", "Tablet", "Reloj", "Laptop"], {
    errorMap: () => ({ message: "Por favor seleccione un tipo de equipo." }),
  }),
  device: z.string({ required_error: "Debe seleccionar un equipo." }),
  problemDescription: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres." }),
  imeiOrSn: z.string().optional(),
  password: z.string().optional(),
  technician: z.string().optional(),
  functionalityTest: z.custom<FunctionalityTestResults>().optional(),
});

type RepairFormValues = z.infer<typeof repairFormSchema>;

type DeviceOption = {
  label: string;
  value: string;
};

export default function RepairForm() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);
  const [deviceOptions, setDeviceOptions] = useState<DeviceOption[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [devicePopoverOpen, setDevicePopoverOpen] = useState(false);
  const [customerPopoverOpen, setCustomerPopoverOpen] = useState(false);
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [functionalityTestOpen, setFunctionalityTestOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [deviceIsOn, setDeviceIsOn] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function loadInitialData() {
      const devices = await getDeviceData();
      setDeviceData(devices);
      const fetchedCustomers = await getCustomers();
      setCustomers(fetchedCustomers);
    }
    loadInitialData();
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

  const handleCustomerCreated = async (newCustomer: Customer) => {
    const newCustomerWithId = { ...newCustomer, id: newCustomer.id || "temp-id" };
    setCustomers(prev => [...prev, newCustomerWithId]);
    form.setValue("customer", newCustomer.name);
    setCustomerDialogOpen(false);
    setCustomerPopoverOpen(false);
    toast({
      title: "Cliente Creado",
      description: `${newCustomer.name} ha sido añadido a la lista de clientes.`,
    });
  };

  const handleFunctionalityTestSave = (results: FunctionalityTestResults) => {
    form.setValue("functionalityTest", results);
    setFunctionalityTestOpen(false);
    toast({
      title: "Prueba Guardada",
      description: "Los resultados de la prueba de funciones han sido guardados.",
    });
  }

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
    <Dialog>
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
                                      placeholder="Buscar cliente por nombre o teléfono..." 
                                      onValueChange={(currentValue) => {
                                        setNewCustomerName(currentValue);
                                      }}
                                  />
                                  <CommandList>
                                      <CommandEmpty>
                                        <DialogTrigger asChild>
                                          <Button 
                                            variant="ghost" 
                                            className="w-full text-left justify-start"
                                            onClick={() => setCustomerDialogOpen(true)}
                                          >
                                            Crear nuevo cliente: "{newCustomerName}"
                                          </Button>
                                        </DialogTrigger>
                                      </CommandEmpty>
                                      <CommandGroup>
                                          {customers.map((customer) => (
                                              <CommandItem
                                                  value={`${customer.name} - ${customer.phone}`}
                                                  key={customer.id}
                                                  onSelect={() => {
                                                      form.setValue("customer", customer.name);
                                                      setCustomerPopoverOpen(false);
                                                  }}
                                              >
                                                  <Check
                                                      className={cn(
                                                          "mr-2 h-4 w-4",
                                                          customer.name === field.value
                                                              ? "opacity-100"
                                                              : "opacity-0"
                                                      )}
                                                  />
                                                  <div>
                                                    <p>{customer.name}</p>
                                                    <p className="text-xs text-muted-foreground">{customer.phone}</p>
                                                  </div>
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
              <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div className="space-y-8">
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
                  <div className="space-y-4 rounded-lg border p-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="device-on-switch" checked={deviceIsOn} onCheckedChange={setDeviceIsOn} />
                        <Label htmlFor="device-on-switch">¿El equipo enciende?</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Si el equipo enciende, realice una prueba de funcionalidades para un mejor diagnóstico.
                      </p>
                       <Dialog open={functionalityTestOpen} onOpenChange={setFunctionalityTestOpen}>
                        <DialogTrigger asChild>
                            <Button type="button" disabled={!deviceIsOn} className="w-full">
                                <Wrench className="mr-2 h-4 w-4" />
                                Realizar Prueba de Funciones
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Prueba de Funciones del Equipo</DialogTitle>
                                <DialogDescription>
                                Marque las casillas correspondientes al estado de cada función.
                                </DialogDescription>
                            </DialogHeader>
                            <FunctionalityTestForm 
                                onSave={handleFunctionalityTestSave}
                                onCancel={() => setFunctionalityTestOpen(false)}
                            />
                        </DialogContent>
                       </Dialog>
                      {form.watch("functionalityTest") && (
                        <div className="text-sm text-green-600 flex items-center gap-2">
                          <Check className="h-4 w-4" />
                          <span>Prueba de funciones completada.</span>
                        </div>
                      )}
                  </div>
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
      
      <DialogContent onOpenChange={setCustomerDialogOpen}>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Cliente</DialogTitle>
            <DialogDescription>
              Complete los detalles del nuevo cliente. Nombre y teléfono son obligatorios.
            </DialogDescription>
          </DialogHeader>
          <CustomerForm 
            initialName={newCustomerName}
            onSave={handleCustomerCreated} 
            onCancel={() => setCustomerDialogOpen(false)} 
          />
      </DialogContent>
    </Dialog>
  );
}
