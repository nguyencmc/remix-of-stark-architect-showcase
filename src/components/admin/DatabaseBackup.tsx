import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Download,
  Upload,
  Database,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileJson,
  Table2,
  Package,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const TABLE_GROUPS: Record<string, { label: string; tables: string[] }> = {
  users: {
    label: 'Người dùng & Phân quyền',
    tables: ['profiles', 'user_roles', 'permissions', 'role_permissions', 'user_achievements', 'achievements', 'audit_logs'],
  },
  exams: {
    label: 'Đề thi & Câu hỏi',
    tables: ['exams', 'exam_categories', 'questions', 'exam_attempts', 'exam_proctoring_logs', 'exam_versions'],
  },
  practice: {
    label: 'Luyện tập',
    tables: ['question_sets', 'practice_questions', 'practice_exam_sessions', 'practice_attempts'],
  },
  courses: {
    label: 'Khóa học',
    tables: ['courses', 'course_categories', 'course_sections', 'course_lessons', 'course_tests', 'course_test_questions', 'course_test_attempts', 'course_notes', 'course_questions', 'course_answers', 'course_reviews', 'course_certificates', 'course_wishlists', 'user_course_enrollments'],
  },
  flashcards: {
    label: 'Flashcards',
    tables: ['flashcard_sets', 'flashcards', 'flashcard_decks', 'flashcard_reviews', 'user_flashcard_progress'],
  },
  books: {
    label: 'Sách',
    tables: ['books', 'book_categories', 'book_chapters', 'book_bookmarks', 'book_highlights', 'book_notes', 'user_book_progress'],
  },
  podcasts: {
    label: 'Podcast',
    tables: ['podcasts', 'podcast_categories'],
  },
  articles: {
    label: 'Bài viết',
    tables: ['articles', 'article_categories', 'article_comments'],
  },
  classroom: {
    label: 'Lớp học',
    tables: ['classes', 'class_members', 'class_courses', 'class_assignments', 'assignment_submissions'],
  },
  social: {
    label: 'Nhóm học tập',
    tables: ['study_groups', 'study_group_members', 'study_group_messages', 'study_group_resources'],
  },
};

const ALL_TABLES = Object.values(TABLE_GROUPS).flatMap(g => g.tables);

interface ImportResult {
  success: boolean;
  summary: Record<string, number>;
  total_imported: number;
  errors?: string[];
}

export function DatabaseBackup() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Export state
  const [selectedTables, setSelectedTables] = useState<Set<string>>(new Set(ALL_TABLES));
  const [exporting, setExporting] = useState(false);
  
  // Import state
  const [importing, setImporting] = useState(false);
  const [importPreview, setImportPreview] = useState<{ tables: Record<string, unknown[]>; exported_at?: string } | null>(null);
  const [importSelectedTables, setImportSelectedTables] = useState<Set<string>>(new Set());
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);

  // Toggle helpers
  const toggleTable = useCallback((table: string) => {
    setSelectedTables(prev => {
      const next = new Set(prev);
      next.has(table) ? next.delete(table) : next.add(table);
      return next;
    });
  }, []);

  const toggleGroup = useCallback((tables: string[]) => {
    setSelectedTables(prev => {
      const next = new Set(prev);
      const allSelected = tables.every(t => next.has(t));
      tables.forEach(t => allSelected ? next.delete(t) : next.add(t));
      return next;
    });
  }, []);

  const selectAll = useCallback(() => setSelectedTables(new Set(ALL_TABLES)), []);
  const selectNone = useCallback(() => setSelectedTables(new Set()), []);

  const toggleImportTable = useCallback((table: string) => {
    setImportSelectedTables(prev => {
      const next = new Set(prev);
      next.has(table) ? next.delete(table) : next.add(table);
      return next;
    });
  }, []);

  // Export handler
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

      const jsonData = JSON.stringify(response.data, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `database-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const counts = response.data?.table_counts || {};
      const totalRows = Object.values(counts).reduce((a: number, b: unknown) => a + (b as number), 0);
      toast({
        title: 'Xuất thành công',
        description: `Đã xuất ${selectedTables.size} bảng với ${totalRows} bản ghi`,
      });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      toast({ title: 'Lỗi xuất dữ liệu', description: msg, variant: 'destructive' });
    } finally {
      setExporting(false);
    }
  };

  // Import file handler
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
      const msg = error instanceof Error ? error.message : 'Không thể đọc file';
      toast({ title: 'Lỗi đọc file', description: msg, variant: 'destructive' });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Execute import
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

      toast({
        title: 'Import hoàn tất',
        description: `Đã import ${(response.data as ImportResult).total_imported} bản ghi`,
      });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      toast({ title: 'Lỗi import', description: msg, variant: 'destructive' });
    } finally {
      setImporting(false);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".json"
        onChange={handleFileSelect}
      />

      <div className="space-y-6">
        {/* Export Section */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Download className="w-4 h-4" />
              Xuất dữ liệu
            </CardTitle>
            <CardDescription>Chọn các bảng bạn muốn xuất ra file JSON</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quick actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={selectAll}>
                Chọn tất cả
              </Button>
              <Button variant="outline" size="sm" onClick={selectNone}>
                Bỏ chọn tất cả
              </Button>
              <Badge variant="secondary" className="ml-auto">
                {selectedTables.size}/{ALL_TABLES.length} bảng
              </Badge>
            </div>

            {/* Table groups */}
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {Object.entries(TABLE_GROUPS).map(([groupKey, group]) => {
                  const groupSelected = group.tables.filter(t => selectedTables.has(t)).length;
                  const allGroupSelected = groupSelected === group.tables.length;
                  const someGroupSelected = groupSelected > 0 && !allGroupSelected;

                  return (
                    <div key={groupKey} className="space-y-2">
                      <div
                        className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 rounded-md p-1.5 -ml-1.5"
                        onClick={() => toggleGroup(group.tables)}
                      >
                        <Checkbox
                          checked={allGroupSelected ? true : someGroupSelected ? 'indeterminate' : false}
                          onCheckedChange={() => toggleGroup(group.tables)}
                        />
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{group.label}</span>
                        <Badge variant="outline" className="ml-auto text-xs">
                          {groupSelected}/{group.tables.length}
                        </Badge>
                      </div>
                      <div className="ml-8 grid grid-cols-1 sm:grid-cols-2 gap-1">
                        {group.tables.map(table => (
                          <label
                            key={table}
                            className="flex items-center gap-2 cursor-pointer hover:bg-muted/30 rounded px-2 py-1 text-sm"
                          >
                            <Checkbox
                              checked={selectedTables.has(table)}
                              onCheckedChange={() => toggleTable(table)}
                            />
                            <Table2 className="w-3 h-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{table}</span>
                          </label>
                        ))}
                      </div>
                      <Separator />
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <Button
              onClick={handleExport}
              disabled={exporting || selectedTables.size === 0}
              className="w-full gap-2"
            >
              {exporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang xuất...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Xuất {selectedTables.size} bảng
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Import Section */}
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
              onClick={() => fileInputRef.current?.click()}
              className="w-full gap-2"
            >
              <FileJson className="w-4 h-4" />
              Chọn file JSON để import
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Import Preview Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
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
              <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                Hủy
              </Button>
              <Button
                onClick={handleImport}
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

      {/* Result Dialog */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
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
            <Button onClick={() => { setShowResultDialog(false); setImportResult(null); setImportPreview(null); }}>
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
