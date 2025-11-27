'use client'

interface CustomCheckboxProps {
  id: string
  name: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  label: string | React.ReactNode
}

export function CustomCheckbox({ id, name, checked, onChange, label }: CustomCheckboxProps) {
  return (
    <label htmlFor={id} className="flex items-start gap-4 cursor-pointer group">
      <div className="flex-shrink-0 relative mt-0.5">
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div
          className={`w-5 h-5 border-2 flex items-center justify-center transition-all duration-250 ${
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
      <span className="text-black font-sans font-medium text-base leading-tight flex-1">
        {label}
      </span>
    </label>
  )
}
