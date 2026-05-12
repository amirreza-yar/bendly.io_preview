export default function TemplatesPageLoading() {
  return (
    <div className="space-y-2 px-4 sm:space-y-2 sm:px-4 animate-pulse  overflow-hidden h-full">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-1.5 justify-center rounded-md p-2 border"
          >
            <div className="h-28 rounded-md bg-gray-300" />
            <p className="bg-gray-300 h-5 rounded-md"></p>
          </div>
        ))}
      </div>
    </div>
  );
}
