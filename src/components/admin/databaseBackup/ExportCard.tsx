import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Download, Loader2, Package, Table2 } from 'lucide-react';
import { TABLE_GROUPS, ALL_TABLES } from './types';

interface ExportCardProps {
  selectedTables: Set<string>;
  exporting: boolean;
  toggleTable: (table: string) => void;
  toggleGroup: (tables: string[]) => void;
  selectAll: () => void;
  selectNone: () => void;
  onExport: () => void;
}

export function ExportCard({
  selectedTables,
  exporting,
  toggleTable,
  toggleGroup,
  selectAll,
  selectNone,
  onExport,
}: ExportCardProps) {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Download className="w-4 h-4" />
          Xuất dữ liệu
        </CardTitle>
        <CardDescription>Chọn các bảng bạn muốn xuất ra file SQL (INSERT ... ON CONFLICT)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={selectAll}>
            Chọn tất cả
          </Button>
          <Button variant="outline" size="sm" onClick={selectNone}>
            Bỏ chọn tất cả
          </Button>
          <Badge variant="secondary" className="ml-auto">
            {selectedTables.size}/{ALL_TABLES.length} bảng
          </Badge>
        </div>

        <Accordion type="multiple" className="w-full">
          {Object.entries(TABLE_GROUPS).map(([groupKey, group]) => {
            const groupSelected = group.tables.filter(t => selectedTables.has(t)).length;
            const allGroupSelected = groupSelected === group.tables.length;
            const someGroupSelected = groupSelected > 0 && !allGroupSelected;

            return (
              <AccordionItem key={groupKey} value={groupKey} className="border-b-0">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={allGroupSelected ? true : someGroupSelected ? 'indeterminate' : false}
                    onCheckedChange={() => toggleGroup(group.tables)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <AccordionTrigger className="flex-1 py-2 hover:no-underline">
                    <div className="flex items-center gap-2 flex-1">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{group.label}</span>
                      <Badge variant={groupSelected > 0 ? "default" : "outline"} className="ml-auto mr-2 text-xs">
                        {groupSelected}/{group.tables.length}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                </div>
                <AccordionContent>
                  <div className="ml-6 grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
                    {group.tables.map(table => (
                      <label
                        key={table}
                        className="flex items-center gap-2 cursor-pointer hover:bg-muted/30 rounded px-2 py-1 text-sm"
                      >
                        <Checkbox
                          checked={selectedTables.has(table)}
                          onCheckedChange={() => toggleTable(table)}
                        />
                        <Table2 className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{table}</span>
                      </label>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        <Button
          onClick={onExport}
          disabled={exporting || selectedTables.size === 0}
          className="w-full gap-2"
        >
          {exporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang xuất...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Xuất {selectedTables.size} bảng
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
