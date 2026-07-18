import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import { Input } from "../ui/input"

export default function InlineEditableInput({
  value,
  onChange,
  placeholder,
  onBlur,
  className,
}: {
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  className?: string
  placeholder?: string
}) {
  const [isEditing, setIsEditing] = useState(false)
  const textareaRef = useRef<HTMLInputElement | null>(null)
  useEffect(() => {
    if (isEditing) {
      if (textareaRef.current) {
        // set cursor at the end of existing text
        textareaRef.current.focus()
        textareaRef.current.setSelectionRange(
          textareaRef.current.value.length,
          textareaRef.current.value.length
        )
      }
    }
  }, [isEditing])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation()
    if (e.key === "Enter") {
      setIsEditing(false)
      onBlur()
    } else if (e.key === "Escape") {
      setIsEditing(false)
    }
  }

  return (
    <>
      {isEditing ? (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Enter a value"}
          onBlur={() => {
            setIsEditing(false)
            onBlur()
          }}
          onKeyDown={handleKeyDown}
          ref={textareaRef}
        />
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className={cn(
            "w-full cursor-pointer resize-none select-none",
            className
          )}
        >
          {value.trim().length > 0 ? value : placeholder || "Enter a value"}
        </div>
      )}
    </>
  )
}
