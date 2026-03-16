import { Card, CardContent } from "@/components/ui/card";
import { Shield, Camera } from "lucide-react";

export function ExamProctoringCard() {
  return (
    <Card className="border-orange-500/20 bg-orange-500/5">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm text-orange-600 dark:text-orange-400 mb-1">
              Chế độ thi có giám sát
            </p>
            <p className="text-sm text-muted-foreground">
              Bài thi được giám sát qua webcam. Đảm bảo camera hoạt động và bạn đang ở môi trường yên tĩnh trước khi bắt đầu.
            </p>
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <Camera className="w-3.5 h-3.5" />
              <span>Camera sẽ được bật trong suốt thời gian làm bài</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
