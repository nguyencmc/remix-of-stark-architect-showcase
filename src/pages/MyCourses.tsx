import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Heart } from "lucide-react";
import {
  useMyCourses,
  LoginPrompt,
  MyCoursesHeader,
  EnrolledCourseCard,
  WishlistCourseCard,
  EmptyEnrolledState,
  EmptyWishlistState,
} from "@/features/myCourses";

const MyCourses = () => {
  const {
    user,
    enrollments,
    enrollmentsLoading,
    wishlistCourses,
    wishlistLoading,
    isInWishlist,
    toggleWishlist,
    refetchWishlist,
  } = useMyCourses();

  if (!user) {
    return <LoginPrompt />;
  }

  return (
    <div className="min-h-screen bg-background">
      <MyCoursesHeader />

      {/* Content with Tabs */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="enrolled" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="enrolled" className="gap-2">
                <GraduationCap className="w-4 h-4" />
                Đã đăng ký ({enrollments?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="gap-2">
                <Heart className="w-4 h-4" />
                Yêu thích ({wishlistCourses?.length || 0})
              </TabsTrigger>
            </TabsList>

            {/* Enrolled Courses Tab */}
            <TabsContent value="enrolled">
              {enrollmentsLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <Skeleton className="aspect-video" />
                      <CardContent className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <Skeleton className="h-2 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : enrollments && enrollments.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrollments.map((enrollment) => (
                    <EnrolledCourseCard
                      key={enrollment.id}
                      enrollment={enrollment}
                    />
                  ))}
                </div>
              ) : (
                <EmptyEnrolledState />
              )}
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist">
              {wishlistLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <Skeleton className="aspect-video" />
                      <CardContent className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : wishlistCourses && wishlistCourses.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistCourses.map((item) => (
                    <WishlistCourseCard
                      key={item.id}
                      item={item}
                      isInWishlist={isInWishlist(item.course_id || "")}
                      onToggleWishlist={async () => {
                        await toggleWishlist(item.course_id || "");
                        refetchWishlist();
                      }}
                    />
                  ))}
                </div>
              ) : (
                <EmptyWishlistState />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default MyCourses;