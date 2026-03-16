import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Database, Loader2, Upload, Table2 } from 'lucide-react';
import type { ImportPreviewData } from './types';

interface ImportPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  importPreview: ImportPreviewData | null;
  importSelectedTables: Set<string>;
  importing: boolean;
  toggleImportTable: (table: string) => void;
  onImport: () => void;
}

export function ImportPreviewDialog({
  open,
  onOpenChange,
  importPreview,
  importSelectedTables,
  importing,
  toggleImportTable,
  onImport,
}: ImportPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Xác nhận Import
          </DialogTitle>
          <DialogDescription>
            {importPreview?.exported_at && (
              <>File xuất ngày: {new Date(importPreview.exported_at).toLocaleString('vi-VN')}</>
            )}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[50vh] pr-4">
          <div className="space-y-2">
            {importPreview && Object.entries(importPreview.tables)
              .filter(([, rows]) => Array.isArray(rows) && (rows as unknown[]).length > 0)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([tableName, rows]) => (
                <label
                  key={tableName}
                  className="flex items-center gap-3 cursor-pointer hover:bg-muted/30 rounded-md px-3 py-2"
                >
                  <Checkbox
                    checked={importSelectedTables.has(tableName)}
                    onCheckedChange={() => toggleImportTable(tableName)}
                  />
                  <Table2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm flex-1">{tableName}</span>
                  <Badge variant="secondary" className="text-xs">
                    {(rows as unknown[]).length} bản ghi
                  </Badge>
                </label>
              ))
            }
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between pt-4 border-t">
          <span className="text-sm text-muted-foreground">
            Đã chọn {importSelectedTables.size} bảng
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button
              onClick={onImport}
              disabled={importing || importSelectedTables.size === 0}
              className="gap-2"
            >
              {importing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang import...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Import
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
