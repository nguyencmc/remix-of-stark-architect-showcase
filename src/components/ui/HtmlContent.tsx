import { cn } from "@/lib/utils";

interface HtmlContentProps {
  html: string | null | undefined;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Renders HTML content safely with proper image and prose styling.
 * Use this wherever question_text, option text, or explanation is displayed.
 */
export const HtmlContent = ({ html, className, as: Tag = "div" }: HtmlContentProps) => {
  if (!html) return null;

  return (
    <Tag
      className={cn(
        "prose prose-sm max-w-none dark:prose-invert",
        "[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-md [&_img]:my-2",
        "[&_a]:text-primary [&_a]:underline",
        "[&_p]:my-0 [&_ul]:my-1 [&_ol]:my-1",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default HtmlContent;
