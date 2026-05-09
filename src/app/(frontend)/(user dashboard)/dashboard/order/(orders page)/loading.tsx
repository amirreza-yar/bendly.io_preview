export default function OrdersPageLoading() {
  return (
    <div className="space-y-2 px-4 sm:space-y-2 sm:px-4 animate-pulse  overflow-hidden h-full">
      <div className="grid md:grid-cols-2 gap-2">
        {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((_, i) => (
          <div key={i} className="space-y-6 rounded-md p-4 border">
            <div className="flex justify-between">
              <p className="bg-gray-300 h-4 w-30 rounded-md" />
              <p className="bg-gray-300 h-4 w-12 rounded-md" />
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <p className="bg-gray-300 h-4 w-4 rounded-md" />
                <p className="bg-gray-300 h-4 w-25 rounded-md" />
              </div>
              <div className="flex gap-2">
                <p className="bg-gray-300 h-4 w-4 rounded-md" />
                <p className="bg-gray-300 h-4 w-18 rounded-md" />
                <p className="bg-gray-300 h-4 w-30 rounded-md" />
              </div>
              <div className="flex gap-2">
                <p className="bg-gray-300 h-4 w-4 rounded-md" />
                <p className="bg-gray-300 h-4 w-45 rounded-md" />
              </div>
            </div>
            <div className="flex gap-2">
              <p className="bg-gray-300 h-4 w-4 rounded-md" />
              <p className="bg-gray-300 h-8 w-30 rounded-md" />
              <p className="bg-gray-300 h-8 w-12 rounded-md" />
            </div>
            <div className="flex justify-between">
              <p className="bg-gray-300 h-6 w-20 rounded-md" />
              <p className="bg-gray-300 h-6 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
