import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Users, Clock, ArrowRight, BookOpen } from "lucide-react";

interface Course {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    price: number | null;
    duration_hours: number | null;
    level: string | null;
    category: string | null;
    view_count: number | null;
}

export const FeaturedCoursesSection = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            const { data, error } = await supabase
                .from("courses")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(3);

            if (!error && data) {
                setCourses(data);
            }
            setLoading(false);
        };

        fetchCourses();
    }, []);

    // Generate random stats for demo
    const getRandomRating = () => (4 + Math.random()).toFixed(1);
    const getRandomStudents = () => Math.floor(Math.random() * 5000) + 500;

    if (loading) {
        return (
            <section className="py-16 lg:py-24 bg-background">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="text-center mb-12">
                        <Skeleton className="h-10 w-64 mx-auto mb-4" />
                        <Skeleton className="h-6 w-96 mx-auto" />
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-80 rounded-xl" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (courses.length === 0) {
        return null;
    }

    return (
        <section className="py-16 lg:py-24 bg-background">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-sm font-medium">Khóa học nổi bật</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        Khám phá khóa học chất lượng
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Các khóa học được thiết kế bởi chuyên gia, giúp bạn nâng cao kiến thức một cách hiệu quả
                    </p>
                </div>

                {/* Courses Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {courses.map((course) => (
                        <Link key={course.id} to={`/courses/${course.slug}`}>
                            <Card className="group h-full overflow-hidden border-border/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300">
                                {/* Thumbnail */}
                                <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                                    {course.image_url ? (
                                        <img
                                            src={course.image_url}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <BookOpen className="w-12 h-12 text-primary/50" />
                                        </div>
                                    )}
                                    {/* Level Badge */}
                                    {course.level && (
                                        <Badge className="absolute top-3 left-3 bg-background/90 text-foreground capitalize">
                                            {course.level}
                                        </Badge>
                                    )}
                                </div>

                                <CardContent className="p-5">
                                    {/* Category */}
                                    <p className="text-xs font-medium text-primary uppercase tracking-wider mb-2">
                                        {course.category || "Lập trình"}
                                    </p>

                                    {/* Title */}
                                    <h3 className="font-bold text-foreground line-clamp-2 mb-3 group-hover:text-primary transition-colors">
                                        {course.title}
                                    </h3>

                                    {/* Stats */}
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-medium text-foreground">{getRandomRating()}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            <span>{getRandomStudents().toLocaleString()}</span>
                                        </div>
                                        {course.duration_hours && (
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{course.duration_hours}h</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                        {course.price && course.price > 0 ? (
                                            <span className="text-lg font-bold text-primary">
                                                {course.price.toLocaleString()}đ
                                            </span>
                                        ) : (
                                            <span className="text-lg font-bold text-green-600">Miễn phí</span>
                                        )}
                                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center">
                    <Link to="/courses">
                        <Button size="lg" variant="outline" className="gap-2 group">
                            Xem tất cả khóa học
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};
