import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import {
  FileText,
  BookOpen,
  Headphones,
  Layers,
  HelpCircle,
  GraduationCap,
  ChevronRight,
} from 'lucide-react';
import type { Stats } from '../types';

interface ContentLink {
  title: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  bg: string;
}

interface AdminContentTabProps {
  stats: Stats;
}

export function AdminContentTab({ stats }: AdminContentTabProps) {
  const contentLinks: ContentLink[] = [
    { title: 'Khóa học', count: stats.totalCourses, icon: GraduationCap, href: '/admin/courses', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { title: 'Đề thi', count: stats.totalExams, icon: FileText, href: '/admin/exams', color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Bộ câu hỏi', count: stats.totalQuestions, icon: HelpCircle, href: '/admin/question-sets', color: 'text-teal-500', bg: 'bg-teal-500/10' },
    { title: 'Flashcard', count: stats.totalFlashcardSets, icon: Layers, href: '/admin/flashcards', color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'Podcast', count: stats.totalPodcasts, icon: Headphones, href: '/admin/podcasts', color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { title: 'Sách', count: stats.totalBooks, icon: BookOpen, href: '/admin/books', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Quản lý nội dung</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contentLinks.map((item) => (
          <Link key={item.href} to={item.href}>
            <Card className="border-border/50 hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.count.toLocaleString()} mục</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
