import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CourseFormData, CourseCategory } from '@/features/courseEditor/types';

interface CourseBasicInfoProps {
  formData: CourseFormData;
  categories: CourseCategory[];
  onTitleChange: (value: string) => void;
  onFieldChange: <K extends keyof CourseFormData>(key: K, value: CourseFormData[K]) => void;
}

export function CourseBasicInfo({ formData, categories, onTitleChange, onFieldChange }: CourseBasicInfoProps) {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Thông tin cơ bản</CardTitle>
        <CardDescription>Thông tin chính về khóa học của bạn</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Tên khóa học *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="VD: Lập trình Web với React từ cơ bản đến nâng cao"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Đường dẫn (URL)</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => onFieldChange('slug', e.target.value)}
            placeholder="lap-trinh-web-voi-react"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Mô tả khóa học</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => onFieldChange('description', e.target.value)}
            placeholder="Mô tả chi tiết về nội dung và mục tiêu của khóa học..."
            rows={5}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Danh mục</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => onFieldChange('category_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Cấp độ</Label>
            <Select
              value={formData.level}
              onValueChange={(value) => onFieldChange('level', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn cấp độ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Cơ bản</SelectItem>
                <SelectItem value="intermediate">Trung bình</SelectItem>
                <SelectItem value="advanced">Nâng cao</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
