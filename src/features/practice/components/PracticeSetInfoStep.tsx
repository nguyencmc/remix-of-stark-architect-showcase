import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Target, Clock, BarChart3, FolderOpen, Plus, X, Globe, Lock } from 'lucide-react';
import { useState } from 'react';

interface ExamCategory {
  id: string;
  name: string;
}

interface PracticeSetInfoStepProps {
  title: string;
  slug: string;
  description: string;
  categoryId: string;
  difficulty: string;
  durationMinutes: number;
  tags: string[];
  isPublished: boolean;
  categories: ExamCategory[];
  isEditing: boolean;
  onTitleChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
  onDurationChange: (value: number) => void;
  onTagsChange: (value: string[]) => void;
  onPublishedChange: (value: boolean) => void;
}

export const PracticeSetInfoStep = ({
  title,
  slug,
  description,
  categoryId,
  difficulty,
  durationMinutes,
  tags,
  isPublished,
  categories,
  isEditing,
  onTitleChange,
  onSlugChange,
  onDescriptionChange,
  onCategoryChange,
  onDifficultyChange,
  onDurationChange,
  onTagsChange,
  onPublishedChange,
}: PracticeSetInfoStepProps) => {
  const [tagInput, setTagInput] = useState('');

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      onTagsChange([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(t => t !== tagToRemove));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-border/50">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Thông tin bộ đề</CardTitle>
          <CardDescription>
            Nhập các thông tin cơ bản về bộ đề của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          {/* Title & Slug */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Tiêu đề *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="VD: Ôn tập Toán lớp 12 - Chương 1"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug" className="flex items-center gap-2">
                Đường dẫn (slug) *
              </Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => onSlugChange(e.target.value)}
                placeholder="on-tap-toan-lop-12"
                className="h-11 font-mono text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Mô tả ngắn về nội dung và mục đích của bộ đề..."
              rows={3}
            />
          </div>

          {/* Category & Difficulty */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                Danh mục
              </Label>
              <Select value={categoryId || 'none'} onValueChange={(v) => onCategoryChange(v === 'none' ? '' : v)}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">-- Không chọn --</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Độ khó
              </Label>
              <Select value={difficulty} onValueChange={onDifficultyChange}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">
                    <span className="flex items-center gap-2">
                      🟢 Dễ
                    </span>
                  </SelectItem>
                  <SelectItem value="medium">
                    <span className="flex items-center gap-2">
                      🟡 Trung bình
                    </span>
                  </SelectItem>
                  <SelectItem value="hard">
                    <span className="flex items-center gap-2">
                      🔴 Khó
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Thời gian làm bài (phút)
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="duration"
                type="number"
                value={durationMinutes}
                onChange={(e) => onDurationChange(parseInt(e.target.value) || 60)}
                min={1}
                max={300}
                className="w-32 h-11"
              />
              <div className="flex gap-2">
                {[30, 45, 60, 90, 120].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => onDurationChange(mins)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                      durationMinutes === mins
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted hover:bg-muted/80 border-border'
                    }`}
                  >
                    {mins}p
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                placeholder="Thêm tag..."
                onKeyDown={e =>
                  e.key === 'Enter' && (e.preventDefault(), addTag())
                }
                className="h-11"
              />
              <Button type="button" variant="outline" onClick={addTag} className="h-11">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex gap-1 flex-wrap mt-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button onClick={() => removeTag(tag)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Publish Toggle */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <Label htmlFor="published" className="font-medium flex items-center gap-2">
                {isPublished ? (
                  <>
                    <Globe className="w-4 h-4 text-green-600" />
                    Công khai
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Riêng tư
                  </>
                )}
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Bộ đề công khai sẽ hiển thị trong phần Đề thi cho mọi người
              </p>
            </div>
            <Switch
              id="published"
              checked={isPublished}
              onCheckedChange={onPublishedChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
