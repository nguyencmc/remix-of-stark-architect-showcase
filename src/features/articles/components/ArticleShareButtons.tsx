import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Facebook, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';

interface ArticleShareButtonsProps {
  title: string;
}

export function ArticleShareButtons({ title }: ArticleShareButtonsProps) {
  const handleShare = (platform?: string) => {
    const url = window.location.href;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank');
        break;
      default:
        navigator.clipboard.writeText(url);
    }
  };

  return (
    <Card className="mb-8">
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Chia sẻ bài viết:</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="hover:bg-blue-600 hover:text-white hover:border-blue-600"
              onClick={() => handleShare('facebook')}
            >
              <Facebook className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hover:bg-sky-500 hover:text-white hover:border-sky-500"
              onClick={() => handleShare('twitter')}
            >
              <Twitter className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hover:bg-blue-700 hover:text-white hover:border-blue-700"
              onClick={() => handleShare('linkedin')}
            >
              <Linkedin className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleShare()}
            >
              <LinkIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
