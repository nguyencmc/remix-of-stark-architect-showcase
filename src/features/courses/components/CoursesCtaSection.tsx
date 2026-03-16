import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";

interface CoursesCtaSectionProps {
  user: User | null;
}

export function CoursesCtaSection({ user }: CoursesCtaSectionProps) {
  return (
    <section className="bg-gradient-to-r from-primary to-accent py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Bắt đầu học ngay hôm nay
        </h2>
        <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
          Tham gia cộng đồng hơn 1 triệu học viên và nâng cao kỹ năng của bạn với các khóa học chất lượng
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" className="px-8">
            Khám phá khóa học
          </Button>
          {!user && (
            <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 px-8">
              Đăng ký miễn phí
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
