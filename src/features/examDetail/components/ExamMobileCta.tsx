import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface ExamMobileCtaProps {
  onStart: () => void;
}

export function ExamMobileCta({ onStart }: ExamMobileCtaProps) {
  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t border-border">
        <Button size="lg" className="w-full gap-2 h-12 text-base" onClick={onStart}>
          <Play className="w-5 h-5 fill-current" />
          Bắt đầu làm bài
        </Button>
      </div>
      <div className="md:hidden h-20" />
    </>
  );
}
