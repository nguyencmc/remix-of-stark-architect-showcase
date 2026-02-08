import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { usePermissionsContext } from '@/contexts/PermissionsContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    BookOpen,
    ArrowLeft,
    Save,
    ImageIcon,
    Loader2,
    X,
    Plus,
    Trash2,
    GripVertical,
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/useToast';
import { createAuditLog } from '@/hooks/useAuditLogs';

interface BookCategory {
    id: string;
    name: string;
}

interface Chapter {
    id?: string;
    title: string;
    content: string;
    chapter_order: number;
}

const BookEditor = () => {
    const { id } = useParams();
    const isEditing = !!id;
    const { isAdmin, hasPermission, loading: roleLoading } = usePermissionsContext();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const coverInputRef = useRef<HTMLInputElement>(null);

    const [categories, setCategories] = useState<BookCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);

    // Book fields
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [difficulty, setDifficulty] = useState('intermediate');
    const [pageCount, setPageCount] = useState(0);
    const [coverUrl, setCoverUrl] = useState('');
    const [content, setContent] = useState('');
    const [chapters, setChapters] = useState<Chapter[]>([]);

    const canCreate = isAdmin || hasPermission('books.create');
    const canEdit = isAdmin || hasPermission('books.edit');
    const hasAccess = isEditing ? canEdit : canCreate;

    useEffect(() => {
        if (!roleLoading && !hasAccess) {
            navigate('/');
            toast({
                title: "Không có quyền truy cập",
                description: "Bạn không có quyền " + (isEditing ? "chỉnh sửa" : "tạo") + " sách",
                variant: "destructive",
            });
        }
    }, [hasAccess, roleLoading, navigate]);

    useEffect(() => {
        fetchCategories();
        if (isEditing) {
            fetchBook();
        }
    }, [id]);

    const fetchCategories = async () => {
        const { data } = await supabase.from('book_categories').select('id, name');
        setCategories(data || []);
    };

    const fetchBook = async () => {
        setLoading(true);

        const { data: book, error } = await supabase
            .from('books')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !book) {
            toast({
                title: "Lỗi",
                description: "Không tìm thấy sách",
                variant: "destructive",
            });
            navigate('/admin/books');
            return;
        }

        setTitle(book.title);
        setSlug(book.slug);
        setDescription(book.description || '');
        setAuthorName(book.author_name || '');
        setCategoryId(book.category_id || '');
        setDifficulty(book.difficulty || 'intermediate');
        setPageCount(book.page_count || 0);
        setCoverUrl(book.cover_url || '');
        setContent(book.content || '');

        // Fetch chapters
        const { data: chaptersData } = await supabase
            .from('book_chapters')
            .select('*')
            .eq('book_id', id)
            .order('chapter_order');

        if (chaptersData) {
            setChapters(chaptersData.map(ch => ({
                id: ch.id,
                title: ch.title,
                content: (ch as any).content || '',
                chapter_order: ch.chapter_order,
            })));
        }

        setLoading(false);
    };

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleTitleChange = (value: string) => {
        setTitle(value);
        if (!isEditing) {
            setSlug(generateSlug(value));
        }
    };

    // Upload cover image
    const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast({
                title: "Lỗi",
                description: "Chỉ hỗ trợ file ảnh",
                variant: "destructive",
            });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "Lỗi",
                description: "File ảnh không được vượt quá 5MB",
                variant: "destructive",
            });
            return;
        }

        setUploadingCover(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `books/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('public-assets')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('public-assets')
                .getPublicUrl(fileName);

            setCoverUrl(publicUrl);

            toast({
                title: "Thành công",
                description: "Đã upload ảnh bìa",
            });
        } catch (error: any) {
            console.error('Upload error:', error);
            toast({
                title: "Lỗi upload",
                description: error.message || "Không thể upload ảnh",
                variant: "destructive",
            });
        } finally {
            setUploadingCover(false);
            if (coverInputRef.current) {
                coverInputRef.current.value = '';
            }
        }
    };

    // Chapter management
    const addChapter = () => {
        setChapters([...chapters, {
            title: `Chương ${chapters.length + 1}`,
            content: '',
            chapter_order: chapters.length + 1,
        }]);
    };

    const updateChapter = (index: number, field: keyof Chapter, value: string | number) => {
        const updated = [...chapters];
        updated[index] = { ...updated[index], [field]: value };
        setChapters(updated);
    };

    const removeChapter = (index: number) => {
        const updated = chapters.filter((_, i) => i !== index);
        // Re-order chapters
        updated.forEach((ch, i) => {
            ch.chapter_order = i + 1;
        });
        setChapters(updated);
    };

    const handleSave = async () => {
        if (!title.trim() || !slug.trim()) {
            toast({
                title: "Lỗi",
                description: "Vui lòng nhập tiêu đề và slug",
                variant: "destructive",
            });
            return;
        }

        setSaving(true);

        try {
            let bookId = id;

            if (isEditing) {
                const { error } = await supabase
                    .from('books')
                    .update({
                        title,
                        slug,
                        description: description || null,
                        author_name: authorName || null,
                        category_id: categoryId || null,
                        difficulty,
                        page_count: pageCount,
                        cover_url: coverUrl || null,
                        content: content || null,
                    })
                    .eq('id', id);

                if (error) throw error;
            } else {
                const { data: newBook, error } = await supabase
                    .from('books')
                    .insert({
                        title,
                        slug,
                        description: description || null,
                        author_name: authorName || null,
                        category_id: categoryId || null,
                        difficulty,
                        page_count: pageCount,
                        cover_url: coverUrl || null,
                        content: content || null,
                        creator_id: user?.id,
                    })
                    .select()
                    .single();

                if (error) throw error;
                bookId = newBook.id;
            }

            // Save chapters
            if (bookId && chapters.length > 0) {
                // Delete existing chapters if editing
                if (isEditing) {
                    await supabase.from('book_chapters').delete().eq('book_id', bookId);
                }

                // Insert new chapters
                const chaptersToInsert = chapters.map((ch, idx) => ({
                    book_id: bookId,
                    title: ch.title,
                    content: ch.content || null,
                    chapter_order: idx + 1,
                    position: idx * 2000, // Approximate position for navigation
                }));

                const { error: chaptersError } = await supabase
                    .from('book_chapters')
                    .insert(chaptersToInsert);

                if (chaptersError) {
                    console.error('Error saving chapters:', chaptersError);
                }
            }

            // Create audit log
            await createAuditLog(
                isEditing ? 'update' : 'create',
                'book',
                bookId,
                isEditing ? { title, slug } : null,
                { title, slug, author_name: authorName, page_count: pageCount }
            );

            toast({
                title: "Thành công",
                description: isEditing ? "Đã cập nhật sách" : "Đã tạo sách mới",
            });

            navigate('/admin/books');
        } catch (error: any) {
            toast({
                title: "Lỗi",
                description: error.message || "Không thể lưu sách",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    if (roleLoading || loading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!hasAccess) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link to="/admin/books">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                                <BookOpen className="w-8 h-8 text-emerald-500" />
                                {isEditing ? 'Chỉnh sửa sách' : 'Thêm sách mới'}
                            </h1>
                        </div>
                    </div>
                    <Button onClick={handleSave} disabled={saving} className="gap-2">
                        <Save className="w-4 h-4" />
                        {saving ? 'Đang lưu...' : 'Lưu sách'}
                    </Button>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Basic Info */}
                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle>Thông tin cơ bản</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="title">Tiêu đề *</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    placeholder="Nhập tiêu đề sách"
                                />
                            </div>

                            <div>
                                <Label htmlFor="slug">Slug *</Label>
                                <Input
                                    id="slug"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    placeholder="ten-sach"
                                />
                            </div>

                            <div>
                                <Label htmlFor="author">Tác giả</Label>
                                <Input
                                    id="author"
                                    value={authorName}
                                    onChange={(e) => setAuthorName(e.target.value)}
                                    placeholder="Tên tác giả"
                                />
                            </div>

                            <div>
                                <Label htmlFor="description">Mô tả</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Mô tả về sách"
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="category">Danh mục</Label>
                                    <Select value={categoryId} onValueChange={setCategoryId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn danh mục" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="difficulty">Độ khó</Label>
                                    <Select value={difficulty} onValueChange={setDifficulty}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="beginner">Cơ bản</SelectItem>
                                            <SelectItem value="intermediate">Trung cấp</SelectItem>
                                            <SelectItem value="advanced">Nâng cao</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="pageCount">Số trang</Label>
                                <Input
                                    id="pageCount"
                                    type="number"
                                    value={pageCount}
                                    onChange={(e) => setPageCount(parseInt(e.target.value) || 0)}
                                    min={0}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Cover Image */}
                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ImageIcon className="w-5 h-5" />
                                Ảnh bìa
                            </CardTitle>
                            <CardDescription>
                                Upload ảnh bìa sách (khuyến nghị 600x900px)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-4">
                                {/* Cover preview */}
                                <div
                                    onClick={() => !uploadingCover && coverInputRef.current?.click()}
                                    className={`
                    w-40 h-56 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer transition-colors overflow-hidden
                    ${uploadingCover ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                  `}
                                >
                                    <input
                                        ref={coverInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleCoverUpload}
                                        className="hidden"
                                    />

                                    {uploadingCover ? (
                                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                    ) : coverUrl ? (
                                        <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center">
                                            <ImageIcon className="w-10 h-10 mx-auto text-muted-foreground" />
                                            <p className="text-xs text-muted-foreground mt-2">Click để upload</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 space-y-2">
                                    <Input
                                        value={coverUrl}
                                        onChange={(e) => setCoverUrl(e.target.value)}
                                        placeholder="https://example.com/cover.jpg"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Hoặc nhập URL ảnh bìa trực tiếp
                                    </p>
                                    {coverUrl && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setCoverUrl('')}
                                            className="text-destructive"
                                        >
                                            <Trash2 className="w-3 h-3 mr-1" />
                                            Xóa ảnh bìa
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content */}
                    <Card className="border-border/50 lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Nội dung sách</CardTitle>
                                    <CardDescription>
                                        Nhập nội dung đầy đủ của sách. Hỗ trợ markdown (# ## ### cho tiêu đề).
                                    </CardDescription>
                                </div>
                                {content && (
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-primary">
                                            {(() => {
                                                // Tính số trang preview
                                                const PAGE_BREAK_REGEX = /(?:^|\n)(?:---|<!--\s*page\s*-->)\s*(?:\n|$)/gi;
                                                const hasMarkers = PAGE_BREAK_REGEX.test(content);
                                                PAGE_BREAK_REGEX.lastIndex = 0;

                                                if (hasMarkers) {
                                                    return content.split(PAGE_BREAK_REGEX).filter(p => p.trim()).length;
                                                }
                                                return Math.ceil(content.length / 2000);
                                            })()}
                                        </div>
                                        <div className="text-xs text-muted-foreground">trang (ước tính)</div>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Pagination Guide */}
                            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                                    📖 Hướng dẫn chia trang
                                </p>
                                <div className="text-xs text-muted-foreground space-y-1">
                                    <p>• <strong>Tự động:</strong> Nếu không có markers, sách sẽ tự chia ~2000 ký tự/trang</p>
                                    <p>• <strong>Thủ công:</strong> Dùng <code className="bg-muted px-1 py-0.5 rounded">---</code> hoặc <code className="bg-muted px-1 py-0.5 rounded">&lt;!-- page --&gt;</code> để ngắt trang</p>
                                </div>
                                <div className="mt-2 p-2 bg-muted/50 rounded text-xs font-mono">
                                    <div className="text-muted-foreground"># Chương 1</div>
                                    <div className="text-muted-foreground">Nội dung trang 1...</div>
                                    <div className="text-primary font-bold">---</div>
                                    <div className="text-muted-foreground"># Chương 2</div>
                                    <div className="text-muted-foreground">Nội dung trang 2...</div>
                                </div>
                            </div>

                            <Textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="# Tên sách&#10;&#10;## Lời giới thiệu&#10;&#10;Nội dung trang 1 ở đây...&#10;&#10;---&#10;&#10;## Chương 1&#10;&#10;Nội dung trang 2..."
                                rows={15}
                                className="font-mono text-sm"
                            />
                        </CardContent>
                    </Card>

                    {/* Chapters */}
                    <Card className="border-border/50 lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Mục lục (Chapters)</CardTitle>
                                    <CardDescription>
                                        Thêm các chương để giúp người đọc điều hướng dễ dàng hơn
                                    </CardDescription>
                                </div>
                                <Button variant="outline" size="sm" onClick={addChapter} className="gap-2">
                                    <Plus className="w-4 h-4" />
                                    Thêm chương
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {chapters.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>Chưa có chương nào</p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={addChapter}
                                        className="mt-3"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Thêm chương đầu tiên
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {chapters.map((chapter, index) => (
                                        <div key={index} className="flex gap-3 p-4 bg-muted/30 rounded-lg">
                                            <div className="flex items-center">
                                                <GripVertical className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1 space-y-3">
                                                <div className="flex gap-3">
                                                    <div className="w-16">
                                                        <Label className="text-xs">Thứ tự</Label>
                                                        <Input
                                                            type="number"
                                                            value={chapter.chapter_order}
                                                            onChange={(e) => updateChapter(index, 'chapter_order', parseInt(e.target.value) || 1)}
                                                            min={1}
                                                            className="text-center"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <Label className="text-xs">Tên chương</Label>
                                                        <Input
                                                            value={chapter.title}
                                                            onChange={(e) => updateChapter(index, 'title', e.target.value)}
                                                            placeholder="Tên chương"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label className="text-xs">Nội dung chương (tùy chọn)</Label>
                                                    <Textarea
                                                        value={chapter.content}
                                                        onChange={(e) => updateChapter(index, 'content', e.target.value)}
                                                        placeholder="Nội dung chương..."
                                                        rows={3}
                                                    />
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeChapter(index)}
                                                className="text-destructive flex-shrink-0"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default BookEditor;
