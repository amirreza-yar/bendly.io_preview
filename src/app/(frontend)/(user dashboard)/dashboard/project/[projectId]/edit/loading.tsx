export default function EditProjectInfoLoading() {
  return (
    <div className="flex flex-col px-4 animate-pulse relative h-full pb-4">
      <div className="space-y-2 py-2">
        <div className="bg-gray-300 h-5 w-20 rounded rounded-md" />
        <div className="bg-gray-300 h-13 w-full rounded rounded-md" />
        <div className="bg-gray-300 h-3 w-40 rounded rounded-md" />
      </div>
      <div className="space-y-2 py-2 pt-6 grow">
        <div className="bg-gray-300 h-5 w-35 rounded rounded-md" />
        <div className="bg-gray-300 h-13 w-full rounded rounded-md" />
        <div className="bg-gray-300 h-3 w-50 rounded rounded-md" />
      </div>
      <div className="bg-gray-300 h-12 w-full rounded rounded-md" />
    </div>
  );
}
