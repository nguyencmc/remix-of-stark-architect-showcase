import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, ChevronRight } from "lucide-react";

export function EmptyWishlistState() {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
        <Heart className="w-10 h-10 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold mb-2">
        Chưa có khóa học yêu thích
      </h2>
      <p className="text-muted-foreground mb-6">
        Lưu các khóa học bạn quan tâm để xem sau
      </p>
      <Link to="/courses">
        <Button>
          Khám phá khóa học
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </Link>
    </div>
  );
}
