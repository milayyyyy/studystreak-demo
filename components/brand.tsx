import Image from "next/image";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <Image
        src="/logo.jpg"
        alt="StudyStreak"
        width={compact ? 36 : 40}
        height={compact ? 36 : 40}
        className="size-9 rounded-[0.85rem] shadow-sm ring-1 ring-[#dfeaf7] md:size-10"
        priority
      />
      <div>
        <p className="text-sm leading-none font-extrabold text-[#102D52]">
          StudyStreak
        </p>
        {!compact && (
          <p className="mt-0.5 text-[11px] font-bold text-[#6d86a8]">
            Daily reviews that stick
          </p>
        )}
      </div>
    </div>
  );
}
