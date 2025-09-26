import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { PlusCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const schedule = {
  "Monday": [
    { name: "John Doe", role: "Sales Associate", time: "9am - 5pm", avatar: "https://picsum.photos/seed/avatar1/40/40" },
    { name: "Peter Jones", role: "Manager", time: "9am - 5pm", avatar: "https://picsum.photos/seed/avatar3/40/40" },
  ],
  "Tuesday": [
    { name: "Jane Smith", role: "Sales Associate", time: "10am - 6pm", avatar: "https://picsum.photos/seed/avatar2/40/40" },
    { name: "David Williams", role: "Technician", time: "10am - 6pm", avatar: "https://picsum.photos/seed/avatar4/40/40" },
  ],
  "Wednesday": [
    { name: "John Doe", role: "Sales Associate", time: "9am - 5pm", avatar: "https://picsum.photos/seed/avatar1/40/40" },
     { name: "Mary Johnson", role: "Sales Associate", time: "12pm - 8pm", avatar: "https://picsum.photos/seed/avatar5/40/40" },
  ],
  "Thursday": [
     { name: "Jane Smith", role: "Sales Associate", time: "10am - 6pm", avatar: "https://picsum.photos/seed/avatar2/40/40" },
    { name: "Peter Jones", role: "Manager", time: "9am - 5pm", avatar: "https://picsum.photos/seed/avatar3/40/40" },
  ],
  "Friday": [
    { name: "John Doe", role: "Sales Associate", time: "9am - 5pm", avatar: "https://picsum.photos/seed/avatar1/40/40" },
    { name: "David Williams", role: "Technician", time: "10am - 6pm", avatar: "https://picsum.photos/seed/avatar4/40/40" },
    { name: "Mary Johnson", role: "Sales Associate", time: "12pm - 8pm", avatar: "https://picsum.photos/seed/avatar5/40/40" },
  ],
  "Saturday": [
    { name: "Jane Smith", role: "Sales Associate", time: "10am - 6pm", avatar: "https://picsum.photos/seed/avatar2/40/40" },
    { name: "Mary Johnson", role: "Sales Associate", time: "12pm - 8pm", avatar: "https://picsum.photos/seed/avatar5/40/40" },
  ],
  "Sunday": [],
};

type Day = keyof typeof schedule;

export default function EmployeesPage() {
  return (
    <>
      <PageHeader title="Employee Schedules" description="Manage staff schedules and assignments for the week.">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
            <span className="font-medium text-sm">May 20 - 26, 2024</span>
            <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Shift
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
                 <p className="text-sm text-muted-foreground">No shifts scheduled.</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
