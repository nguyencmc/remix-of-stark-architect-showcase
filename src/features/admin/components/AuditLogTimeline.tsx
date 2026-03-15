import { Calendar } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TimelineLogItem } from '@/features/admin/components/TimelineLogItem';
import type { GroupedLogEntry } from '@/features/admin/types';

interface AuditLogTimelineProps {
  groupedLogs: GroupedLogEntry[];
}

export const AuditLogTimeline = ({ groupedLogs }: AuditLogTimelineProps) => {
  return (
    <ScrollArea className="h-[calc(100vh-420px)] min-h-[400px]">
      <div className="space-y-8 pr-4">
        {groupedLogs.map(({ date, label, logs: dayLogs }) => (
          <div key={date}>
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur py-2 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold capitalize">{label}</h3>
                  <p className="text-xs text-muted-foreground">{dayLogs.length} hoạt động</p>
                </div>
              </div>
            </div>
            <div className="space-y-0">
              {dayLogs.map((log) => (
                <TimelineLogItem key={log.id} log={log} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
