import { format } from "date-fns"
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

export default function StyledDatePicker({
  value,
  handleSetValue,
  leadingIcon,
  placeholder,
}: {
  value: Date | undefined
  handleSetValue: (value: Date | undefined) => void
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
          render={
            <InputGroupInput
              className="w-full min-w-0 text-left"
              id="date-required"
              value={value ? format(value, "yyyy-MM-dd") : ""}
              // TODO: placeholder isn't working, it isn't visible
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
            selected={value}
            onSelect={(date) => {
              handleSetValue(date)
              setIsOpen(false)
            }}
            defaultMonth={value ?? new Date()}
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
              handleSetValue(undefined)
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
