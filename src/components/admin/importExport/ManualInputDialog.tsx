import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ManualInputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  manualInput: string;
  onManualInputChange: (value: string) => void;
  onImport: () => void;
}

export const ManualInputDialog = ({
  open,
  onOpenChange,
  manualInput,
  onManualInputChange,
  onImport,
}: ManualInputDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Nhập câu hỏi thủ công</DialogTitle>
        <DialogDescription>
          Hỗ trợ các định dạng: JSON, CSV, hoặc TXT. Hỗ trợ tối đa 8 đáp án (A-H).
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="manual-input">Nội dung câu hỏi</Label>
          <Textarea
            id="manual-input"
            value={manualInput}
            onChange={(e) => onManualInputChange(e.target.value)}
            placeholder={`Ví dụ TXT:\n\nQuestion 1: Thủ đô Việt Nam là gì?\nA. Hà Nội\nB. Hồ Chí Minh\nC. Đà Nẵng\nD. Huế\nE. Hải Phòng\nF. Cần Thơ\nCorrect: A\nExplanation: Hà Nội là thủ đô của Việt Nam\n\nVí dụ CSV:\nThủ đô Việt Nam là gì?,Hà Nội,Hồ Chí Minh,Đà Nẵng,Huế,,,,,A,Hà Nội là thủ đô`}
            rows={12}
          />
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
          <p className="font-medium">Hướng dẫn định dạng:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li><strong>TXT:</strong> Mỗi câu hỏi cách nhau bằng dòng trống. Câu hỏi bắt đầu bằng &quot;Question&quot; hoặc &quot;Câu&quot;. Đáp án A-H trên từng dòng.</li>
            <li><strong>CSV:</strong> Dùng file mẫu 9 cột: <code>Title, Topic, Question, OptionA, OptionB, OptionC, OptionD, CorrectAnswer, Explanation</code></li>
            <li><strong>JSON:</strong> Mảng objects với các trường question_text, option_a đến option_h, correct_answer, explanation</li>
            <li><strong>Đáp án đúng:</strong> 1 đáp án → <code>A</code> &nbsp;|&nbsp; Nhiều đáp án → <code>A,C</code> hoặc <code>A;C</code> (phân cách bởi dấu phẩy hoặc chấm phẩy)</li>
          </ul>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={onImport} disabled={!manualInput.trim()}>
            Import
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);
