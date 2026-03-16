import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { CourseCertificate } from '@/components/course/CourseCertificate';
import { Play, CheckCircle, Circle, ChevronRight, ClipboardList } from 'lucide-react';
import type { Course, Section, Lesson, LessonProgress } from '../types';

interface ViewerSidebarProps {
  courseId: string;
  course: Course;
  sections: Section[];
  currentLesson: Lesson | null;
  progress: Map<string, LessonProgress>;
  sidebarOpen: boolean;
  progressPercentage: number;
  completedLessons: number;
  totalLessons: number;
  onCloseSidebar: () => void;
  onLessonSelect: (lesson: Lesson) => void;
}

export function ViewerSidebar({
  courseId,
  course,
  sections,
  currentLesson,
  progress,
  sidebarOpen,
  progressPercentage,
  completedLessons,
  totalLessons,
  onCloseSidebar,
  onLessonSelect,
}: ViewerSidebarProps) {
  return (
    <aside className={`fixed right-0 top-0 h-full w-80 bg-card border-l transform transition-transform duration-300 z-50 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0`}>
      <div className="h-full flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Nội dung khóa học</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCloseSidebar}
              className="lg:hidden"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{completedLessons}/{totalLessons} bài học</span>
            <span>•</span>
            <span>{progressPercentage}% hoàn thành</span>
          </div>
          <Progress value={progressPercentage} className="mt-2 h-1" />

          {/* Certificate Section */}
          <div className="mt-4 pt-4 border-t">
            <CourseCertificate
              courseId={courseId}
              courseTitle={course.title}
              creatorName={course.creator_name}
              progressPercentage={progressPercentage}
            />
          </div>
        </div>

        {/* Course Sections */}
        <ScrollArea className="flex-1">
          <Accordion type="multiple" defaultValue={sections.map(s => s.id)} className="px-2">
            {sections.map((section, sectionIndex) => (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger className="py-3 px-2 hover:no-underline">
                  <div className="flex items-center gap-2 text-left">
                    <span className="font-medium text-sm">
                      Phần {sectionIndex + 1}: {section.title}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1">
                    {section.lessons.map((lesson, lessonIndex) => {
                      const isCompleted = progress.get(lesson.id)?.is_completed;
                      const isCurrent = currentLesson?.id === lesson.id;

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => onLessonSelect(lesson)}
                          className={`w-full flex items-start gap-3 p-2 rounded-lg text-left transition-colors ${
                            isCurrent
                              ? 'bg-primary/10 text-primary'
                              : 'hover:bg-muted'
                          }`}
                        >
                          <div className="mt-0.5">
                            {isCompleted ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Circle className={`h-4 w-4 ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className={`text-sm truncate ${isCurrent ? 'font-medium' : ''}`}>
                                {lessonIndex + 1}. {lesson.title}
                              </p>
                              {lesson.content_type === 'test' && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                  Test
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                              {lesson.content_type === 'test' ? (
                                <ClipboardList className="h-3 w-3" />
                              ) : (
                                <Play className="h-3 w-3" />
                              )}
                              <span>{lesson.duration_minutes || 0} phút</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </div>
    </aside>
  );
}
