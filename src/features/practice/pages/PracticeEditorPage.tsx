import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Target, Plus, ArrowLeft, Save, X, Globe, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { CreatePracticeQuestionsStep } from '@/components/admin/practice/CreatePracticeQuestionsStep';
import type { PracticeQuestion } from '@/components/admin/practice/PracticeQuestionEditor';

export default function PracticeEditorPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditMode);

  // Question Set fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('medium');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isPublished, setIsPublished] = useState(false); // Default private
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  // Questions
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchCategories();
    if (isEditMode && id) {
      fetchData();
    }
  }, [user, isEditMode, id]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('exam_categories').select('id, name').order('name');
    setCategories(data || []);
  };

  const fetchData = async () => {
    setLoading(true);

    const { data: setData, error: setError } = await supabase
      .from('question_sets')
      .select('*')
      .eq('id', id)
      .eq('creator_id', user?.id)
      .single();

    if (setError || !setData) {
      toast.error('Không tìm thấy bộ đề hoặc bạn không có quyền chỉnh sửa');
      navigate('/practice/my-sets');
      return;
    }

    setTitle(setData.title);
    setDescription(setData.description || '');
    setLevel(setData.level || 'medium');
    setTags(setData.tags || []);
    setIsPublished(setData.is_published ?? false);
    setCategoryId(setData.category_id || null);

    const { data: questionsData } = await supabase
      .from('practice_questions')
      .select('*')
      .eq('set_id', id)
      .order('question_order', { ascending: true });

    if (questionsData) {
      setQuestions(
        questionsData.map(q => ({
          id: q.id,
          question_text: q.question_text,
          question_image: q.question_image,
          option_a: q.option_a,
          option_b: q.option_b,
          option_c: q.option_c || '',
          option_d: q.option_d || '',
          option_e: q.option_e || '',
          option_f: q.option_f || '',
          correct_answer: q.correct_answer,
          explanation: q.explanation || '',
          difficulty: q.difficulty || 'medium',
          tags: q.tags || [],
          question_order: q.question_order || 0,
        }))
      );
    }

    setLoading(false);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Vui lòng nhập tên bộ đề');
      return;
    }

    setSaving(true);

    try {
      let setId = id;

      if (isEditMode) {
        const { error } = await supabase
          .from('question_sets')
          .update({
            title,
            description: description || null,
            level,
            tags,
            is_published: isPublished,
            category_id: categoryId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('question_sets')
          .insert({
            title,
            description: description || null,
            level,
            tags,
            is_published: isPublished,
            category_id: categoryId,
            question_count: 0,
            creator_id: user?.id,
          })
          .select()
          .single();

        if (error) throw error;
        setId = data.id;
      }

      // Handle questions
      const activeQuestions = questions.filter(q => !q.isDeleted);
      const deletedQuestions = questions.filter(q => q.isDeleted && q.id);
      const newQuestions = activeQuestions.filter(q => q.isNew);
      const existingQuestions = activeQuestions.filter(q => !q.isNew && q.id);

      for (const q of deletedQuestions) {
        await supabase.from('practice_questions').delete().eq('id', q.id!);
      }

      for (const q of existingQuestions) {
        await supabase
          .from('practice_questions')
          .update({
            question_text: q.question_text,
            option_a: q.option_a,
            option_b: q.option_b,
            option_c: q.option_c || null,
            option_d: q.option_d || null,
            option_e: q.option_e || null,
            option_f: q.option_f || null,
            correct_answer: q.correct_answer,
            explanation: q.explanation || null,
            difficulty: q.difficulty,
            tags: q.tags,
            question_order: q.question_order,
          })
          .eq('id', q.id!);
      }

      if (newQuestions.length > 0) {
        const { error } = await supabase.from('practice_questions').insert(
          newQuestions.map(q => ({
            set_id: setId,
            question_text: q.question_text,
            option_a: q.option_a,
            option_b: q.option_b,
            option_c: q.option_c || null,
            option_d: q.option_d || null,
            option_e: q.option_e || null,
            option_f: q.option_f || null,
            correct_answer: q.correct_answer,
            explanation: q.explanation || null,
            difficulty: q.difficulty,
            tags: q.tags,
            question_order: q.question_order,
            creator_id: user?.id,
          }))
        );

        if (error) throw error;
      }

      await supabase
        .from('question_sets')
        .update({ question_count: activeQuestions.length })
        .eq('id', setId);

      toast.success(isEditMode ? 'Đã cập nhật bộ đề' : 'Đã tạo bộ đề mới');
      navigate('/practice/my-sets');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Không thể lưu bộ đề');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/practice/my-sets">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
                <Target className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                {isEditMode ? 'Chỉnh sửa bộ đề' : 'Tạo bộ đề mới'}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {isPublished ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <Globe className="w-3.5 h-3.5" /> Công khai
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Riêng tư
                  </span>
                )}
              </p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="w-4 h-4" />
            {saving ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: Question Set Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin bộ đề</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tên bộ đề *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="VD: Ôn tập Chương 1..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Mô tả ngắn về bộ đề..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Danh mục</Label>
                  <Select
                    value={categoryId || 'none'}
                    onValueChange={v => setCategoryId(v === 'none' ? null : v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- Không chọn --</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Độ khó</Label>
                  <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Dễ</SelectItem>
                      <SelectItem value="medium">Trung bình</SelectItem>
                      <SelectItem value="hard">Khó</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      placeholder="Thêm tag..."
                      onKeyDown={e =>
                        e.key === 'Enter' && (e.preventDefault(), addTag())
                      }
                    />
                    <Button type="button" variant="outline" onClick={addTag}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap mt-2">
                      {tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          {tag}
                          <button onClick={() => removeTag(tag)}>
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <Label htmlFor="published" className="font-medium">
                      Công khai (chia sẻ)
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Bộ đề công khai sẽ hiển thị trong phần Đề thi
                    </p>
                  </div>
                  <Switch
                    id="published"
                    checked={isPublished}
                    onCheckedChange={setIsPublished}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Questions Editor */}
          <div className="lg:col-span-2">
            <CreatePracticeQuestionsStep
              questions={questions}
              onQuestionsChange={setQuestions}
              defaultDifficulty={level}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
