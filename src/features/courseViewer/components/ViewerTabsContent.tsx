import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CourseTestTaking } from '@/components/course/CourseTestTaking';
import { LessonNotes } from '@/components/course/LessonNotes';
import { CourseQA } from '@/components/course/CourseQA';
import { FileText, MessageSquare, BookOpen, Download, File, ClipboardList } from 'lucide-react';
import type { Course, Lesson } from '../types';

interface ViewerTabsContentProps {
  courseId: string;
  course: Course;
  currentLesson: Lesson | null;
  onMarkComplete: (lessonId: string) => void;
}

export function ViewerTabsContent({
  courseId,
  course,
  currentLesson,
  onMarkComplete,
}: ViewerTabsContentProps) {
  return (
    <div className="flex-1 p-4 lg:p-6">
      <Tabs defaultValue={currentLesson?.content_type === 'test' ? 'test' : 'overview'} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Tổng quan
          </TabsTrigger>
          {currentLesson?.content_type === 'test' && (
            <TabsTrigger value="test" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Bài kiểm tra
            </TabsTrigger>
          )}
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Ghi chú
          </TabsTrigger>
          <TabsTrigger value="qa" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Hỏi đáp
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold mb-2">{currentLesson?.title}</h2>
              {currentLesson?.description && (
                <p className="text-muted-foreground">{currentLesson.description}</p>
              )}
            </div>

            {currentLesson?.attachments && currentLesson.attachments.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <File className="w-4 h-4" />
                    Tài liệu đính kèm
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {currentLesson.attachments.map((attachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
                    >
                      <FileText className="w-5 h-5 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{attachment.file_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(attachment.file_size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Download className="w-4 h-4 text-muted-foreground" />
                    </a>
                  ))}
                </CardContent>
              </Card>
            )}

            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Về khóa học này</h3>
              <p className="text-sm text-muted-foreground">{course.description}</p>
              {course.creator_name && (
                <p className="text-sm mt-2">
                  <span className="text-muted-foreground">Giảng viên:</span> {course.creator_name}
                </p>
              )}
            </div>
          </div>
        </TabsContent>

        {currentLesson?.content_type === 'test' && (
          <TabsContent value="test">
            <CourseTestTaking
              lessonId={currentLesson.id}
              onComplete={() => onMarkComplete(currentLesson.id)}
            />
          </TabsContent>
        )}

        <TabsContent value="notes">
          {currentLesson && (
            <LessonNotes
              lessonId={currentLesson.id}
              lessonTitle={currentLesson.title}
              courseId={courseId}
            />
          )}
        </TabsContent>

        <TabsContent value="qa">
          {currentLesson && (
            <CourseQA
              courseId={courseId}
              lessonId={currentLesson.id}
              instructorId={course?.creator_id}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
