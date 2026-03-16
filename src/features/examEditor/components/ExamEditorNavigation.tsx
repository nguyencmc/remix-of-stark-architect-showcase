import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Save, Loader2 } from 'lucide-react';

interface ExamEditorNavigationProps {
  currentStep: number;
  saving: boolean;
  onNext: () => void;
  onBack: () => void;
  onSave: () => void;
}

export function ExamEditorNavigation({
  currentStep,
  saving,
  onNext,
  onBack,
  onSave,
}: ExamEditorNavigationProps) {
  return (
    <div className="flex items-center justify-between max-w-3xl mx-auto pt-6 border-t">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={currentStep === 1}
        className="gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại
      </Button>

      <div className="flex gap-3">
        {currentStep < 3 ? (
          <Button onClick={onNext} className="gap-2">
            Tiếp theo
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={onSave} disabled={saving} className="gap-2">
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Lưu đề thi
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
