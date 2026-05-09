export default function ProjectsPageLoading() {
  return (
    <div className="space-y-2 px-4 animate-pulse overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="bg-gray-300 rounded rounded-md w-30 h-5" />
        <div className="bg-gray-300 rounded rounded-md w-40 h-5" />
      </div>
      <div className="grid md:grid-cols-2 gap-2">
        {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 justify-center rounded-md p-2 border"
          >
            <div className="h-3 w-30 rounded-md bg-gray-300" />
            <div className="h-3 w-45 rounded-md bg-gray-300" />
            <div className="flex items-center gap-1">
              <div className="h-4 w-4 rounded-md bg-gray-300" />
              <div className="h-3 w-20 rounded-md bg-gray-300" />
              <div className="h-3 w-15 rounded-md bg-gray-300" />
              <div className="h-3 w-26 rounded-md bg-gray-300" />
              <div className="h-3 w-18 rounded-md bg-gray-300" />
              <div className="h-3 w-12 rounded-md bg-gray-300" />
            </div>
            <div className="flex items-center gap-1">
              <div className="h-4 w-4 rounded-md bg-gray-300" />
              <div className="h-4 w-26 rounded-md bg-gray-300" />
            </div>
            <div className="ml-7 h-3 w-80 rounded-md bg-gray-300" />
            <div className="flex items-center gap-1">
              <div className="h-3 w-25 rounded-md bg-gray-300" />
              <div className="h-3 w-30 rounded-md bg-gray-300" />
              <div className="h-3 w-8 rounded-md bg-gray-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
