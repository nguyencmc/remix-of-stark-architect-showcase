import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MiniRichTextEditor } from './MiniRichTextEditor';
import { RichTextEditor } from './RichTextEditor';

interface SmartEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  miniMinHeight?: string;
  fullMinHeight?: string;
  onImageUpload?: (file: File) => Promise<string>;
  showImageUpload?: boolean;
  /** Start in advanced mode */
  defaultAdvanced?: boolean;
  /** Hide the toggle button */
  hideToggle?: boolean;
}

export const SmartEditor = ({
  content,
  onChange,
  placeholder = 'Nhập nội dung...',
  className,
  miniMinHeight = '80px',
  fullMinHeight = '200px',
  onImageUpload,
  showImageUpload = false,
  defaultAdvanced = false,
  hideToggle = false,
}: SmartEditorProps) => {
  const [isAdvanced, setIsAdvanced] = useState(defaultAdvanced);

  return (
    <div className={cn('relative', className)}>
      {isAdvanced ? (
        <RichTextEditor
          content={content}
          onChange={onChange}
          placeholder={placeholder}
          minHeight={fullMinHeight}
          onImageUpload={onImageUpload}
        />
      ) : (
        <MiniRichTextEditor
          content={content}
          onChange={onChange}
          placeholder={placeholder}
          minHeight={miniMinHeight}
          onImageUpload={onImageUpload}
          showImageUpload={showImageUpload}
        />
      )}

      {!hideToggle && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsAdvanced(!isAdvanced)}
          className="absolute top-1 right-1 h-7 gap-1 text-xs text-muted-foreground hover:text-foreground z-10"
          title={isAdvanced ? 'Thu gọn' : 'Nâng cao'}
        >
          {isAdvanced ? (
            <>
              <Minimize2 className="h-3 w-3" />
              Thu gọn
            </>
          ) : (
            <>
              <Maximize2 className="h-3 w-3" />
              Nâng cao
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default SmartEditor;
