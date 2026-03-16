import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileJson } from 'lucide-react';

interface ImportCardProps {
  onTriggerFileSelect: () => void;
}

export function ImportCard({ onTriggerFileSelect }: ImportCardProps) {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Nhập dữ liệu
        </CardTitle>
        <CardDescription>
          Import dữ liệu từ file JSON đã xuất trước đó. Dữ liệu trùng ID sẽ được cập nhật.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          onClick={onTriggerFileSelect}
          className="w-full gap-2"
        >
          <FileJson className="w-4 h-4" />
          Chọn file JSON để import
        </Button>
      </CardContent>
    </Card>
  );
}
