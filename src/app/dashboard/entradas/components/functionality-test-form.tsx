"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import type { FunctionalityTestResults } from "@/services/repairs";
import { useEffect } from "react";

const functionalityTestSchema = z.object({
    cameraFront: z.enum(["ok", "fail", "na"]),
    cameraBack: z.enum(["ok", "fail", "na"]),
    chargingPort: z.enum(["ok", "fail", "na"]),
    screen: z.enum(["ok", "fail", "na"]),
    touch: z.enum(["ok", "fail", "na"]),
    buttons: z.enum(["ok", "fail", "na"]),
    earpiece: z.enum(["ok", "fail", "na"]),
    speaker: z.enum(["ok", "fail", "na"]),
    microphone: z.enum(["ok", "fail", "na"]),
    wifi: z.enum(["ok", "fail", "na"]),
    biometrics: z.enum(["ok", "fail", "na"]),
    other: z.string().optional(),
});

interface FunctionalityTestFormProps {
    initialData?: FunctionalityTestResults;
    onSave: (data: FunctionalityTestResults) => void;
    onCancel: () => void;
}

const testItems: { name: keyof Omit<FunctionalityTestResults, 'other'>; label: string }[] = [
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


export default function FunctionalityTestForm({ initialData, onSave, onCancel }: FunctionalityTestFormProps) {
    const form = useForm<FunctionalityTestResults>({
        resolver: zodResolver(functionalityTestSchema),
        defaultValues: initialData || {
            cameraFront: "na",
            cameraBack: "na",
            chargingPort: "na",
            screen: "na",
            touch: "na",
            buttons: "na",
            earpiece: "na",
            speaker: "na",
            microphone: "na",
            wifi: "na",
            biometrics: "na",
            other: "",
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset(initialData);
        }
    }, [initialData, form]);

    function onSubmit(data: FunctionalityTestResults) {
        onSave(data);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
                    {testItems.map((item) => (
                        <FormField
                            key={item.name}
                            control={form.control}
                            name={item.name}
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-md border p-3">
                                    <FormLabel className="font-normal flex-1">{item.label}</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            className="flex items-center space-x-4"
                                        >
                                            <FormItem className="flex items-center space-x-2">
                                                <FormControl>
                                                    <RadioGroupItem value="ok" id={`${item.name}-ok`} />
                                                </FormControl>
                                                <FormLabel htmlFor={`${item.name}-ok`} className="font-normal text-green-600">OK</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2">
                                                <FormControl>
                                                    <RadioGroupItem value="fail" id={`${item.name}-fail`}/>
                                                </FormControl>
                                                <FormLabel htmlFor={`${item.name}-fail`} className="font-normal text-red-600">Falla</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2">
                                                <FormControl>
                                                    <RadioGroupItem value="na" id={`${item.name}-na`}/>
                                                </FormControl>
                                                <FormLabel htmlFor={`${item.name}-na`} className="font-normal text-muted-foreground">N/A</FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    ))}
                    <FormField
                        control={form.control}
                        name="other"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Otras Observaciones</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Describa cualquier otra falla o detalle encontrado..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="ghost" onClick={onCancel}>
                        Cancelar
                    </Button>
                    <Button type="submit">Guardar Resultados</Button>
                </div>
            </form>
        </Form>
    );
}
