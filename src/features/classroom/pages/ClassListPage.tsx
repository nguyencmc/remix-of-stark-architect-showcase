import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Users, BookOpen, LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissionsContext } from '@/contexts/PermissionsContext';
import { useClasses } from '../hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ClassListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isTeacher, isAdmin } = usePermissionsContext();
  const { data: classes, isLoading } = useClasses();

  if (!user) {
    navigate('/auth');
    return null;
  }

  const canCreate = isTeacher || isAdmin;

  return (
    <div className="min-h-screen bg-background">
<main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Lớp học của tôi</h1>
            <p className="text-muted-foreground mt-1">
              Quản lý và tham gia các lớp học
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/classes/join')}>
              <LogIn className="mr-2 h-4 w-4" />
              Tham gia lớp
            </Button>
            {canCreate && (
              <Button onClick={() => navigate('/classes/new')}>
                <Plus className="mr-2 h-4 w-4" />
                Tạo lớp mới
              </Button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : !classes || classes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Chưa có lớp học nào</h3>
              <p className="text-muted-foreground mb-4">
                {canCreate
                  ? 'Tạo lớp học mới hoặc tham gia bằng mã lớp'
                  : 'Tham gia lớp học bằng mã lớp từ giáo viên'}
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => navigate('/classes/join')}>
                  <LogIn className="mr-2 h-4 w-4" />
                  Tham gia lớp
                </Button>
                {canCreate && (
                  <Button onClick={() => navigate('/classes/new')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo lớp mới
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => (
              <Link key={cls.id} to={`/classes/${cls.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <div 
                    className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-t-lg"
                    style={cls.cover_image ? { 
                      backgroundImage: `url(${cls.cover_image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    } : undefined}
                  />
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-1">{cls.title}</CardTitle>
                      {!cls.is_active && (
                        <Badge variant="secondary">Đã đóng</Badge>
                      )}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {cls.description || 'Không có mô tả'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      <span>Mã lớp: <code className="font-mono bg-muted px-1 rounded">{cls.class_code}</code></span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ClassListPage;
