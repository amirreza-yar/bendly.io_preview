export default function ProjectDetailsPageLoading() {
  return (
    <div className="space-y-4 px-4 animate-pulse overflow-hidden">
      <div className="flex gap-1 p-3 h-15 justify-between items-center border rounded-md">
        <div className="space-y-2">
          <div className="bg-gray-300 h-5 w-20 rounded rounded-md" />
          <div className="bg-gray-300 h-4 w-45 rounded rounded-md" />
        </div>
        <div className="bg-gray-300 h-10 w-10 rounded rounded-md" />
      </div>
      <div className="flex items-center justify-between pt-1">
        <div className="bg-gray-300 rounded rounded-md w-30 h-6" />
        <div className="bg-gray-300 rounded rounded-md w-40 h-6" />
      </div>

      <div className="grid md:grid-cols-2 gap-2">
        {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 justify-center rounded-md p-2 border"
          >
            <div className="flex items-center gap-1">
              <div className="h-5 w-5 rounded-md bg-gray-300" />
              <div className="h-5 w-26 rounded-md bg-gray-300" />
            </div>
            <div className="ml-7 h-4 w-80 rounded-md bg-gray-300" />
            <div className="flex items-center gap-1">
              <div className="h-4 w-4 rounded-md bg-gray-300" />
              <div className="h-3 w-35 rounded-md bg-gray-300" />
            </div>
            <div className="flex items-center justify-end gap-1">
              <div className="h-8 w-8 rounded-md bg-gray-300" />
              <div className="h-8 w-8 rounded-md bg-gray-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
