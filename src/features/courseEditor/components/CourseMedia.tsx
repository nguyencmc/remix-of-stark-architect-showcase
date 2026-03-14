import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CourseFormData } from '@/features/courseEditor/types';

interface CourseMediaProps {
  formData: CourseFormData;
  onFieldChange: <K extends keyof CourseFormData>(key: K, value: CourseFormData[K]) => void;
}

export function CourseMedia({ formData, onFieldChange }: CourseMediaProps) {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Hình ảnh & Video</CardTitle>
        <CardDescription>Ảnh bìa và video giới thiệu khóa học</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="image_url">URL ảnh bìa</Label>
          <Input
            id="image_url"
            value={formData.image_url}
            onChange={(e) => onFieldChange('image_url', e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="preview_video_url">URL video giới thiệu</Label>
          <Input
            id="preview_video_url"
            value={formData.preview_video_url}
            onChange={(e) => onFieldChange('preview_video_url', e.target.value)}
            placeholder="https://www.youtube.com/embed/..."
          />
        </div>
      </CardContent>
    </Card>
  );
}
