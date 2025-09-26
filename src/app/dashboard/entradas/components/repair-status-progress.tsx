"use client"

import { Progress } from "@/components/ui/progress";
import type { RepairStatus } from "@/services/repairs";
import { cn } from "@/lib/utils";

const repairStatuses: RepairStatus[] = ["Cotización", "Confirmado", "En Reparación", "Reparado", "Entregado"];

interface RepairStatusProgressProps {
    currentStatus: RepairStatus;
}

export default function RepairStatusProgress({ currentStatus }: RepairStatusProgressProps) {
    const currentIndex = repairStatuses.indexOf(currentStatus);
    const progressValue = (currentIndex + 1) / repairStatuses.length * 100;

    return (
        <div className="w-full">
            <Progress value={progressValue} className="h-2" />
            <div className="mt-4 grid grid-cols-5 gap-x-2 text-center text-xs text-muted-foreground">
                {repairStatuses.map((status, index) => (
                    <div key={status} className="flex flex-col items-center">
                        <div className={cn(
                            "w-full h-1 rounded-full mb-2",
                            index <= currentIndex ? "bg-primary" : "bg-muted"
                        )}></div>
                        <span className={cn(
                            "font-medium",
                            index <= currentIndex && "text-primary"
                        )}>
                            {status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
