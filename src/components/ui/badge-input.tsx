import React, { useState, KeyboardEvent } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

export interface BadgeInputProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
}

export function BadgeInput({ value, onChange, placeholder, className }: BadgeInputProps) {
  const [inputValue, setInputValue] = useState("")

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      const newTag = inputValue.trim()
      if (newTag && !value.includes(newTag)) {
        onChange([...value, newTag])
      }
      setInputValue("")
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div
      className={`min-h-[40px] flex-wrap flex items-center gap-1.5 p-1.5 rounded-md border border-input bg-transparent text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${className || ""}`}
    >
      {value.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="rounded-sm px-1.5 font-normal h-6 flex items-center gap-1"
        >
          {tag}
          <button
            type="button"
            className="rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onClick={() => removeTag(tag)}
          >
            <X className="h-3 w-3 text-muted-foreground hover:text-foreground transition-colors" />
            <span className="sr-only">Remove {tag} tag</span>
          </button>
        </Badge>
      ))}
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[120px] h-6 border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
      />
    </div>
  )
}
