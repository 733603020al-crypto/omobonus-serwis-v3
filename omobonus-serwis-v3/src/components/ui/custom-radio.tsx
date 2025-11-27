'use client'

interface CustomRadioProps {
  id: string
  name: string
  value: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  label: string
}

export function CustomRadio({ id, name, value, checked, onChange, label }: CustomRadioProps) {
  return (
    <label htmlFor={id} className="flex items-center gap-3 cursor-pointer group">
      <div className="flex-shrink-0 relative">
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-250 ${
            checked
              ? 'border-black bg-transparent'
              : 'border-black/60 bg-transparent group-hover:border-black/80 group-hover:bg-[rgba(0,0,0,0.05)] group-hover:shadow-[0_0_4px_rgba(0,0,0,0.3)]'
          }`}
        >
          {checked && (
            <svg
              className="w-3 h-3 text-black"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      <span className="text-black font-sans font-medium text-base leading-tight">
        {label}
      </span>
    </label>
  )
}
