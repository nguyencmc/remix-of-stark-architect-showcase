import { Link } from "react-router-dom";
import { featuredCategories } from "../types";

export function CoursesFeaturedCategories() {
  return (
    <section className="bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
          Khám phá theo chủ đề
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/courses?category=${cat.name}`}
                className="group relative overflow-hidden rounded-xl p-6 bg-card border hover:shadow-lg transition-all"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${cat.color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity`} />
                <Icon className={`w-8 h-8 mb-3 bg-gradient-to-br ${cat.color} text-transparent bg-clip-text`} style={{ stroke: 'currentColor' }} />
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {cat.courses} khóa học
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
