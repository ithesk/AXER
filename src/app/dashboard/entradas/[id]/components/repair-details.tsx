
"use client";

import { useState, useEffect } from "react";
import { Repair, RepairStatus, updateRepair, FunctionalityTestResult, FunctionalityTestResults, EvaluationEntry, RepairQuote, RepairPart } from "@/services/repairs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Smartphone, Wrench, Calendar, KeyRound, HardDrive, FileText, ClipboardPenLine, ListChecks, Check, ChevronsUpDown, Loader2, Pencil, MessageSquarePlus, DollarSign, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import RepairStatusProgress from "../../components/repair-status-progress";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const functionalityTestItems: { name: keyof Omit<import("@/services/repairs").FunctionalityTestResults, 'other'>; label: string }[] = [
    { name: "cameraFront", label: "Cámara Frontal" },
    { name: "cameraBack", label: "Cámara Trasera" },
    { name: "chargingPort", label: "Puerto de Carga" },
    { name: "screen", label: "Pantalla (Brillo/Colores)" },
    { name: "touch", label: "Táctil" },
    { name: "buttons", label: "Botones (Volumen/Encendido)" },
    { name: "earpiece", label: "Altavoz Auricular" },
    { name: "speaker", label: "Altavoz Principal" },
    { name: "microphone", label: "Micrófono" },
    { name: "wifi", label: "Wi-Fi / Red" },
    { name: "biometrics", label: "Face ID / Lector de Huella" },
];

const partFormSchema = z.object({
  name: z.string().min(3, "El nombre de la pieza es requerido."),
  price: z.coerce.number().min(0, "El precio no puede ser negativo."),
});

type PartFormValues = z.infer<typeof partFormSchema>;


const availableTechnicians = ["David Williams", "Juan Perez", "Maria Rodriguez", "No Asignado"];
const repairStatuses: RepairStatus[] = ["Cotización", "Confirmado", "En Reparación", "Reparado", "Entregado"];

const nextStatusMap: Partial<Record<RepairStatus, RepairStatus>> = {
    "Cotización": "Confirmado",
    "Confirmado": "En Reparación",
    "En Reparación": "Reparado",
    "Reparado": "Entregado",
};

const nextStatusLabels: Partial<Record<RepairStatus, string>> = {
    "Cotización": "Confirmar Reparación",
    "Confirmado": "Iniciar Reparación",
    "En Reparación": "Marcar como Reparado",
    "Reparado": "Marcar como Entregado",
};

interface RepairDetailsProps {
    initialRepair: Repair;
}

