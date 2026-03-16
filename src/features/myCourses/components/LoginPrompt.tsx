import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export function LoginPrompt() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Đăng nhập để xem khóa học</h1>
          <p className="text-muted-foreground mb-6">
            Bạn cần đăng nhập để xem danh sách khóa học đã đăng ký
          </p>
          <Link to="/auth">
            <Button size="lg">
              <LogIn className="w-4 h-4 mr-2" />
              Đăng nhập ngay
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
