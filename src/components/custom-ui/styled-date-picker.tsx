import { format, parse } from "date-fns"
import { CalendarIcon, ChevronDownIcon, XIcon } from "lucide-react"
import { useState } from "react"
import { Calendar } from "../ui/calendar"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

/**
 * Shadcn UI DatePicker but with a clear button is all this accomplishes. Much like the combobox with clear option seen here: https://ui.shadcn.com/docs/components/base/combobox#clear-button
 */
export default function StyledDatePicker({
  value,
  handleOnChange,
  leadingIcon,
  placeholder,
}: {
  value: string
  handleOnChange: (value: string) => void
  leadingIcon?: React.ReactNode
  placeholder?: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <InputGroup>
      <InputGroupAddon>
        {leadingIcon ? leadingIcon : <CalendarIcon />}
      </InputGroupAddon>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger
          nativeButton={false}
          render={
            <InputGroupInput
              className="w-full min-w-0 text-left"
              id="date-required"
              value={value}
              // onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || "Select date"}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault()
                  setIsOpen(true)
                }
              }}
            />
          }
        />
        <PopoverContent className="w-auto overflow-hidden p-0" align="center">
          <Calendar
            mode="single"
            selected={
              value !== "" ? parse(value, "yyyy-MM-dd", new Date()) : undefined
            }
            onSelect={(date) => {
              console.log({ d: date ? format(date, "yyyy-MM-dd") : "" })
              handleOnChange(date ? format(date, "yyyy-MM-dd") : "")
              setIsOpen(false)
            }}
            defaultMonth={
              value !== "" ? parse(value, "yyyy-MM-dd", new Date()) : undefined
            }
          />
        </PopoverContent>
      </Popover>
      <InputGroupAddon align="inline-end">
        {value ? (
          <InputGroupButton
            aria-label="Select due date"
            variant="ghost"
            size={"icon-xs"}
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              handleOnChange("")
            }}
            className="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent"
          >
            <XIcon
              data-testid="date-clear-icon"
              className="pointer-events-none size-4 text-muted-foreground"
            />
          </InputGroupButton>
        ) : (
          <InputGroupButton
            aria-label="Select due date"
            variant="ghost"
            size={"icon-xs"}
            onClick={() => {
              setIsOpen((prev) => !prev)
            }}
            className="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent"
          >
            <ChevronDownIcon
              data-testid="date-select-icon"
              className="pointer-events-none size-4 text-muted-foreground"
            />
          </InputGroupButton>
        )}
      </InputGroupAddon>
    </InputGroup>
  )
}
