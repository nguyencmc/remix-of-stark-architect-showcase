import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface ImportDropdownProps {
  importing: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onOpenManualDialog: () => void;
  onFileImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImportDropdown = ({
  importing,
  fileInputRef,
  onOpenManualDialog,
  onFileImport,
}: ImportDropdownProps) => (
  <>
    <input
      type="file"
      ref={fileInputRef}
      className="hidden"
      accept=".csv,.txt,.json"
      onChange={onFileImport}
    />
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2" disabled={importing}>
          {importing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          Import
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Chọn nguồn import</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Từ file (CSV, TXT, JSON)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onOpenManualDialog}>
          <FileText className="w-4 h-4 mr-2" />
          Nhập thủ công
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </>
);
