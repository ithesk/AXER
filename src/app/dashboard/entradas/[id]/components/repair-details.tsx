
"use client";

import { useState, useEffect } from "react";
import { Repair, RepairStatus, updateRepair, FunctionalityTestResult, FunctionalityTestResults, EvaluationEntry } from "@/services/repairs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Smartphone, Wrench, Calendar, KeyRound, HardDrive, FileText, ClipboardPenLine, ListChecks, Check, ChevronsUpDown, Loader2, Pencil, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import RepairStatusProgress from "../../components/repair-status-progress";
import { Badge, BadgeVariant } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { getDeviceData, DeviceData } from "@/services/devices";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import FunctionalityTestForm from "../../components/functionality-test-form";
import { Label } from "@/components/ui/label";

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
    const [functionalityTestOpen, setFunctionalityTestOpen] = useState(false);

    const [formattedEntryDate, setFormattedEntryDate] = useState("");
    const [isClient, setIsClient] = useState(false);
    const { toast } = useToast();

    const isTechnicianAssigned = repair.technician !== "No Asignado";

    useEffect(() => {
        setIsClient(true);
        setFormattedEntryDate(new Date(repair.entryDate).toLocaleString());
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

    const handleFunctionalityTestSave = async (results: FunctionalityTestResults) => {
        await handleSave('functionalityTest', results, "La prueba de funciones ha sido actualizada.");
        setFunctionalityTestOpen(false);
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
            const updatedRepair = await updateRepair(repair.id, { evaluation: updatedEntries });
            setRepair(updatedRepair);
            setNewEvaluationNote("");
            toast({
                title: "Nota Añadida",
                description: "La bitácora de evaluación ha sido actualizada.",
            });
        } catch (error) {
            console.error("Failed to add evaluation note:", error);
            toast({
                title: "Error",
                description: "No se pudo añadir la nota de evaluación.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const getStatusVariant = (status: FunctionalityTestResult): BadgeVariant => {
        switch (status) {
            case "ok": return "default";
            case "fail": return "destructive";
            case "na": return "secondary";
            default: return "outline";
        }
    }

    const getStatusLabel = (status: FunctionalityTestResult): string => {
        switch(status) {
            case "ok": return "OK";
            case "fail": return "Falla";
            case "na": return "N/A";
        }
    }

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
                                                    <p className="text-xs text-muted-foreground">{isClient ? new Date(entry.date).toLocaleString() : ''}</p>
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


                        {repair.functionalityTest && (
                            <Card>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="font-headline flex items-center gap-2">
                                            <ListChecks className="h-5 w-5" />
                                            Prueba de Funciones
                                        </CardTitle>
                                        <Button variant="outline" size="sm" onClick={() => setFunctionalityTestOpen(true)}>
                                            <Pencil className="mr-2 h-3 w-3" />
                                            Editar
                                        </Button>
                                    </div>
                                    <CardDescription>Resultados de la prueba de funciones realizada al momento del ingreso.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-sm">
                                        {functionalityTestItems.map(item => {
                                            const result = repair.functionalityTest![item.name];
                                            return (
                                                <div key={item.name} className="flex items-center justify-between">
                                                    <span>{item.label}</span>
                                                    <Badge variant={getStatusVariant(result)} className="capitalize w-14 justify-center">{getStatusLabel(result)}</Badge>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    {repair.functionalityTest.other && (
                                        <div className="pt-2">
                                            <h4 className="text-sm font-medium">Otras Observaciones:</h4>
                                            <p className="text-sm text-muted-foreground">{repair.functionalityTest.other}</p>
                                        </div>
                                    )}
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
                                                                onSelect={() => handleSave('technician', tech)}
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
                                    <Input defaultValue={repair.device} onBlur={(e) => handleSave('device', e.target.value)} disabled={isLoading} />
                                </div>
                                 <div className="space-y-2">
                                    <Label>Tipo de Equipo</Label>
                                    <Select defaultValue={repair.deviceType} onValueChange={(value) => handleSave('deviceType', value)} disabled={isLoading}>
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
                                    <Input defaultValue={repair.imeiOrSn} onBlur={(e) => handleSave('imeiOrSn', e.target.value)} disabled={isLoading} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Contraseña del Equipo</Label>
                                    <Input defaultValue={repair.password} onBlur={(e) => handleSave('password', e.target.value)} disabled={isLoading} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <Dialog open={functionalityTestOpen} onOpenChange={setFunctionalityTestOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Editar Prueba de Funciones</DialogTitle>
                        <DialogDescription>
                            Modifique el estado de cada función según sea necesario.
                        </DialogDescription>
                    </DialogHeader>
                    <FunctionalityTestForm 
                        initialData={repair.functionalityTest}
                        onSave={handleFunctionalityTestSave}
                        onCancel={() => setFunctionalityTestOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}

    
