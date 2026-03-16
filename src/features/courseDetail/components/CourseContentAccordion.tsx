import { Badge } from "@/components/ui/badge";
import { PlayCircle, FileText, ClipboardList, Lock, BookOpen } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Section } from "../types";

interface CourseContentAccordionProps {
  sections: Section[];
  totalLessons: number;
  totalHours: number;
  formatDuration: (minutes: number | null) => string;
}

function getLessonIcon(contentType: string | null) {
  switch (contentType) {
    case 'video':
      return <PlayCircle className="w-4 h-4 text-muted-foreground" />;
    case 'document':
      return <FileText className="w-4 h-4 text-muted-foreground" />;
    case 'test':
      return <ClipboardList className="w-4 h-4 text-orange-500" />;
    default:
      return <PlayCircle className="w-4 h-4 text-muted-foreground" />;
  }
}

export function CourseContentAccordion({
  sections,
  totalLessons,
  totalHours,
  formatDuration,
}: CourseContentAccordionProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Nội dung khóa học</h2>
        <div className="text-sm text-muted-foreground">
          {sections.length} phần • {totalLessons} bài học {totalHours > 0 && `• ${totalHours} giờ`}
        </div>
      </div>

      {sections.length > 0 ? (
        <Accordion type="multiple" className="border rounded-xl overflow-hidden">
          {sections.map((section, index) => (
            <AccordionItem key={section.id} value={`section-${section.id}`} className="border-b last:border-b-0">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                <div className="flex items-center gap-3 text-left">
                  <span className="font-semibold">Phần {index + 1}: {section.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {section.lessons.length} bài học
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-0 pb-0">
                <div className="divide-y">
                  {section.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {getLessonIcon(lesson.content_type)}
                        <span className="text-sm">{lesson.title}</span>
                        {lesson.is_preview && (
                          <Badge variant="secondary" className="text-xs">
                            Xem trước
                          </Badge>
                        )}
                        {lesson.content_type === 'test' && (
                          <Badge variant="outline" className="text-xs border-orange-500 text-orange-500">
                            Test
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {!lesson.is_preview && <Lock className="w-3 h-3 text-muted-foreground" />}
                        <span className="text-sm text-muted-foreground">
                          {formatDuration(lesson.duration_minutes)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="border rounded-xl p-8 text-center text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Nội dung khóa học đang được cập nhật</p>
        </div>
      )}
    </div>
  );
}
