import Skeleton from "./Skeleton";

const CourseCardSkeleton = () => (
  <div className="border border-border rounded-xl overflow-hidden">
    <Skeleton className="h-1.5 w-full rounded-none" />
    <div className="p-5">
      <Skeleton className="w-9 h-9 rounded-lg mb-3" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-2/3 mb-4" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  </div>
);

export default CourseCardSkeleton;
