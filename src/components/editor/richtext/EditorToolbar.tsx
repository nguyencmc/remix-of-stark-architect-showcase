import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Unlink,
  Code,
  Quote,
  Undo,
  Redo,
  RemoveFormatting,
  Subscript,
  Superscript,
  Highlighter,
  Palette,
} from "lucide-react";
import { ToolbarButton } from "./ToolbarButton";
import { LinkPopover } from "./LinkPopover";
import { ImagePopover } from "./ImagePopover";
import {
  FONT_SIZES,
  HEADING_OPTIONS,
  COLORS,
  HIGHLIGHT_COLORS,
} from "./types";
import type { EditorToolbarProps } from "./types";

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  execCommand,
  formatBlock,
  link,
  image,
}) => (
  <div className="border-b bg-muted/30 p-1 flex flex-wrap items-center gap-0.5">
    <ToolbarButton icon={<Undo className="h-4 w-4" />} tooltip="Hoàn tác (Ctrl+Z)" onClick={() => execCommand("undo")} />
    <ToolbarButton icon={<Redo className="h-4 w-4" />} tooltip="Làm lại (Ctrl+Y)" onClick={() => execCommand("redo")} />

    <Separator orientation="vertical" className="h-6 mx-1" />

    <Select onValueChange={formatBlock} defaultValue="p">
      <SelectTrigger className="h-8 w-[120px] text-xs">
        <SelectValue placeholder="Định dạng" />
      </SelectTrigger>
      <SelectContent>
        {HEADING_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value} className="text-xs">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    <Select onValueChange={(v) => execCommand("fontSize", v)} defaultValue="3">
      <SelectTrigger className="h-8 w-[80px] text-xs">
        <SelectValue placeholder="Cỡ chữ" />
      </SelectTrigger>
      <SelectContent>
        {FONT_SIZES.map((size) => (
          <SelectItem key={size.value} value={size.value} className="text-xs">
            {size.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    <Separator orientation="vertical" className="h-6 mx-1" />

    <ToolbarButton icon={<Bold className="h-4 w-4" />} tooltip="Đậm (Ctrl+B)" onClick={() => execCommand("bold")} />
    <ToolbarButton icon={<Italic className="h-4 w-4" />} tooltip="Nghiêng (Ctrl+I)" onClick={() => execCommand("italic")} />
    <ToolbarButton icon={<Underline className="h-4 w-4" />} tooltip="Gạch chân (Ctrl+U)" onClick={() => execCommand("underline")} />
    <ToolbarButton icon={<Strikethrough className="h-4 w-4" />} tooltip="Gạch ngang" onClick={() => execCommand("strikeThrough")} />
    <ToolbarButton icon={<Subscript className="h-4 w-4" />} tooltip="Chỉ số dưới" onClick={() => execCommand("subscript")} />
    <ToolbarButton icon={<Superscript className="h-4 w-4" />} tooltip="Chỉ số trên" onClick={() => execCommand("superscript")} />

    <Separator orientation="vertical" className="h-6 mx-1" />

    {/* Text Color */}
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Palette className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <div className="grid grid-cols-10 gap-1">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className="w-5 h-5 rounded border border-border hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              onClick={() => execCommand("foreColor", color)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>

    {/* Highlight */}
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Highlighter className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <div className="grid grid-cols-8 gap-1">
          {HIGHLIGHT_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className="w-5 h-5 rounded border border-border hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              onClick={() => execCommand("hiliteColor", color)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>

    <Separator orientation="vertical" className="h-6 mx-1" />

    <ToolbarButton icon={<AlignLeft className="h-4 w-4" />} tooltip="Căn trái" onClick={() => execCommand("justifyLeft")} />
    <ToolbarButton icon={<AlignCenter className="h-4 w-4" />} tooltip="Căn giữa" onClick={() => execCommand("justifyCenter")} />
    <ToolbarButton icon={<AlignRight className="h-4 w-4" />} tooltip="Căn phải" onClick={() => execCommand("justifyRight")} />
    <ToolbarButton icon={<AlignJustify className="h-4 w-4" />} tooltip="Căn đều" onClick={() => execCommand("justifyFull")} />

    <Separator orientation="vertical" className="h-6 mx-1" />

    <ToolbarButton icon={<List className="h-4 w-4" />} tooltip="Danh sách không thứ tự" onClick={() => execCommand("insertUnorderedList")} />
    <ToolbarButton icon={<ListOrdered className="h-4 w-4" />} tooltip="Danh sách có thứ tự" onClick={() => execCommand("insertOrderedList")} />

    <Separator orientation="vertical" className="h-6 mx-1" />

    <ToolbarButton icon={<Quote className="h-4 w-4" />} tooltip="Trích dẫn" onClick={() => formatBlock("blockquote")} />
    <ToolbarButton icon={<Code className="h-4 w-4" />} tooltip="Code" onClick={() => formatBlock("pre")} />

    <Separator orientation="vertical" className="h-6 mx-1" />

    {/* Link */}
    <LinkPopover
      linkUrl={link.linkUrl}
      setLinkUrl={link.setLinkUrl}
      insertLink={link.insertLink}
    />
    <ToolbarButton icon={<Unlink className="h-4 w-4" />} tooltip="Xoá liên kết" onClick={() => execCommand("unlink")} />

    {/* Image */}
    <ImagePopover {...image} />

    <Separator orientation="vertical" className="h-6 mx-1" />

    <ToolbarButton
      icon={<RemoveFormatting className="h-4 w-4" />}
      tooltip="Xoá định dạng"
      onClick={() => execCommand("removeFormat")}
    />
  </div>
);
