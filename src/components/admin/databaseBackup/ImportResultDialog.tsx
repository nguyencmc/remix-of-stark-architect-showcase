import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import type { ImportResult } from './types';

interface ImportResultDialogProps {
  open: boolean;
  importResult: ImportResult | null;
  onClose: () => void;
}

export function ImportResultDialog({ open, importResult, onClose }: ImportResultDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Kết quả Import
          </DialogTitle>
          <DialogDescription>
            Đã import tổng cộng {importResult?.total_imported || 0} bản ghi
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[50vh] pr-4">
          <div className="space-y-2">
            {importResult?.summary && Object.entries(importResult.summary)
              .filter(([, count]) => count > 0)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([table, count]) => (
                <div key={table} className="flex items-center gap-3 px-3 py-2 rounded-md bg-muted/30">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm flex-1">{table}</span>
                  <Badge variant="secondary" className="text-xs">{count} bản ghi</Badge>
                </div>
              ))
            }
            {importResult?.errors && importResult.errors.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-destructive flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Lỗi ({importResult.errors.length})
                </p>
                {importResult.errors.map((err, i) => (
                  <p key={i} className="text-xs text-muted-foreground bg-destructive/5 rounded px-3 py-1.5">
                    {err}
                  </p>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
