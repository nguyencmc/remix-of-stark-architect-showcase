import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link } from "lucide-react";
import type { LinkPopoverProps } from "./types";

export const LinkPopover: React.FC<LinkPopoverProps> = ({
  linkUrl,
  setLinkUrl,
  insertLink,
}) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <Link className="h-4 w-4" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-72 p-3">
      <div className="space-y-2">
        <label className="text-sm font-medium">Chèn liên kết</label>
        <Input
          placeholder="https://example.com"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && insertLink()}
        />
        <Button size="sm" onClick={insertLink} className="w-full">
          Chèn
        </Button>
      </div>
    </PopoverContent>
  </Popover>
);
