'use client'

interface ToggleSwitchProps {
  options: string[]
  selectedIndex: number
  onToggle: (index: number) => void
}

export default function ToggleSwitch({ options, selectedIndex, onToggle }: ToggleSwitchProps) {
  return (
    <div className="flex items-center flex-grow-0 flex-shrink-0 w-full gap-0.5 px-0.5 py-0.5 rounded-xl bg-white border-[1.5px] border-[#999]">
      {options.map((option, index) => (
        <div
          key={index}
          onClick={() => onToggle(index)}
          className={`flex justify-center items-center flex-grow gap-2 px-4 py-2 rounded-sm cursor-pointer ${
            selectedIndex === index ? 'bg-[#35f]' : 'bg-white'
          }`}
        >
          <div className="flex items-center flex-grow-0 flex-shrink-0 relative gap-2">
            <p
              className={`flex-grow-0 flex-shrink-0 text-xs font-medium text-left ${
                selectedIndex === index ? 'text-white' : 'text-neutral-800'
              }`}
            >
              {option}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
