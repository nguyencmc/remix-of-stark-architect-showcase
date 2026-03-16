import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BookOpen,
  CheckCircle2,
  Heart,
  GraduationCap,
  Plus,
  Award,
  ExternalLink
} from 'lucide-react';
import { useMyCoursesData } from './useMyCoursesData';
import { EnrolledCourseCard } from './EnrolledCourseCard';
import { WishlistCourseCard } from './WishlistCourseCard';
import { EmptyState } from './EmptyState';
import type { Certificate } from './types';

function CertificateCard({ certificate }: { certificate: Certificate }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Link to={`/verify-certificate/${certificate.certificate_number}`}>
      <Card className="border-border/50 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer overflow-hidden group">
        <div className="aspect-video relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Award className="w-16 h-16 mx-auto text-primary mb-2" />
              <p className="text-xs font-mono text-muted-foreground">
                #{certificate.certificate_number.slice(0, 8)}...
              </p>
            </div>
          </div>
          <Badge className="absolute top-2 right-2 bg-primary">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Đã cấp
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2">
            {certificate.course?.title || 'Khóa học'}
          </h3>
          <p className="text-xs text-muted-foreground mb-2">
            {certificate.course?.creator_name || 'AI-Exam.cloud'}
          </p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Ngày cấp: {formatDate(certificate.issued_at)}
            </span>
            {certificate.final_score !== null && (
              <Badge variant="secondary" className="text-xs">
                {certificate.final_score}%
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" className="w-full mt-3 gap-2 text-xs">
            <ExternalLink className="w-3 h-3" />
            Xem chứng chỉ
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}

export function MyCoursesSection() {
  const [activeTab, setActiveTab] = useState('enrolled');
  const { enrolledCourses, completedCourses, wishlistCourses, certificates, loading } = useMyCoursesData();

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-primary" />
          Khóa học của tôi
        </h2>
        <Link to="/courses">
          <Button size="sm" variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Khám phá
          </Button>
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="enrolled" className="text-xs sm:text-sm">
            Đang học ({enrolledCourses.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs sm:text-sm">
            Hoàn thành ({completedCourses.length})
          </TabsTrigger>
          <TabsTrigger value="wishlist" className="text-xs sm:text-sm">
            Yêu thích ({wishlistCourses.length})
          </TabsTrigger>
          <TabsTrigger value="certificates" className="text-xs sm:text-sm">
            Chứng chỉ ({certificates.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="enrolled" className="mt-4">
          {enrolledCourses.length === 0 ? (
            <EmptyState icon={BookOpen} title="Chưa có khóa học nào" description="Bạn chưa đăng ký khóa học nào" actionLabel="Khám phá khóa học" actionHref="/courses" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {enrolledCourses.map((item) => (<EnrolledCourseCard key={item.id} course={item} type="enrolled" />))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          {completedCourses.length === 0 ? (
            <EmptyState icon={CheckCircle2} title="Chưa hoàn thành khóa học nào" description="Tiếp tục học để hoàn thành khóa học đầu tiên" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {completedCourses.map((item) => (<EnrolledCourseCard key={item.id} course={item} type="completed" />))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="wishlist" className="mt-4">
          {wishlistCourses.length === 0 ? (
            <EmptyState icon={Heart} title="Danh sách yêu thích trống" description="Thêm khóa học vào yêu thích để xem sau" actionLabel="Khám phá khóa học" actionHref="/courses" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {wishlistCourses.map((item) => (<WishlistCourseCard key={item.id} item={item} />))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="certificates" className="mt-4">
          {certificates.length === 0 ? (
            <EmptyState icon={GraduationCap} title="Chưa có chứng chỉ" description="Hoàn thành khóa học để nhận chứng chỉ" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certificates.map((cert) => (<CertificateCard key={cert.id} certificate={cert} />))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
