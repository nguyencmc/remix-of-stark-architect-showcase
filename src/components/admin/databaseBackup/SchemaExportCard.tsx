import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCode2, Loader2 } from 'lucide-react';

interface SchemaExportCardProps {
  exportingSchema: boolean;
  onExportSchema: () => void;
}

export function SchemaExportCard({ exportingSchema, onExportSchema }: SchemaExportCardProps) {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <FileCode2 className="w-4 h-4" />
          Xuất Schema (SQL)
        </CardTitle>
        <CardDescription>
          Xuất toàn bộ cấu trúc database (tables, RLS policies, functions, triggers, indexes, storage) ra file SQL để dùng cho Supabase riêng.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={onExportSchema}
          disabled={exportingSchema}
          className="w-full gap-2"
        >
          {exportingSchema ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang xuất schema...
            </>
          ) : (
            <>
              <FileCode2 className="w-4 h-4" />
              Xuất toàn bộ Schema
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
