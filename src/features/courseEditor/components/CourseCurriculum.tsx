import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Plus, Trash2, GripVertical, Video } from 'lucide-react';
import { LessonEditor } from '@/components/admin/course/LessonEditor';
import { CourseTestEditor } from '@/components/admin/course/CourseTestEditor';
import type { CourseSection, CourseLesson } from '@/features/courseEditor/types';

interface CourseCurriculumProps {
  sections: CourseSection[];
  onAddSection: () => void;
  onUpdateSection: (index: number, data: Partial<CourseSection>) => void;
  onRemoveSection: (index: number) => void;
  onAddLesson: (sectionIndex: number) => void;
  onUpdateLesson: (sectionIndex: number, lessonIndex: number, data: Partial<CourseLesson>) => void;
  onRemoveLesson: (sectionIndex: number, lessonIndex: number) => void;
}

export function CourseCurriculum({
  sections,
  onAddSection,
  onUpdateSection,
  onRemoveSection,
  onAddLesson,
  onUpdateLesson,
  onRemoveLesson,
}: CourseCurriculumProps) {
  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Nội dung khóa học</CardTitle>
          <CardDescription>Các phần và bài học trong khóa học</CardDescription>
        </div>
        <Button onClick={onAddSection} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Thêm phần
        </Button>
      </CardHeader>
      <CardContent>
        {sections.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Chưa có nội dung nào</p>
            <Button onClick={onAddSection} variant="outline" className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Thêm phần đầu tiên
            </Button>
          </div>
        ) : (
          <Accordion type="multiple" className="space-y-4">
            {sections.map((section, sectionIndex) => (
              <AccordionItem key={sectionIndex} value={`section-${sectionIndex}`} className="border rounded-lg">
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex items-center gap-3 flex-1">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{section.title}</span>
                    <Badge variant="outline" className="ml-auto mr-2">
                      {section.lessons.length} bài học
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Tên phần</Label>
                      <Input
                        value={section.title}
                        onChange={(e) => onUpdateSection(sectionIndex, { title: e.target.value })}
                        placeholder="VD: Giới thiệu khóa học"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Mô tả</Label>
                      <Textarea
                        value={section.description}
                        onChange={(e) => onUpdateSection(sectionIndex, { description: e.target.value })}
                        placeholder="Mô tả ngắn về phần này..."
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <Label>Bài học</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAddLesson(sectionIndex)}
                        className="gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Thêm bài
                      </Button>
                    </div>

                    {section.lessons.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Chưa có bài học nào
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {section.lessons.map((lesson, lessonIndex) => (
                          <div key={lessonIndex}>
                            <LessonEditor
                              lesson={lesson}
                              sectionIndex={sectionIndex}
                              lessonIndex={lessonIndex}
                              onUpdate={(data) => onUpdateLesson(sectionIndex, lessonIndex, data)}
                              onRemove={() => onRemoveLesson(sectionIndex, lessonIndex)}
                            />
                            {lesson.content_type === 'test' && lesson.id && (
                              <div className="mt-2 ml-10">
                                <CourseTestEditor
                                  lessonId={lesson.id}
                                  lessonTitle={lesson.title}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onRemoveSection(sectionIndex)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Xóa phần này
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
