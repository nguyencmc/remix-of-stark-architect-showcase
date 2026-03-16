import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, FileText, File } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface ExportDropdownProps {
  questionsCount: number;
  onExportCSV: () => void;
  onExportTXT: () => void;
  onExportJSON: () => void;
  onDownloadTemplate: () => void;
}

export const ExportDropdown = ({
  questionsCount,
  onExportCSV,
  onExportTXT,
  onExportJSON,
  onDownloadTemplate,
}: ExportDropdownProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" className="gap-2">
        <Download className="w-4 h-4" />
        Export
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Chọn định dạng</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={onExportCSV} disabled={questionsCount === 0}>
        <FileSpreadsheet className="w-4 h-4 mr-2" />
        CSV (Excel)
      </DropdownMenuItem>
      <DropdownMenuItem onClick={onExportTXT} disabled={questionsCount === 0}>
        <FileText className="w-4 h-4 mr-2" />
        TXT (Text)
      </DropdownMenuItem>
      <DropdownMenuItem onClick={onExportJSON} disabled={questionsCount === 0}>
        <File className="w-4 h-4 mr-2" />
        JSON
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={onDownloadTemplate}>
        <FileSpreadsheet className="w-4 h-4 mr-2" />
        Tải file mẫu CSV
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
