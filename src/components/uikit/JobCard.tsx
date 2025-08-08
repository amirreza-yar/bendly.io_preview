type JobCardProps = {
  jr: string
  label: string
  address: string
}

export default function JobCard({ jr, label, address }: JobCardProps) {
  return (
    <div className="border border-gray-300 rounded-xl p-4 flex-shrink-0">
      <div className="border text-xs font-semibold px-2 py-1 rounded-lg w-fit mb-2">{jr}</div>
      <div className="text-sm font-medium mb-1">{label}</div>
      <div className="text-xs text-gray-500 flex items-start gap-1">
        📍<span>{address}</span>
      </div>
    </div>
  )
}
