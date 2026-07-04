interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`bg-white/5 animate-pulse h-4 w-full ${className}`}
    />
  );
}
