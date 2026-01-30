import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Layers, 
  Plus,
  BookOpen,
  Clock,
  TrendingUp,
  Star
} from 'lucide-react';
import { useDecks } from '@/features/flashcards/hooks/useDecks';
import { useDueCards } from '@/features/flashcards/hooks/useDueCards';

export function FlashcardsSection() {
  const [activeTab, setActiveTab] = useState('my-decks');
  const { decks, isLoading: loading } = useDecks();
  const { dueCount, cardsByDeck } = useDueCards();

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalCards = decks.reduce((acc, deck) => acc + (deck.card_count || 0), 0);
  const masteredDecks = decks.filter(d => d.card_count && d.card_count > 0).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Layers className="w-6 h-6 text-cyan-500" />
          Flashcards của tôi
        </h2>
        <Link to="/flashcards">
          <Button size="sm" variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Tạo bộ thẻ
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-border/50">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-primary">{decks.length}</p>
            <p className="text-xs text-muted-foreground">Bộ thẻ</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{totalCards}</p>
            <p className="text-xs text-muted-foreground">Tổng thẻ</p>
          </CardContent>
        </Card>
        <Card className={`border-border/50 ${dueCount > 0 ? 'bg-orange-500/5 border-orange-500/30' : ''}`}>
          <CardContent className="p-3 text-center">
            <p className={`text-2xl font-bold ${dueCount > 0 ? 'text-orange-500' : 'text-green-500'}`}>
              {dueCount}
            </p>
            <p className="text-xs text-muted-foreground">Cần ôn</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="my-decks" className="text-xs sm:text-sm">
            Bộ thẻ ({decks.length})
          </TabsTrigger>
          <TabsTrigger value="due-today" className="text-xs sm:text-sm">
            Hôm nay
            {dueCount > 0 && <Badge className="ml-1 bg-orange-500">{dueCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="public" className="text-xs sm:text-sm">
            Công khai
          </TabsTrigger>
          <TabsTrigger value="stats" className="text-xs sm:text-sm">
            Thống kê
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-decks" className="mt-4">
          {decks.length === 0 ? (
            <EmptyState 
              icon={Layers}
              title="Chưa có bộ thẻ nào"
              description="Tạo bộ thẻ flashcard đầu tiên để bắt đầu học"
              actionLabel="Tạo bộ thẻ"
              actionHref="/flashcards"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {decks.slice(0, 6).map((deck) => (
                <DeckCard key={deck.id} deck={deck} />
              ))}
            </div>
          )}
          {decks.length > 6 && (
            <div className="mt-4 text-center">
              <Link to="/flashcards">
                <Button variant="outline">Xem tất cả {decks.length} bộ thẻ</Button>
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="due-today" className="mt-4">
          {dueCount === 0 ? (
            <div className="text-center py-12">
              <Star className="w-12 h-12 mx-auto text-green-500 mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Tuyệt vời!</h3>
              <p className="text-sm text-muted-foreground">Không có thẻ nào cần ôn hôm nay</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center py-6 px-4 bg-orange-500/5 rounded-lg border border-orange-500/20">
                <Clock className="w-10 h-10 mx-auto text-orange-500 mb-3" />
                <p className="font-semibold text-lg mb-1">{dueCount} thẻ cần ôn</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Ôn tập mỗi ngày để duy trì kiến thức
                </p>
                <Link to="/flashcards/today">
                  <Button className="gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Bắt đầu ôn tập
                  </Button>
                </Link>
              </div>
              
              {cardsByDeck && cardsByDeck.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {cardsByDeck.slice(0, 4).map((item) => (
                    <DeckCard 
                      key={item.deckId} 
                      deck={{ id: item.deckId, title: item.deckTitle, card_count: item.cards.length }} 
                      showDueBadge 
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="public" className="mt-4">
          <EmptyState 
            icon={BookOpen}
            title="Khám phá bộ thẻ công khai"
            description="Tìm và học từ các bộ thẻ được chia sẻ bởi cộng đồng"
            actionLabel="Khám phá"
            actionHref="/flashcards"
          />
        </TabsContent>

        <TabsContent value="stats" className="mt-4">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{decks.length}</p>
                  <p className="text-sm text-muted-foreground">Tổng bộ thẻ</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground">{totalCards}</p>
                  <p className="text-sm text-muted-foreground">Tổng flashcard</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-500">{masteredDecks}</p>
                  <p className="text-sm text-muted-foreground">Bộ thẻ đã học</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-500">{dueCount}</p>
                  <p className="text-sm text-muted-foreground">Thẻ cần ôn</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface DeckCardProps {
  deck: {
    id: string;
    title: string;
    description?: string | null;
    card_count?: number | null;
    tags?: string[] | null;
  };
  showDueBadge?: boolean;
}

function DeckCard({ deck, showDueBadge }: DeckCardProps) {
  return (
    <Link to={`/flashcards/decks/${deck.id}`}>
      <Card className="border-border/50 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer h-full group">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
              <Layers className="w-5 h-5 text-cyan-500" />
            </div>
            {showDueBadge && (
              <Badge className="bg-orange-500">Cần ôn</Badge>
            )}
          </div>
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
            {deck.title}
          </h3>
          {deck.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {deck.description}
            </p>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {deck.card_count || 0} thẻ
            </Badge>
            {deck.tags?.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4">
      <Icon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      {actionLabel && actionHref && (
        <Link to={actionHref}>
          <Button size="sm">{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}
