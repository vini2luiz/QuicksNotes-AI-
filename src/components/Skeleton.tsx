export function NoteSkeleton() {
  return (
    <div className="bg-steel-900/60 border border-steel-800 rounded-2xl p-5 shadow-sm space-y-4 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="h-6 bg-steel-800 rounded-lg w-3/4"></div>
        <div className="h-4 bg-steel-800/80 rounded w-16"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-steel-800/60 rounded w-full"></div>
        <div className="h-4 bg-steel-800/60 rounded w-5/6"></div>
        <div className="h-4 bg-steel-800/60 rounded w-2/3"></div>
      </div>
      <div className="pt-3 flex justify-between items-center border-t border-steel-800/60">
        <div className="h-8 bg-steel-800 rounded-xl w-32"></div>
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-steel-800 rounded-lg"></div>
          <div className="h-8 w-8 bg-steel-800 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

export function NoteSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NoteSkeleton />
      <NoteSkeleton />
      <NoteSkeleton />
    </div>
  );
}
