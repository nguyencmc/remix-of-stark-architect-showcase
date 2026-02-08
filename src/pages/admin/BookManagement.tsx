import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissionsContext } from '@/contexts/PermissionsContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    BookOpen,
    Plus,
    Search,
    Edit,
    Trash2,
    ArrowLeft,
    Star,
    Eye
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/useToast';
import { createAuditLog } from '@/hooks/useAuditLogs';

interface Book {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    author_name: string | null;
    cover_url: string | null;
    page_count: number | null;
    rating: number | null;
    read_count: number | null;
    difficulty: string | null;
    category_id: string | null;
    created_at: string;
}

interface BookCategory {
    id: string;
    name: string;
}

const BookManagement = () => {
    const { isAdmin, hasPermission, loading: roleLoading } = usePermissionsContext();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [books, setBooks] = useState<Book[]>([]);
    const [categories, setCategories] = useState<BookCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const canView = isAdmin || hasPermission('books.view');
    const canCreate = isAdmin || hasPermission('books.create');
    const canEdit = isAdmin || hasPermission('books.edit');
    const canDelete = isAdmin || hasPermission('books.delete');

    useEffect(() => {
        if (!roleLoading && !canView) {
            navigate('/');
            toast({
                title: "Không có quyền truy cập",
                description: "Bạn không có quyền xem sách",
                variant: "destructive",
            });
        }
    }, [canView, roleLoading, navigate, toast]);

    useEffect(() => {
        if (canView && user) {
            fetchData();
        }
    }, [canView, user]);

    const fetchData = async () => {
        setLoading(true);

        const [{ data: booksData }, { data: categoriesData }] = await Promise.all([
            supabase.from('books').select('*').order('created_at', { ascending: false }),
            supabase.from('book_categories').select('id, name'),
        ]);

        setBooks(booksData || []);
        setCategories(categoriesData || []);
        setLoading(false);
    };

    const handleDelete = async (bookId: string) => {
        const bookToDelete = books.find(b => b.id === bookId);

        const { error } = await supabase
            .from('books')
            .delete()
            .eq('id', bookId);

        if (error) {
            toast({
                title: "Lỗi",
                description: "Không thể xóa sách",
                variant: "destructive",
            });
            return;
        }

        await createAuditLog(
            'delete',
            'book',
            bookId,
            { title: bookToDelete?.title, slug: bookToDelete?.slug },
            null
        );

        toast({
            title: "Thành công",
            description: "Đã xóa sách",
        });

        fetchData();
    };

    const getCategoryName = (categoryId: string | null) => {
        if (!categoryId) return 'Chưa phân loại';
        const category = categories.find(c => c.id === categoryId);
        return category?.name || 'Không xác định';
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (roleLoading) {
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

    if (!canView) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link to={isAdmin ? "/admin" : "/teacher"}>
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                                <BookOpen className="w-8 h-8 text-emerald-500" />
                                Quản lý Sách
                            </h1>
                            <p className="text-muted-foreground mt-1">{books.length} cuốn sách</p>
                        </div>
                    </div>
                    {canCreate && (
                        <Link to="/admin/books/create">
                            <Button className="gap-2">
                                <Plus className="w-4 h-4" />
                                Thêm sách mới
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm sách..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Books Table */}
                <Card className="border-border/50">
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : filteredBooks.length === 0 ? (
                            <div className="text-center py-16">
                                <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                                <p className="text-muted-foreground text-lg mb-4">
                                    {searchQuery ? 'Không tìm thấy sách nào' : 'Chưa có sách nào'}
                                </p>
                                {canCreate && (
                                    <Link to="/admin/books/create">
                                        <Button>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Thêm sách đầu tiên
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Sách</TableHead>
                                        <TableHead>Tác giả</TableHead>
                                        <TableHead>Danh mục</TableHead>
                                        <TableHead>Số trang</TableHead>
                                        <TableHead>Đánh giá</TableHead>
                                        <TableHead>Lượt đọc</TableHead>
                                        <TableHead>Ngày tạo</TableHead>
                                        <TableHead className="text-right">Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBooks.map((book) => (
                                        <TableRow key={book.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    {book.cover_url ? (
                                                        <img
                                                            src={book.cover_url}
                                                            alt={book.title}
                                                            className="w-12 h-16 object-cover rounded"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-16 bg-muted rounded flex items-center justify-center">
                                                            <BookOpen className="w-6 h-6 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium">{book.title}</p>
                                                        {book.description && (
                                                            <p className="text-sm text-muted-foreground line-clamp-1">
                                                                {book.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{book.author_name || 'Chưa có'}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{getCategoryName(book.category_id)}</Badge>
                                            </TableCell>
                                            <TableCell>{book.page_count || 0} trang</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                    {book.rating?.toFixed(1) || '0.0'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Eye className="w-4 h-4 text-muted-foreground" />
                                                    {book.read_count || 0}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(book.created_at).toLocaleDateString('vi-VN')}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {canEdit && (
                                                        <Link to={`/admin/books/${book.id}`}>
                                                            <Button variant="ghost" size="icon">
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    {canDelete && (
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="text-destructive">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Xóa sách?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Hành động này không thể hoàn tác.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDelete(book.id)}>
                                                                        Xóa
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default BookManagement;
