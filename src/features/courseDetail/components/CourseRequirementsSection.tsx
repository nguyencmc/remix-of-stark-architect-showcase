interface CourseRequirementsSectionProps {
  requirements: string[];
  description: string | null;
}

export function CourseRequirementsSection({
  requirements,
  description,
}: CourseRequirementsSectionProps) {
  return (
    <>
      {/* Requirements */}
      <div>
        <h2 className="text-xl font-bold mb-4">Yêu cầu</h2>
        <ul className="space-y-2">
          {requirements.map((req, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0" />
              {req}
            </li>
          ))}
        </ul>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-xl font-bold mb-4">Mô tả</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground">
          {description ? (
            <p>{description}</p>
          ) : (
            <p>
              Chào mừng bạn đến với khóa học toàn diện này! Đây là khóa học được thiết kế đặc biệt
              để giúp bạn nắm vững kiến thức từ cơ bản đến nâng cao một cách có hệ thống.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
