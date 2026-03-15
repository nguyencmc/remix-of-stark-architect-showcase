import { Search, Calendar, LayoutList, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ACTION_CONFIG,
  ENTITY_LABELS,
  TIME_FILTERS,
} from '@/features/admin/constants/auditLogConfig';
import type { ViewMode } from '@/features/admin/types';

interface AuditLogFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  timeFilter: string;
  onTimeFilterChange: (value: string) => void;
  entityTypeFilter: string;
  onEntityTypeFilterChange: (value: string) => void;
  actionFilter: string;
  onActionFilterChange: (value: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (value: ViewMode) => void;
  uniqueEntityTypes: string[];
  uniqueActions: string[];
  filteredCount: number;
  totalCount: number;
}

export const AuditLogFilters = ({
  searchQuery,
  onSearchChange,
  timeFilter,
  onTimeFilterChange,
  entityTypeFilter,
  onEntityTypeFilterChange,
  actionFilter,
  onActionFilterChange,
  viewMode,
  onViewModeChange,
  uniqueEntityTypes,
  uniqueActions,
  filteredCount,
  totalCount,
}: AuditLogFiltersProps) => {
  const hasActiveFilters = entityTypeFilter !== 'all' || actionFilter !== 'all' || timeFilter !== 'all' || searchQuery;

  const handleClearFilters = () => {
    onEntityTypeFilterChange('all');
    onActionFilterChange('all');
    onTimeFilterChange('all');
    onSearchChange('');
  };

  return (
    <Card className="mb-6 border-none shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm logs..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Time Filter */}
            <Select value={timeFilter} onValueChange={onTimeFilterChange}>
              <SelectTrigger className="w-[140px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_FILTERS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Entity Type Filter */}
            <Select value={entityTypeFilter} onValueChange={onEntityTypeFilterChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Đối tượng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả đối tượng</SelectItem>
                {uniqueEntityTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {ENTITY_LABELS[type]?.label || type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Action Filter */}
            <Select value={actionFilter} onValueChange={onActionFilterChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Hành động" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả hành động</SelectItem>
                {uniqueActions.map((action) => (
                  <SelectItem key={action} value={action}>
                    {ACTION_CONFIG[action]?.label || action}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <Tabs value={viewMode} onValueChange={(v) => onViewModeChange(v as ViewMode)} className="ml-auto">
              <TabsList className="h-9">
                <TabsTrigger value="timeline" className="gap-1.5 px-3">
                  <LayoutList className="w-4 h-4" />
                  <span className="hidden sm:inline">Timeline</span>
                </TabsTrigger>
                <TabsTrigger value="table" className="gap-1.5 px-3">
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">Bảng</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Active filters count */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t">
            <span className="text-sm text-muted-foreground">
              Đang hiển thị {filteredCount} / {totalCount} logs
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
            >
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
