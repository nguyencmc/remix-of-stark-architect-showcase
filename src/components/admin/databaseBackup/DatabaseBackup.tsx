import { useDatabaseBackup } from './useDatabaseBackup';
import { ExportCard } from './ExportCard';
import { SchemaExportCard } from './SchemaExportCard';
import { ImportCard } from './ImportCard';
import { ImportPreviewDialog } from './ImportPreviewDialog';
import { ImportResultDialog } from './ImportResultDialog';

export function DatabaseBackup() {
  const {
    fileInputRef,
    selectedTables,
    exporting,
    exportingSchema,
    toggleTable,
    toggleGroup,
    selectAll,
    selectNone,
    handleExport,
    handleExportSchema,
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
  } = useDatabaseBackup();

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
        <ExportCard
          selectedTables={selectedTables}
          exporting={exporting}
          toggleTable={toggleTable}
          toggleGroup={toggleGroup}
          selectAll={selectAll}
          selectNone={selectNone}
          onExport={handleExport}
        />

        <SchemaExportCard
          exportingSchema={exportingSchema}
          onExportSchema={handleExportSchema}
        />

        <ImportCard
          onTriggerFileSelect={() => fileInputRef.current?.click()}
        />
      </div>

      <ImportPreviewDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        importPreview={importPreview}
        importSelectedTables={importSelectedTables}
        importing={importing}
        toggleImportTable={toggleImportTable}
        onImport={handleImport}
      />

      <ImportResultDialog
        open={showResultDialog}
        importResult={importResult}
        onClose={closeResultDialog}
      />
    </>
  );
}
