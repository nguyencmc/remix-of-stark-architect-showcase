import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';

interface CourseWhatYouLearnProps {
  items: string[];
  newItem: string;
  onNewItemChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function CourseWhatYouLearn({ items, newItem, onNewItemChange, onAdd, onRemove }: CourseWhatYouLearnProps) {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Bạn sẽ học được gì</CardTitle>
        <CardDescription>Liệt kê những điều học viên sẽ đạt được</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newItem}
            onChange={(e) => onNewItemChange(e.target.value)}
            placeholder="VD: Xây dựng ứng dụng web hoàn chỉnh"
            onKeyPress={(e) => e.key === 'Enter' && onAdd()}
          />
          <Button type="button" onClick={onAdd} size="icon">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {items.filter(w => w).map((item, index) => (
            <div key={index} className="flex items-center gap-2 bg-muted/50 p-2 rounded">
              <span className="flex-1">{item}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => onRemove(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
