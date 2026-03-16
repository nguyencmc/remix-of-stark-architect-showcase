import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

interface AuthLogoProps {
  title: string;
  subtitle: string;
}

export function AuthLogo({ title, subtitle }: AuthLogoProps) {
  return (
    <div className="text-center mb-8">
      <Link to="/" className="inline-flex items-center gap-2">
        <img src={logo} alt="AI-Exam.cloud" className="h-10 w-auto" />
        <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          AI-Exam.cloud
        </span>
      </Link>
      <h1 className="text-2xl font-bold text-foreground mt-4">{title}</h1>
      <p className="text-muted-foreground mt-2">{subtitle}</p>
    </div>
  );
}
