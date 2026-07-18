import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import { Textarea } from "../ui/textarea"

export default function InlineEditableTextarea({
  value,
  onChange,
  placeholder,
  onBlur,
  className,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onBlur: () => void
  className?: string
}) {
  const [isEditing, setIsEditing] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
        <Textarea
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
          <span className="text-muted-foreground">
            {value.trim().length > 0 ? value : placeholder || "Enter a value"}
          </span>
        </div>
      )}
    </>
  )
}
