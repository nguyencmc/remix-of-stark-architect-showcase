import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title?: string;
  breadcrumbs: BreadcrumbItem[];
  backHref?: string;
  showBack?: boolean;
  className?: string;
}

export const PageHeader = ({
  title,
  breadcrumbs,
  backHref,
  showBack = true,
  className = "",
}: PageHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backHref) {
      navigate(backHref);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={className}>
      {/* Back Button */}
      {showBack && (
        <Button
          variant="ghost"
          className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      )}

      {/* Breadcrumb */}
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
          {breadcrumbs.map((item, index) => (
            <span key={index} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />}
              {item.href ? (
                <Link
                  to={item.href}
                  className="hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium truncate max-w-[200px]">
                  {item.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      )}

      {/* Optional Title */}
      {title && (
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mt-4">
          {title}
        </h1>
      )}
    </div>
  );
};

export default PageHeader;
