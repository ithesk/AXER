"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { BarChart, PieChart, DollarSign, Users, Package, ShoppingCart } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, Pie, PieChart as RechartsPieChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const salesData = [
  { month: "January", sales: 4000 },
  { month: "February", sales: 3000 },
  { month: "March", sales: 5000 },
  { month: "April", sales: 4500 },
  { month: "May", sales: 6000 },
  { month: "June", sales: 7500 },
];

const productData = [
  { name: 'iPhone 15 Pro', value: 400, fill: 'hsl(var(--chart-1))' },
  { name: 'Samsung Galaxy S24', value: 300, fill: 'hsl(var(--chart-2))' },
  { name: 'Google Pixel 8', value: 200, fill: 'hsl(var(--chart-3))' },
  { name: 'OnePlus 12', value: 100, fill: 'hsl(var(--chart-4))' },
];

export default function Dashboard() {
  return (
    <>
      <PageHeader title="Dashboard" description="Here's a summary of your store's performance." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Count</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">2 stores are low on stock</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="font-headline">Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
             <ChartContainer config={{}} className="h-[300px] w-full">
              <RechartsBarChart data={salesData}>
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false}/>
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`}/>
                <Tooltip
                  cursor={false}
                  content={<ChartTooltipContent
                    formatter={(value, name) => [`$${value}`, "Sales"]}
                    labelFormatter={(label) => label}
                  />}
                  wrapperClassName="!bg-popover !border-border !rounded-lg !shadow-lg"
                  />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Popular Products</CardTitle>
            <CardDescription>Top selling products this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
              <RechartsPieChart>
                 <Tooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                <Pie data={productData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} labelLine={false} label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  value,
                  index,
                }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = 25 + innerRadius + (outerRadius - innerRadius);
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline="central"
                      className="fill-muted-foreground text-xs"
                    >
                      {productData[index].name} ({value})
                    </text>
                  );
                }} />
              </RechartsPieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
