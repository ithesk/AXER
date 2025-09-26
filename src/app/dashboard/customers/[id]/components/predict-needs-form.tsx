"use client";

import { useState } from "react";
import { predictCustomerNeeds, PredictCustomerNeedsOutput } from "@/ai/flows/predict-customer-needs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Lightbulb, Package, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface PredictNeedsFormProps {
    customerData: string;
    purchaseHistory: string;
}

export default function PredictNeedsForm({ customerData, purchaseHistory }: PredictNeedsFormProps) {
    const [prediction, setPrediction] = useState<PredictCustomerNeedsOutput | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const storeDetails = "Nuestra tienda está ubicada en una concurrida zona céntrica. Actualmente tenemos una promoción en accesorios para teléfonos: compre uno y llévese el segundo con un 50% de descuento. Los artículos populares incluyen los últimos modelos de iPhone y Samsung, así como cargadores rápidos y fundas protectoras.";

    const handlePrediction = async () => {
        setLoading(true);
        setPrediction(null);
        try {
            const result = await predictCustomerNeeds({
                customerData,
                purchaseHistory,
                storeDetails,
            });
            setPrediction(result);
        } catch (error) {
            console.error("La predicción falló:", error);
            toast({
                title: "Predicción Fallida",
                description: "Hubo un error al generar las predicciones de las necesidades del cliente. Por favor, inténtelo de nuevo.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                         <BrainCircuit className="h-6 w-6 text-primary" />
                        <CardTitle className="font-headline">Información del Cliente con IA</CardTitle>
                    </div>
                    <CardDescription>
                        Utilice IA generativa para analizar los datos de este cliente y predecir sus necesidades futuras.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handlePrediction} disabled={loading}>
                        {loading ? 'Analizando...' : 'Predecir Necesidades del Cliente'}
                    </Button>
                </CardContent>
            </Card>

            {loading && (
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline"><Lightbulb className="h-5 w-5"/> Necesidades Previstas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-4/5" />
                        </CardContent>
                    </Card>
                    <Card>
                         <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline"><Sparkles className="h-5 w-5"/> Recomendaciones</CardTitle>
                        </CardHeader>
                         <CardContent className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/5" />
                        </CardContent>
                    </Card>
                </div>
            )}

            {prediction && (
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline"><Lightbulb className="h-5 w-5 text-yellow-400"/> Necesidades Previstas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{prediction.predictedNeeds}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline"><Sparkles className="h-5 w-5 text-accent"/> Recomendaciones</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{prediction.recommendations}</p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
