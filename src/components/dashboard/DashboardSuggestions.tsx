import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Flame, 
  Star, 
  Lightbulb,
  Sparkles,
  TrendingUp,
  Target,
  BookOpen,
  Brain
} from 'lucide-react';
import { AchievementsBadgeDisplay } from '@/components/achievements/AchievementsBadgeDisplay';

interface DashboardSuggestionsProps {
  streak: number;
  level: number;
  points: number;
  pointsToNextLevel: number;
  levelProgress: number;
}

const studyTips = [
  "Ôn tập mỗi ngày 15-20 phút hiệu quả hơn 2 giờ mỗi tuần",
  "Sử dụng flashcards để ghi nhớ từ vựng tốt hơn",
  "Làm đề thi thử định kỳ để đánh giá tiến độ",
  "Ôn lại các câu sai là cách học hiệu quả nhất",
  "Nghe podcast để cải thiện kỹ năng listening",
];

export function DashboardSuggestions({
  streak,
  level,
  points,
  pointsToNextLevel,
  levelProgress,
}: DashboardSuggestionsProps) {
  const randomTip = studyTips[Math.floor(Math.random() * studyTips.length)];

  return (
    <aside className="space-y-4">
      {/* Streak & Level Card */}
      <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-4 space-y-4">
          {/* Streak */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{streak}</p>
              <p className="text-xs text-muted-foreground">Streak ngày</p>
            </div>
          </div>
          
          {/* Level */}
          <div className="pt-3 border-t border-border/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-semibold">Level {level}</span>
              </div>
              <span className="text-xs text-muted-foreground">{points.toLocaleString()} điểm</span>
            </div>
            <Progress value={levelProgress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1 text-center">
              Còn {pointsToNextLevel} điểm → Level {level + 1}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations Preview */}
      <Card className="border-border/50">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            Gợi ý AI
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-2">
          <Link to="/practice" className="block">
            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">Luyện tập hôm nay</p>
                <p className="text-[10px] text-muted-foreground">10 câu nhanh</p>
              </div>
            </div>
          </Link>
          
          <Link to="/flashcards/today" className="block">
            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Brain className="w-4 h-4 text-cyan-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">Ôn flashcard</p>
                <p className="text-[10px] text-muted-foreground">Thẻ đến hạn</p>
              </div>
            </div>
          </Link>

          <Link to="/practice/review" className="block">
            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">Ôn câu sai</p>
                <p className="text-[10px] text-muted-foreground">Cải thiện điểm yếu</p>
              </div>
            </div>
          </Link>
        </CardContent>
      </Card>

      {/* Achievements Preview */}
      <Link to="/achievements" className="block">
        <AchievementsBadgeDisplay />
      </Link>

      {/* Study Tip */}
      <Card className="border-border/50 bg-gradient-to-br from-yellow-500/5 to-transparent">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-foreground mb-1">Mẹo học tập</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{randomTip}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
