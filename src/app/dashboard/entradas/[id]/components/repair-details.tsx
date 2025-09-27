"use client";

import { useState } from "react";
import { Repair, RepairStatus, updateRepair, FunctionalityTestResult } from "@/services/repairs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Smartphone, Wrench, Calendar, KeyRound, HardDrive, FileText, ClipboardPenLine, ListChecks, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import RepairStatusProgress from "../../components/repair-status-progress";
import { Badge, BadgeVariant } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";

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

interface RepairDetailsProps {
    initialRepair: Repair;
}

export default function RepairDetails({ initialRepair }: RepairDetailsProps) {
    const [repair, setRepair] = useState(initialRepair);
    const [isEditingEvaluation, setIsEditingEvaluation] = useState(false);
    const [evaluation, setEvaluation] = useState(repair.evaluation || "");
    const [isLoading, setIsLoading] = useState(false);
    const [technicianPopoverOpen, setTechnicianPopoverOpen] = useState(false);
    const [statusPopoverOpen, setStatusPopoverOpen] = useState(false);
    const { toast } = useToast();

    const handleSave = async (field: keyof Repair, value: any) => {
        setIsLoading(true);
        try {
            const updatedRepair = await updateRepair(repair.id, { [field]: value });
            setRepair(updatedRepair);
            if(field === "evaluation") setEvaluation(updatedRepair.evaluation || "");
            toast({
                title: "Actualización Exitosa",
                description: `El campo ${field} ha sido actualizado.`,
            });
        } catch (error) {
            console.error("Failed to update repair:", error);
            toast({
                title: "Error",
                description: "No se pudo actualizar la orden de reparación.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
            if(field === "evaluation") setIsEditingEvaluation(false);
            if(field === "technician") setTechnicianPopoverOpen(false);
            if(field === "status") setStatusPopoverOpen(false);
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

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="font-headline">Progreso de la Reparación</CardTitle>
                        <Popover open={statusPopoverOpen} onOpenChange={setStatusPopoverOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={statusPopoverOpen}
                                    className="w-[200px] justify-between"
                                    disabled={isLoading}
                                >
                                    Actualizar Estado
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Command>
                                    <CommandGroup>
                                        {repairStatuses.map((status) => (
                                            <CommandItem
                                                key={status}
                                                onSelect={() => handleSave('status', status)}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        repair.status === status ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {status}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                </CardHeader>
                <CardContent>
                    <RepairStatusProgress currentStatus={repair.status} />
                </CardContent>
            </Card>

            <div className="grid lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 grid gap-6">
                    <div className="grid gap-2">
                        <h2 className="text-xl font-bold font-headline flex items-center gap-2"><FileText className="h-5 w-5" /> Descripción del Problema</h2>
                        <p className="text-muted-foreground">{repair.problemDescription}</p>
                    </div>
                    <div className="grid gap-2">
                        <div className="flex justify-between items-center">
                           <h2 className="text-xl font-bold font-headline flex items-center gap-2"><ClipboardPenLine className="h-5 w-5" /> Evaluación Técnica</h2>
                            {!isEditingEvaluation && <Button variant="outline" size="sm" onClick={() => setIsEditingEvaluation(true)}>Editar</Button>}
                        </div>
                        {isEditingEvaluation ? (
                            <div className="space-y-2">
                                <Textarea value={evaluation} onChange={(e) => setEvaluation(e.target.value)} placeholder="Añada aquí la evaluación del técnico..." />
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => { setIsEditingEvaluation(false); setEvaluation(repair.evaluation || ""); }}>Cancelar</Button>
                                    <Button size="sm" onClick={() => handleSave('evaluation', evaluation)} disabled={isLoading}>
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Guardar
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-muted-foreground">{repair.evaluation || "Pendiente de evaluación."}</p>
                        )}
                    </div>

                    {repair.functionalityTest && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline flex items-center gap-2">
                                    <ListChecks className="h-5 w-5" />
                                    Prueba de Funciones
                                </CardTitle>
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
                                    <p className="font-medium">{new Date(repair.entryDate).toLocaleString()}</p>
                                </div>
                            </div>
                            <hr className="my-2" />
                            <div className="flex items-center gap-3">
                                <Smartphone className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Producto a Reparar</p>
                                    <p className="font-medium">{repair.device}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <HardDrive className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Tipo de Equipo</p>
                                    <p className="font-medium">{repair.deviceType}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <p className="text-muted-foreground font-mono text-xs w-5 flex-shrink-0 mt-1">S/N</p>
                                <div>
                                    <p className="text-muted-foreground">IMEI o Número de Serie</p>
                                    <p className="font-medium font-mono break-all">{repair.imeiOrSn}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <KeyRound className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Contraseña del Equipo</p>
                                    <p className="font-medium">{repair.password || "No especificada"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
