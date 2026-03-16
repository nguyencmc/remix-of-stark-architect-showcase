import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import type { QuestionSetFormProps } from '../types';

export function QuestionSetForm({
  title,
  description,
  level,
  tags,
  tagInput,
  isPublished,
  categoryId,
  categories,
  onTitleChange,
  onDescriptionChange,
  onLevelChange,
  onTagInputChange,
  onIsPublishedChange,
  onCategoryIdChange,
  onAddTag,
  onRemoveTag,
}: QuestionSetFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin bộ đề</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Tên bộ đề *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Nhập tên bộ đề..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Mô tả ngắn về bộ đề..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Danh mục</Label>
          <Select
            value={categoryId || 'none'}
            onValueChange={(v) => onCategoryIdChange(v === 'none' ? null : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn danh mục..." />
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
          <p className="text-xs text-muted-foreground">
            Danh mục giúp phân loại bộ đề (dùng chung với Đề thi)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="level">Độ khó</Label>
          <Select value={level} onValueChange={onLevelChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Dễ</SelectItem>
              <SelectItem value="medium">Trung bình</SelectItem>
              <SelectItem value="hard">Khó</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => onTagInputChange(e.target.value)}
              placeholder="Thêm tag..."
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onAddTag())}
            />
            <Button type="button" variant="outline" onClick={onAddTag}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex gap-1 flex-wrap mt-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button onClick={() => onRemoveTag(tag)}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <Label htmlFor="published">Công khai</Label>
          <Switch
            id="published"
            checked={isPublished}
            onCheckedChange={onIsPublishedChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
