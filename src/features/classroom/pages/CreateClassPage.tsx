import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissionsContext } from '@/contexts/PermissionsContext';
import { useCreateClass } from '../hooks';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const CreateClassPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isTeacher, isAdmin } = usePermissionsContext();
  const createClass = useCreateClass();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (!isTeacher && !isAdmin) {
    navigate('/classes');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    const result = await createClass.mutateAsync({
      title: title.trim(),
      description: description.trim() || undefined,
    });
    
    navigate(`/classes/${result.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/classes')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Tạo lớp học mới</CardTitle>
            <CardDescription>
              Tạo lớp học để quản lý học viên, khóa học và bài tập
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Tên lớp học *</Label>
                <Input
                  id="title"
                  placeholder="VD: Lớp Tiếng Anh 12A1"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  placeholder="Mô tả ngắn về lớp học..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/classes')}
                >
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  disabled={!title.trim() || createClass.isPending}
                >
                  {createClass.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Tạo lớp học
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateClassPage;
