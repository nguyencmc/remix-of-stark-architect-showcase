import { useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  User,
  ChevronRight,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { AuditLog } from '@/hooks/useAuditLogs';
import {
  getActionBadge,
  getRelativeTime,
  getDefaultActionConfig,
  getDefaultEntityConfig,
} from '@/features/admin/constants/auditLogConfig';

export const TimelineLogItem = ({ log }: { log: AuditLog }) => {
  const [isOpen, setIsOpen] = useState(false);
  const actionConfig = getDefaultActionConfig(log.action);
  const entityConfig = getDefaultEntityConfig(log.entity_type);

  const getChangePreview = () => {
    if (log.new_value && typeof log.new_value === 'object' && !Array.isArray(log.new_value)) {
      const val = log.new_value as Record<string, unknown>;
      if (val.permission) return `Quyền: ${val.permission}`;
      if (val.role) return `Vai trò: ${val.role}`;
    }
    if (log.old_value && typeof log.old_value === 'object' && !Array.isArray(log.old_value)) {
      const val = log.old_value as Record<string, unknown>;
      if (val.permission) return `Quyền: ${val.permission}`;
      if (val.role) return `Vai trò: ${val.role}`;
    }
    return null;
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="group relative pl-8 pb-6 last:pb-0">
        {/* Timeline line */}
        <div className="absolute left-[11px] top-8 bottom-0 w-px bg-border group-last:hidden" />
        
        {/* Timeline dot */}
        <div className={`absolute left-0 top-1 w-6 h-6 rounded-full ${actionConfig.bgColor} ${actionConfig.textColor} flex items-center justify-center ring-4 ring-background`}>
          {actionConfig.icon}
        </div>

        <CollapsibleTrigger className="w-full text-left">
          <div className="bg-card hover:bg-muted/50 border rounded-xl p-4 transition-all hover:shadow-md cursor-pointer">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  {getActionBadge(log.action)}
                  <Badge variant="secondary" className="gap-1 text-xs font-normal">
                    {entityConfig.icon}
                    {entityConfig.label}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-3 h-3 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">
                      {log.user_name || log.user_email || 'Hệ thống'}
                    </span>
                  </div>
                </div>

                {getChangePreview() && (
                  <p className="text-sm text-muted-foreground mt-2 truncate">
                    {getChangePreview()}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="text-xs text-muted-foreground">
                        {getRelativeTime(log.created_at)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {format(new Date(log.created_at), 'HH:mm:ss - dd/MM/yyyy', { locale: vi })}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-90' : ''}`} />
              </div>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="mt-2 ml-4 p-4 bg-muted/30 rounded-lg border space-y-4">
            {/* Change details */}
            <div className="grid gap-4 sm:grid-cols-2">
              {log.old_value && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-rose-600 dark:text-rose-400">
                    <XCircle className="w-4 h-4" />
                    Giá trị cũ
                  </div>
                  <pre className="text-xs bg-rose-500/5 border border-rose-500/20 p-3 rounded-lg overflow-auto max-h-40">
                    {JSON.stringify(log.old_value, null, 2)}
                  </pre>
                </div>
              )}
              {log.new_value && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Giá trị mới
                  </div>
                  <pre className="text-xs bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-lg overflow-auto max-h-40">
                    {JSON.stringify(log.new_value, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Metadata */}
            {log.metadata && Object.keys(log.metadata as Record<string, unknown>).length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  Metadata
                </div>
                <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto max-h-32">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              </div>
            )}

            {/* Footer info */}
            <div className="flex flex-wrap gap-4 pt-2 border-t text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <span className="opacity-60">ID:</span>
                <code className="bg-muted px-1.5 py-0.5 rounded">{log.id.slice(0, 8)}...</code>
              </div>
              {log.entity_id && (
                <div className="flex items-center gap-1">
                  <span className="opacity-60">Entity:</span>
                  <code className="bg-muted px-1.5 py-0.5 rounded">{log.entity_id.slice(0, 8)}...</code>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {format(new Date(log.created_at), 'HH:mm:ss - dd/MM/yyyy', { locale: vi })}
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
