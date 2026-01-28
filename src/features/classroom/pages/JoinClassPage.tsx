import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, KeyRound } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useJoinClass } from '../hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const JoinClassPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const joinClass = useJoinClass();
  
  const [classCode, setClassCode] = useState('');

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classCode.trim()) return;
    
    await joinClass.mutateAsync(classCode.trim());
    // Navigate back to classes list since pending approval is needed
    navigate('/classes');
  };

  return (
    <div className="min-h-screen bg-background">
<main className="container mx-auto px-4 py-8 max-w-md">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/classes')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <KeyRound className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Tham gia lớp học</CardTitle>
            <CardDescription>
              Nhập mã lớp học được giáo viên cung cấp để tham gia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="code">Mã lớp học</Label>
                <Input
                  id="code"
                  placeholder="VD: ABC123"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                  className="text-center text-lg font-mono tracking-widest"
                  maxLength={10}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={!classCode.trim() || joinClass.isPending}
              >
                {joinClass.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Tham gia
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default JoinClassPage;
