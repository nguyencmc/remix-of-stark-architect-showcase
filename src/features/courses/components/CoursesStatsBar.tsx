export function CoursesStatsBar() {
  return (
    <section className="bg-card border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl md:text-3xl font-bold text-foreground">10,000+</div>
            <div className="text-muted-foreground text-sm">Khóa học</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-foreground">500+</div>
            <div className="text-muted-foreground text-sm">Giảng viên</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-foreground">1M+</div>
            <div className="text-muted-foreground text-sm">Học viên</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-foreground">4.8</div>
            <div className="text-muted-foreground text-sm">Đánh giá trung bình</div>
          </div>
        </div>
      </div>
    </section>
  );
}
