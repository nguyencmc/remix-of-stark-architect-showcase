export function AuthDivider() {
  return (
    <div className="relative mb-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-card px-2 text-muted-foreground">hoặc</span>
      </div>
    </div>
  );
}
