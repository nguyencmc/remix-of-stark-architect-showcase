import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CourseFormData } from '@/features/courseEditor/types';

interface CoursePricingProps {
  formData: CourseFormData;
  onFieldChange: <K extends keyof CourseFormData>(key: K, value: CourseFormData[K]) => void;
}

export function CoursePricing({ formData, onFieldChange }: CoursePricingProps) {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Giá khóa học</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="price">Giá bán (VNĐ)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => onFieldChange('price', parseInt(e.target.value) || 0)}
            placeholder="0 = Miễn phí"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="original_price">Giá gốc (VNĐ)</Label>
          <Input
            id="original_price"
            type="number"
            value={formData.original_price}
            onChange={(e) => onFieldChange('original_price', parseInt(e.target.value) || 0)}
            placeholder="Để trống nếu không có"
          />
        </div>
      </CardContent>
    </Card>
  );
}
