import { GraduationCap } from "lucide-react";

export function MyCoursesHeader() {
  return (
    <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Khóa học của tôi</h1>
            <p className="text-muted-foreground">
              Quản lý và theo dõi quá trình học tập
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