export default function RepairDetails({ initialRepair }: RepairDetailsProps) {
    const [repair, setRepair] = useState(initialRepair);
    const [isEditingProblem, setIsEditingProblem] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [problemDescription, setProblemDescription] = useState(repair.problemDescription || "");
    const [newEvaluationNote, setNewEvaluationNote] = useState("");

    const [technicianPopoverOpen, setTechnicianPopoverOpen] = useState(false);
    const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
    const [isEditingLabor, setIsEditingLabor] = useState(false);
    const [laborCost, setLaborCost] = useState(repair.quote?.labor || 0);

    const [formattedEntryDate, setFormattedEntryDate] = useState("");
    const [isClient, setIsClient] = useState(false);
    const { toast } = useToast();

    const isTechnicianAssigned = repair.technician !== "No Asignado";

    const partForm = useForm<PartFormValues>({
        resolver: zodResolver(partFormSchema),
        defaultValues: { name: "", price: 0 },
    });

    useEffect(() => {
        setIsClient(true);
        if (repair.entryDate) {
            setFormattedEntryDate(new Date(repair.entryDate).toLocaleString());
        }
    }, [repair.entryDate]);
    
    const handleSave = async (field: keyof Repair, value: any, successMessage?: string) => {
        setIsLoading(true);
        try {
            const updatedRepair = await updateRepair(repair.id, { [field]: value });
            setRepair(updatedRepair);
            toast({
                title: "Actualización Exitosa",
                description: successMessage || `El campo ha sido actualizado.`,
            });
            // Reset editing states
            if (field === "problemDescription") setIsEditingProblem(false);
            if (field === "technician") setTechnicianPopoverOpen(false);
            
        } catch (error) {
            console.error("Failed to update repair:", error);
            toast({
                title: "Error",
                description: "No se pudo actualizar la orden de reparación.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleFunctionalityTestUpdate = async (item: keyof FunctionalityTestResults, value: FunctionalityTestResult | string) => {
        const currentTest = repair.functionalityTest || {} as FunctionalityTestResults;
        const updatedTest = { ...currentTest, [item]: value };
        await handleSave('functionalityTest', updatedTest, "La prueba de funciones ha sido actualizada.");
    }

    const handleAddEvaluationNote = async () => {
        if (!newEvaluationNote.trim() || !isTechnicianAssigned) return;
        setIsLoading(true);
        try {
            const newEntry: EvaluationEntry = {
                note: newEvaluationNote,
                author: repair.technician,
                date: new Date().toISOString(),
            };
            const updatedEntries = [...(repair.evaluation || []), newEntry];
            await handleSave('evaluation', updatedEntries, "La bitácora de evaluación ha sido actualizada.");
            setNewEvaluationNote("");
        } catch (error) {
            console.error("Failed to add evaluation note:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuoteUpdate = async (updatedQuote: RepairQuote) => {
        await handleSave('quote', updatedQuote);
    }

    const onPartSubmit = async (values: PartFormValues) => {
        const newPart: RepairPart = {
            id: `part-${Date.now()}`,
            ...values
        };
        const currentQuote = repair.quote || { parts: [], labor: 0, total: 0 };
        const updatedParts = [...currentQuote.parts, newPart];
        const newTotal = updatedParts.reduce((sum, part) => sum + part.price, 0) + currentQuote.labor;
        
        await handleQuoteUpdate({
            ...currentQuote,
            parts: updatedParts,
            total: newTotal,
        });

        partForm.reset();
        setQuoteDialogOpen(false);
    };

     const handleLaborSave = async () => {
        const currentQuote = repair.quote || { parts: [], labor: 0, total: 0 };
        const newTotal = currentQuote.parts.reduce((sum, part) => sum + part.price, 0) + laborCost;

        await handleQuoteUpdate({
            ...currentQuote,
            labor: laborCost,
            total: newTotal,
        });
        setIsEditingLabor(false);
    };

    const handleStatusUpdate = () => {
        const nextStatus = nextStatusMap[repair.status];
        if (nextStatus) {
            handleSave('status', nextStatus, `Estado actualizado a "${nextStatus}"`);
        }
    };

    const nextStatusLabel = nextStatusLabels[repair.status];

    return (
        <>
            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="font-headline">Progreso de la Reparación</CardTitle>
                            {nextStatusLabel && (
                                <Button onClick={handleStatusUpdate} disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {nextStatusLabel}
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <RepairStatusProgress currentStatus={repair.status} />
                    </CardContent>
                </Card>

                <div className="grid lg:grid-cols-3 gap-6 items-start">
                    <div className="lg:col-span-2 grid gap-6">
                        <Card>
                             <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="font-headline flex items-center gap-2"><DollarSign className="h-5 w-5" /> Cotización</CardTitle>
                                    <Button variant="outline" size="sm" onClick={() => setQuoteDialogOpen(true)}><PlusCircle className="mr-2 h-4 w-4" /> Añadir Pieza</Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {repair.quote && repair.quote.parts.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Pieza</TableHead>
                                                <TableHead className="text-right">Precio</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {repair.quote.parts.map(part => (
                                                <TableRow key={part.id}>
                                                    <TableCell>{part.name}</TableCell>
                                                    <TableCell className="text-right">${part.price.toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">No se han añadido piezas a la cotización.</p>
                                )}
                            </CardContent>
                            {repair.quote && (
                                <CardFooter className="flex-col items-start gap-2 border-t pt-4">
                                     <div className="flex justify-between w-full">
                                        <span className="text-muted-foreground">Mano de Obra</span>
                                        {isEditingLabor ? (
                                             <div className="flex items-center gap-2">
                                                <Input 
                                                    type="number" 
                                                    value={laborCost} 
                                                    onChange={(e) => setLaborCost(Number(e.target.value))}
                                                    className="h-8 w-24 text-right"
                                                />
                                                <Button size="sm" onClick={handleLaborSave} disabled={isLoading}>Guardar</Button>
                                                <Button size="sm" variant="ghost" onClick={() => { setIsEditingLabor(false); setLaborCost(repair.quote?.labor || 0);}}>Cancelar</Button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span>${repair.quote.labor.toFixed(2)}</span>
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsEditingLabor(true)}><Pencil className="h-3 w-3" /></Button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-between w-full font-bold">
                                        <span>Total</span>
                                        <span>${repair.quote.total.toFixed(2)}</span>
                                    </div>
                                </CardFooter>
                            )}
                        </Card>
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="font-headline flex items-center gap-2"><FileText className="h-5 w-5" /> Descripción del Problema</CardTitle>
                                    {!isEditingProblem && <Button variant="outline" size="sm" onClick={() => setIsEditingProblem(true)}>Editar</Button>}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {isEditingProblem ? (
                                     <div className="space-y-2">
                                        <Textarea value={problemDescription} onChange={(e) => setProblemDescription(e.target.value)} rows={3}/>
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => { setIsEditingProblem(false); setProblemDescription(repair.problemDescription || ""); }}>Cancelar</Button>
                                            <Button size="sm" onClick={() => handleSave('problemDescription', problemDescription)} disabled={isLoading}>
                                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Guardar
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">{repair.problemDescription}</p>
                                )}
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline flex items-center gap-2">
                                    <ClipboardPenLine className="h-5 w-5" /> Bitácora de Evaluación
                                </CardTitle>
                                <CardDescription>Registro cronológico del proceso de diagnóstico y reparación.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-4 max-h-72 overflow-y-auto pr-4 border rounded-lg p-4">
                                    {repair.evaluation && repair.evaluation.length > 0 ? (
                                        repair.evaluation.map((entry, index) => (
                                            <div key={index} className="flex flex-col">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-xs font-semibold">{entry.author}</p>
                                                    {isClient && <p className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleString()}</p>}
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1">{entry.note}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground text-center py-4">No hay notas en la bitácora aún.</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <Textarea 
                                            value={newEvaluationNote}
                                            onChange={(e) => setNewEvaluationNote(e.target.value)}
                                            placeholder={isTechnicianAssigned ? "Añadir una nueva nota a la bitácora..." : "Asigne un técnico para añadir notas."}
                                            rows={2}
                                            className="flex-1"
                                            disabled={!isTechnicianAssigned || isLoading}
                                        />
                                        <Button onClick={handleAddEvaluationNote} disabled={isLoading || !newEvaluationNote.trim() || !isTechnicianAssigned} size="icon" className="shrink-0">
                                            <MessageSquarePlus className="h-5 w-5"/>
                                            <span className="sr-only">Añadir Nota</span>
                                        </Button>
                                    </div>
                                    {!isTechnicianAssigned && (
                                        <p className="text-xs text-muted-foreground">Debe asignar un técnico para poder registrar notas en la bitácora.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>


                        {repair.functionalityTest ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="font-headline flex items-center gap-2">
                                        <ListChecks className="h-5 w-5" />
                                        Prueba de Funciones
                                    </CardTitle>
                                    <CardDescription>Resultados de la prueba de funciones. Los cambios se guardan automáticamente.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     <div className="space-y-4">
                                        {functionalityTestItems.map(item => (
                                             <div key={item.name} className="flex items-center justify-between rounded-md border p-3">
                                                 <Label className="font-normal flex-1">{item.label}</Label>
                                                 <RadioGroup
                                                     value={repair.functionalityTest?.[item.name] || 'na'}
                                                     onValueChange={(value: FunctionalityTestResult) => handleFunctionalityTestUpdate(item.name, value)}
                                                     className="flex items-center space-x-4"
                                                     disabled={isLoading}
                                                 >
                                                     <FormItem className="flex items-center space-x-2">
                                                         <FormControl>
                                                             <RadioGroupItem value="ok" id={`${item.name}-ok`} />
                                                         </FormControl>
                                                         <Label htmlFor={`${item.name}-ok`} className="font-normal text-green-600">OK</Label>
                                                     </FormItem>
                                                     <FormItem className="flex items-center space-x-2">
                                                         <FormControl>
                                                             <RadioGroupItem value="fail" id={`${item.name}-fail`}/>
                                                         </FormControl>
                                                         <Label htmlFor={`${item.name}-fail`} className="font-normal text-red-600">Falla</Label>
                                                     </FormItem>
                                                     <FormItem className="flex items-center space-x-2">
                                                         <FormControl>
                                                             <RadioGroupItem value="na" id={`${item.name}-na`}/>
                                                         </FormControl>
                                                         <Label htmlFor={`${item.name}-na`} className="font-normal text-muted-foreground">N/A</Label>
                                                     </FormItem>
                                                 </RadioGroup>
                                             </div>
                                        ))}
                                        <div className="space-y-2">
                                            <Label>Otras Observaciones</Label>
                                            <Textarea
                                                defaultValue={repair.functionalityTest.other}
                                                onBlur={(e) => handleFunctionalityTestUpdate('other', e.target.value)}
                                                placeholder="Describa cualquier otra falla o detalle encontrado..."
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                           <Card>
                                <CardHeader>
                                     <CardTitle className="font-headline flex items-center gap-2">
                                        <ListChecks className="h-5 w-5" />
                                        Prueba de Funciones
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground text-center py-4">No se realizó una prueba de funciones al ingresar el equipo.</p>
                                </CardContent>
                           </Card>
                        )}

                    </div>

                    <div className="grid gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline">Información del Equipo</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 text-sm">
                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-muted-foreground">Cliente</p>
                                        <p className="font-medium">{repair.customer}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Wrench className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-muted-foreground">Técnico Asignado</p>
                                        <Popover open={technicianPopoverOpen} onOpenChange={setTechnicianPopoverOpen}>
                                            <PopoverTrigger asChild>
                                                <Button variant="link" role="combobox" aria-expanded={technicianPopoverOpen} className="p-0 font-medium h-auto" disabled={isLoading}>{repair.technician}</Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[200px] p-0">
                                                <Command>
                                                    <CommandGroup>
                                                        {availableTechnicians.map((tech) => (
                                                            <CommandItem
                                                                key={tech}
                                                                onSelect={() => {
                                                                    handleSave('technician', tech, 'Técnico asignado.');
                                                                    setTechnicianPopoverOpen(false);
                                                                }}
                                                            >
                                                                <Check className={cn("mr-2 h-4 w-4", repair.technician === tech ? "opacity-100" : "opacity-0")} />
                                                                {tech}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-muted-foreground">Fecha y Hora de Ingreso</p>
                                        <p className="font-medium">{formattedEntryDate || "Cargando..."}</p>
                                    </div>
                                </div>
                                <hr className="my-2" />
                                <div className="space-y-2">
                                    <Label>Producto a Reparar</Label>
                                    <Input defaultValue={repair.device} onBlur={(e) => handleSave('device', e.target.value, 'Producto actualizado.')} disabled={isLoading} />
                                </div>
                                 <div className="space-y-2">
                                    <Label>Tipo de Equipo</Label>
                                    <Select defaultValue={repair.deviceType} onValueChange={(value) => handleSave('deviceType', value, 'Tipo de equipo actualizado.')} disabled={isLoading}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Celular">Celular</SelectItem>
                                            <SelectItem value="Tablet">Tablet</SelectItem>
                                            <SelectItem value="Reloj">Reloj</SelectItem>
                                            <SelectItem value="Laptop">Laptop</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>IMEI o Número de Serie</Label>
                                    <Input defaultValue={repair.imeiOrSn} onBlur={(e) => handleSave('imeiOrSn', e.target.value, 'IMEI/SN actualizado.')} disabled={isLoading} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Contraseña del Equipo</Label>
                                    <Input defaultValue={repair.password} onBlur={(e) => handleSave('password', e.target.value, 'Contraseña actualizada.')} disabled={isLoading} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

             <Dialog open={quoteDialogOpen} onOpenChange={setQuoteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Añadir Pieza a la Cotización</DialogTitle>
                    </DialogHeader>
                    <Form {...partForm}>
                        <form onSubmit={partForm.handleSubmit(onPartSubmit)} className="space-y-4">
                            <FormField
                                control={partForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre de la Pieza</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: Pantalla iPhone 14" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={partForm.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Precio</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="0.00" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => setQuoteDialogOpen(false)}>Cancelar</Button>
                                <Button type="submit">Añadir Pieza</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );

    