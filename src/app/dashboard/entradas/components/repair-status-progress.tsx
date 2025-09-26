"use client"

import * as React from "react";
import type { RepairStatus } from "@/services/repairs";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, CircleDot } from "lucide-react";

const repairStatuses: RepairStatus[] = ["Cotización", "Confirmado", "En Reparación", "Reparado", "Entregado"];

interface RepairStatusProgressProps {
    currentStatus: RepairStatus;
}

export default function RepairStatusProgress({ currentStatus }: RepairStatusProgressProps) {
    const currentIndex = repairStatuses.indexOf(currentStatus);

    return (
        <div className="w-full py-4">
            <div className="flex items-center">
                {repairStatuses.map((status, index) => {
                    const isCompleted = index < currentIndex;
                    const isActive = index === currentIndex;

                    return (
                        <React.Fragment key={status}>
                            <div className="flex flex-col items-center">
                                <div className="flex items-center gap-2">
                                     {isCompleted ? (
                                        <CheckCircle2 className="h-6 w-6 text-primary" />
                                    ) : isActive ? (
                                        <CircleDot className="h-6 w-6 text-primary" />
                                    ) : (
                                        <Circle className="h-6 w-6 text-muted-foreground/60" />
                                    )}
                                </div>
                                <p className={cn(
                                    "text-xs mt-2 text-center",
                                    isActive ? "font-bold text-primary" : "text-muted-foreground",
                                    isCompleted && "text-foreground"
                                )}>{status}</p>
                            </div>

                            {index < repairStatuses.length - 1 && (
                                <div className={cn(
                                    "flex-1 h-1 mx-2",
                                    isCompleted || isActive ? "bg-primary" : "bg-muted"
                                )}></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}
