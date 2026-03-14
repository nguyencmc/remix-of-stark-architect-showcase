import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { CourseFormData } from '@/features/courseEditor/types';

interface CourseStatusProps {
  formData: CourseFormData;
  isAdmin: boolean;
  onFieldChange: <K extends keyof CourseFormData>(key: K, value: CourseFormData[K]) => void;
}

export function CourseStatus({ formData, isAdmin, onFieldChange }: CourseStatusProps) {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Trạng thái</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Xuất bản</Label>
            <p className="text-sm text-muted-foreground">Hiển thị công khai</p>
          </div>
          <Switch
            checked={formData.is_published}
            onCheckedChange={(checked) => onFieldChange('is_published', checked)}
          />
        </div>

        {isAdmin && (
          <div className="flex items-center justify-between">
            <div>
              <Label>Nổi bật</Label>
              <p className="text-sm text-muted-foreground">Hiển thị ở trang chủ</p>
            </div>
            <Switch
              checked={formData.is_featured}
              onCheckedChange={(checked) => onFieldChange('is_featured', checked)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
