import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { PlusCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSchedule, Schedule } from "@/services/schedule";

type Day = keyof Schedule;

export default async function EmployeesPage() {
  const schedule = await getSchedule();

  return (
    <>
      <PageHeader title="Horarios de Empleados" description="Gestiona los horarios y asignaciones del personal para la semana.">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
            <span className="font-medium text-sm">20 - 26 de Mayo, 2024</span>
            <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Turno
          </Button>
        </div>
      </PageHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4 items-start">
        {Object.keys(schedule).map((day) => (
          <Card key={day} className="h-full">
            <CardHeader>
              <CardTitle className="text-base font-medium font-headline">{day}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {schedule[day as Day].length > 0 ? schedule[day as Day].map(shift => (
                <div key={shift.name} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={shift.avatar} data-ai-hint="person portrait" />
                    <AvatarFallback>{shift.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{shift.name}</p>
                    <p className="text-xs text-muted-foreground">{shift.role}</p>
                    <p className="text-xs text-muted-foreground">{shift.time}</p>
                  </div>
                </div>
              )) : (
                 <p className="text-sm text-muted-foreground">No hay turnos programados.</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
