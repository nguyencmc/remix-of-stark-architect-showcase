import { Link, useSearchParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface PopularTag {
    name: string;
    slug: string;
    count?: number;
}

interface PopularTagsBarProps {
    tags?: PopularTag[];
    className?: string;
}

// Default popular tags for tech/devops articles
const defaultTags: PopularTag[] = [
    { name: 'Linux', slug: 'linux' },
    { name: 'Docker', slug: 'docker' },
    { name: 'Kubernetes', slug: 'kubernetes' },
    { name: 'DevOps', slug: 'devops' },
    { name: 'Cloud', slug: 'cloud' },
    { name: 'AWS', slug: 'aws' },
    { name: 'CI/CD', slug: 'cicd' },
    { name: 'Security', slug: 'security' },
    { name: 'Python', slug: 'python' },
    { name: 'JavaScript', slug: 'javascript' },
    { name: 'AI/ML', slug: 'ai-ml' },
    { name: 'Database', slug: 'database' },
];

export const PopularTagsBar = ({ tags = defaultTags, className }: PopularTagsBarProps) => {
    const [searchParams] = useSearchParams();
    const activeTag = searchParams.get('tag');

    return (
        <div className={cn("border-b bg-muted/30", className)}>
            <div className="container mx-auto px-4">
                <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex items-center gap-2 py-3">
                        <span className="text-sm font-medium text-muted-foreground shrink-0 mr-2">
                            Chủ đề:
                        </span>
                        {tags.map((tag) => {
                            const isActive = activeTag === tag.slug;
                            return (
                                <Link
                                    key={tag.slug}
                                    to={isActive ? '/articles' : `/articles?tag=${tag.slug}`}
                                >
                                    <Badge
                                        variant={isActive ? "default" : "secondary"}
                                        className={cn(
                                            "cursor-pointer transition-all duration-200 hover:scale-105",
                                            isActive
                                                ? "bg-primary text-primary-foreground shadow-md"
                                                : "hover:bg-primary/20 hover:text-primary"
                                        )}
                                    >
                                        {tag.name}
                                        {tag.count !== undefined && (
                                            <span className="ml-1 opacity-70">({tag.count})</span>
                                        )}
                                    </Badge>
                                </Link>
                            );
                        })}
                    </div>
                    <ScrollBar orientation="horizontal" className="invisible" />
                </ScrollArea>
            </div>
        </div>
    );
};

export default PopularTagsBar;
