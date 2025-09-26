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

    const storeDetails = "Our store is located in a busy downtown area. We are currently running a promotion on phone accessories: buy one, get one 50% off. Popular items include the latest iPhone and Samsung models, as well as fast chargers and protective cases.";

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
            console.error("Prediction failed:", error);
            toast({
                title: "Prediction Failed",
                description: "There was an error generating customer needs predictions. Please try again.",
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
                        <CardTitle className="font-headline">AI-Powered Customer Insights</CardTitle>
                    </div>
                    <CardDescription>
                        Use generative AI to analyze this customer's data and predict their future needs.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handlePrediction} disabled={loading}>
                        {loading ? 'Analyzing...' : 'Predict Customer Needs'}
                    </Button>
                </CardContent>
            </Card>

            {loading && (
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline"><Lightbulb className="h-5 w-5"/> Predicted Needs</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-4/5" />
                        </CardContent>
                    </Card>
                    <Card>
                         <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline"><Sparkles className="h-5 w-5"/> Recommendations</CardTitle>
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
                            <CardTitle className="flex items-center gap-2 font-headline"><Lightbulb className="h-5 w-5 text-yellow-400"/> Predicted Needs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{prediction.predictedNeeds}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline"><Sparkles className="h-5 w-5 text-accent"/> Recommendations</CardTitle>
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
