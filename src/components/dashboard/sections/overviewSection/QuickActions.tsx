import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Layers, BookOpen, Headphones } from 'lucide-react';
import { cn } from '@/lib/utils';

const quickActions = [
  {
    label: 'Luyện tập',
    href: '/practice',
    icon: Target,
    color: 'bg-primary/10 text-primary hover:bg-primary/20',
    description: 'Làm bài ngay'
  },
  {
    label: 'Flashcard',
    href: '/flashcards/today',
    icon: Layers,
    color: 'bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20',
    description: 'Ôn thẻ nhớ'
  },
  {
    label: 'Khóa học',
    href: '/courses',
    icon: BookOpen,
    color: 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20',
    description: 'Học tiếp'
  },
  {
    label: 'Podcast',
    href: '/podcasts',
    icon: Headphones,
    color: 'bg-pink-500/10 text-pink-500 hover:bg-pink-500/20',
    description: 'Nghe audio'
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {quickActions.map((action) => (
        <Link key={action.href} to={action.href}>
          <Card className={cn(
            "border-border/50 hover:border-primary/30 transition-all cursor-pointer group h-full",
            "hover:shadow-md hover:-translate-y-0.5"
          )}>
            <CardContent className="p-4 text-center">
              <div className={cn(
                "w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center transition-colors",
                action.color
              )}>
                <action.icon className="w-6 h-6" />
              </div>
              <p className="font-medium text-sm group-hover:text-primary transition-colors">
                {action.label}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
