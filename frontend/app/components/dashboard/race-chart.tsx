import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from "lucide-react";

const data = [
  { month: 'Jan', revenus: 65000, courses: 12 },
  { month: 'Fév', revenus: 75000, courses: 15 },
  { month: 'Mar', revenus: 82000, courses: 18 },
  { month: 'Avr', revenus: 91000, courses: 16 },
  { month: 'Mai', revenus: 105000, courses: 20 },
  { month: 'Jun', revenus: 125000, courses: 22 },
];

export function RaceChart() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Évolution des Revenus</CardTitle>
        <TrendingUp className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'revenus' ? `${value} TND` : value,
                  name === 'revenus' ? 'Revenus' : 'Courses'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="revenus" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2} 
                dot={{ fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
