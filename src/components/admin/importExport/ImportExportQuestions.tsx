import { useImportExport } from './useImportExport';
import { ImportDropdown } from './ImportDropdown';
import { ExportDropdown } from './ExportDropdown';
import { ManualInputDialog } from './ManualInputDialog';
import type { ImportExportQuestionsProps } from './types';

export const ImportExportQuestions = ({ questions, onImport }: ImportExportQuestionsProps) => {
  const {
    fileInputRef,
    importing,
    showManualDialog,
    setShowManualDialog,
    manualInput,
    setManualInput,
    handleFileImport,
    handleManualImport,
    downloadTemplate,
    exportToCSV,
    exportToTXT,
    exportToJSON,
  } = useImportExport(questions, onImport);

  return (
    <>
      <div className="flex gap-2">
        <ImportDropdown
          importing={importing}
          fileInputRef={fileInputRef}
          onOpenManualDialog={() => setShowManualDialog(true)}
          onFileImport={handleFileImport}
        />
        <ExportDropdown
          questionsCount={questions.length}
          onExportCSV={exportToCSV}
          onExportTXT={exportToTXT}
          onExportJSON={exportToJSON}
          onDownloadTemplate={downloadTemplate}
        />
      </div>

      <ManualInputDialog
        open={showManualDialog}
        onOpenChange={setShowManualDialog}
        manualInput={manualInput}
        onManualInputChange={setManualInput}
        onImport={handleManualImport}
      />
    </>
  );
};
