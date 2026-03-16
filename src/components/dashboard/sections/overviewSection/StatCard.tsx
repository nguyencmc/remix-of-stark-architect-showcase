import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  value: string | number;
  label: string;
  gradientFrom: string;
  iconColor: string;
  bgColor: string;
}

export function StatCard({ icon: Icon, value, label, gradientFrom, iconColor, bgColor }: StatCardProps) {
  return (
    <Card className="border-border/50 relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} to-transparent`} />
      <CardContent className="p-4 relative">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <div>
            <p className="text-xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
