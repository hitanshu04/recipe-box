export default function RecipeCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse">
      {/* Image skeleton */}
      <div className="h-48 bg-gray-200 dark:bg-gray-700 skeleton"></div>

      {/* Header skeleton */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {/* Title skeleton */}
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 skeleton"></div>
            {/* Cuisine badge skeleton */}
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-20 skeleton"></div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="p-4 space-y-4">
        {/* Cooking time skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded skeleton"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 skeleton"></div>
        </div>

        {/* Ingredients skeleton */}
        <div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2 skeleton"></div>
          <div className="space-y-1">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full skeleton"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6 skeleton"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6 skeleton"></div>
          </div>
        </div>

        {/* Steps skeleton */}
        <div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2 skeleton"></div>
          <div className="space-y-1">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full skeleton"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full skeleton"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 skeleton"></div>
          </div>
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 skeleton"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32 skeleton"></div>
        </div>
      </div>
    </div>
  );
}

export function RecipeGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <RecipeCardSkeleton key={index} />
      ))}
    </div>
  );
}
