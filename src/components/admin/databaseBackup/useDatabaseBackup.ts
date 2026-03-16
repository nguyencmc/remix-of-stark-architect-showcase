import { useState, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/useToast';
import { supabase } from '@/integrations/supabase/client';
import { getErrorMessage } from '@/lib/utils';
import { ALL_TABLES, type ImportResult, type ImportPreviewData } from './types';

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function useDatabaseBackup() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Export state
  const [selectedTables, setSelectedTables] = useState<Set<string>>(new Set(ALL_TABLES));
  const [exporting, setExporting] = useState(false);
  const [exportingSchema, setExportingSchema] = useState(false);

  // Import state
  const [importing, setImporting] = useState(false);
  const [importPreview, setImportPreview] = useState<ImportPreviewData | null>(null);
  const [importSelectedTables, setImportSelectedTables] = useState<Set<string>>(new Set());
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);

  // Toggle helpers
  const toggleTable = useCallback((table: string) => {
    setSelectedTables(prev => {
      const next = new Set(prev);
      if (next.has(table)) {
        next.delete(table);
      } else {
        next.add(table);
      }
      return next;
    });
  }, []);

  const toggleGroup = useCallback((tables: string[]) => {
    setSelectedTables(prev => {
      const next = new Set(prev);
      const allSelected = tables.every(t => next.has(t));
      tables.forEach(t => {
        if (allSelected) {
          next.delete(t);
        } else {
          next.add(t);
        }
      });
      return next;
    });
  }, []);

  const selectAll = useCallback(() => setSelectedTables(new Set(ALL_TABLES)), []);
  const selectNone = useCallback(() => setSelectedTables(new Set()), []);

  const toggleImportTable = useCallback((table: string) => {
    setImportSelectedTables(prev => {
      const next = new Set(prev);
      if (next.has(table)) {
        next.delete(table);
      } else {
        next.add(table);
      }
      return next;
    });
  }, []);

  const handleExportSchema = async () => {
    setExportingSchema(true);
    try {
      const response = await supabase.functions.invoke('export-schema', { method: 'POST' });
      if (response.error) throw new Error(response.error.message);

      const sqlContent = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
      downloadFile(sqlContent, `schema-export-${new Date().toISOString().split('T')[0]}.sql`, 'application/sql');
      toast({ title: 'Xuất schema thành công', description: 'File SQL đã được tải về' });
    } catch (error: unknown) {
      toast({ title: 'Lỗi xuất schema', description: getErrorMessage(error), variant: 'destructive' });
    } finally {
      setExportingSchema(false);
    }
  };

  const handleExport = async () => {
    if (selectedTables.size === 0) {
      toast({ title: 'Chưa chọn bảng', description: 'Vui lòng chọn ít nhất 1 bảng để xuất', variant: 'destructive' });
      return;
    }
    setExporting(true);
    try {
      const response = await supabase.functions.invoke('export-database', {
        method: 'POST',
        body: { tables: Array.from(selectedTables) },
      });
      if (response.error) throw new Error(response.error.message);

      const sqlContent = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
      downloadFile(sqlContent, `data-export-${new Date().toISOString().split('T')[0]}.sql`, 'application/sql');
      toast({ title: 'Xuất thành công', description: `Đã xuất ${selectedTables.size} bảng ra file SQL` });
    } catch (error: unknown) {
      toast({ title: 'Lỗi xuất dữ liệu', description: getErrorMessage(error), variant: 'destructive' });
    } finally {
      setExporting(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      const data = JSON.parse(content);

      if (!data.tables || typeof data.tables !== 'object') {
        throw new Error('File không đúng định dạng. Cần có trường "tables".');
      }

      setImportPreview(data);
      const tablesWithData = Object.entries(data.tables)
        .filter(([, rows]) => Array.isArray(rows) && (rows as unknown[]).length > 0)
        .map(([name]) => name);
      setImportSelectedTables(new Set(tablesWithData));
      setShowImportDialog(true);
    } catch (error: unknown) {
      toast({ title: 'Lỗi đọc file', description: getErrorMessage(error), variant: 'destructive' });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleImport = async () => {
    if (!importPreview || importSelectedTables.size === 0) return;

    setImporting(true);
    try {
      const filteredTables: Record<string, unknown[]> = {};
      for (const table of importSelectedTables) {
        if (importPreview.tables[table]) {
          filteredTables[table] = importPreview.tables[table];
        }
      }

      const response = await supabase.functions.invoke('import-rbac-data', {
        method: 'POST',
        body: { tables: filteredTables },
      });
      if (response.error) throw new Error(response.error.message);

      setImportResult(response.data as ImportResult);
      setShowImportDialog(false);
      setShowResultDialog(true);
      toast({ title: 'Import hoàn tất', description: `Đã import ${(response.data as ImportResult).total_imported} bản ghi` });
    } catch (error: unknown) {
      toast({ title: 'Lỗi import', description: getErrorMessage(error), variant: 'destructive' });
    } finally {
      setImporting(false);
    }
  };

  const closeResultDialog = useCallback(() => {
    setShowResultDialog(false);
    setImportResult(null);
    setImportPreview(null);
  }, []);

  return {
    fileInputRef,
    // Export
    selectedTables,
    exporting,
    exportingSchema,
    toggleTable,
    toggleGroup,
    selectAll,
    selectNone,
    handleExport,
    handleExportSchema,
    // Import
    importing,
    importPreview,
    importSelectedTables,
    showImportDialog,
    setShowImportDialog,
    importResult,
    showResultDialog,
    toggleImportTable,
    handleFileSelect,
    handleImport,
    closeResultDialog,
  };
}
