import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Package, ShoppingCart, Users, BrainCircuit, BarChart, Bell } from "lucide-react";
import Image from "next/image";
import { placeholderImages } from "@/lib/placeholder-images";

const features = [
  {
    icon: Package,
    title: "Inventory Tracking",
    description: "Monitor phone stock levels across different store locations.",
  },
  {
    icon: ShoppingCart,
    title: "Sales Logging",
    description: "Record and categorize sales transactions with ease.",
  },
  {
    icon: Users,
    title: "Employee Scheduling",
    description: "Create and manage staff schedules, assign roles, and track attendance.",
  },
  {
    icon: BrainCircuit,
    title: "AI-Powered CRM",
    description: "Store customer data and predict their needs with generative AI.",
  },
  {
    icon: BarChart,
    title: "Reporting Dashboard",
    description: "Visualize key metrics like sales revenue and popular products.",
  },
  {
    icon: Bell,
    title: "Alerts and Notifications",
    description: "Get notified about low stock, scheduling conflicts, and more.",
  },
];


export default function Home() {
  const heroImage = placeholderImages.find(p => p.id === "hero-phones");

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <Link href="#" className="flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M4 17a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4Z"/><path d="M12 7V5"/><path d="M7 7V5"/><path d="M17 7V5"/></svg>
          <span className="font-bold text-lg font-headline">AXER</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="relative w-full py-20 md:py-32 lg:py-40" style={{background: "hsl(214, 65%, 50%)"}}>
            <div className="container px-4 md:px-6 text-center text-primary-foreground">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline">
                        El futuro de la gestión de tiendas de telefonía
                    </h1>
                    <p className="mx-auto max-w-[700px] text-lg md:text-xl">
                        AXER es su solución todo en uno para inventario, ventas, empleados y relaciones con los clientes, impulsada por IA.
                    </p>
                </div>
                <div className="mt-8">
                    <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Link href="/dashboard">
                            Explore The Dashboard
                        </Link>
                    </Button>
                </div>
            </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Core Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Everything You Need to Succeed</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides a comprehensive suite of tools to streamline your operations and drive growth.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3 pt-12">
              {features.map((feature) => (
                <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 AXER. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
