import { RefObject } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Upload, Download } from 'lucide-react';

interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCSVUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDownloadTemplate: () => void;
  importing: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export function BulkImportDialog({
  open,
  onOpenChange,
  onCSVUpload,
  onDownloadTemplate,
  importing,
  fileInputRef,
}: BulkImportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="w-4 h-4" />
          Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import người dùng từ CSV</DialogTitle>
          <DialogDescription>
            Tải lên file CSV để tạo nhiều người dùng cùng lúc
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">Format CSV (dùng dấu chấm phẩy):</p>
            <code className="bg-muted p-2 rounded block text-xs overflow-x-auto">
              email;password;full_name;username;bio;role;expires_at
            </code>
            <p className="mt-2 text-xs">Ngày hết hạn: DD/MM/YYYY (ví dụ: 31/12/2026)</p>
          </div>
          <Button variant="outline" onClick={onDownloadTemplate} className="gap-2">
            <Download className="w-4 h-4" />
            Tải template mẫu
          </Button>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={onCSVUpload}
              className="hidden"
              id="csv-upload"
            />
            <Label htmlFor="csv-upload">
              <Button
                variant="default"
                className="gap-2 cursor-pointer"
                disabled={importing}
                onClick={() => fileInputRef.current?.click()}
              >
                {importing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Đang import...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Chọn file CSV
                  </>
                )}
              </Button>
            </Label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
