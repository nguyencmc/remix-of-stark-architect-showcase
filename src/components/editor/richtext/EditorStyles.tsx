import React from "react";

export const EditorStyles: React.FC = () => (
  <style>{`
    [contenteditable]:empty:before {
      content: attr(data-placeholder);
      color: hsl(var(--muted-foreground));
      pointer-events: none;
    }

    /* ── Code block copy button ── */
    .rte-copy-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 6px;
      border: 1px solid rgba(205, 214, 244, 0.2);
      background: rgba(205, 214, 244, 0.08);
      color: #a6adc8;
      cursor: pointer;
      transition: background 0.15s, color 0.15s, border-color 0.15s;
      z-index: 10;
    }
    .rte-copy-btn:hover {
      background: rgba(205, 214, 244, 0.18);
      color: #cdd6f4;
      border-color: rgba(205, 214, 244, 0.4);
    }
    .rte-copy-btn--copied {
      background: rgba(166, 227, 161, 0.18) !important;
      color: #a6e3a1 !important;
      border-color: rgba(166, 227, 161, 0.4) !important;
    }

    /* ── Image resize wrapper & handle ── */
    .rte-img-wrap {
      position: relative !important;
      display: inline-block !important;
      line-height: 0;
      user-select: none;
      vertical-align: middle;
    }
    .rte-img-wrap img {
      display: block !important;
      max-width: 100%;
      height: auto;
    }
    .rte-img-handle {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 16px;
      height: 16px;
      background: hsl(var(--primary));
      border: 2px solid hsl(var(--background));
      border-radius: 3px 0 4px 0;
      cursor: se-resize;
      opacity: 0;
      transition: opacity 0.15s;
      z-index: 20;
      touch-action: none;
    }
    .rte-img-handle::after {
      content: '';
      position: absolute;
      inset: 2px;
      background: repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 1px,
        hsl(var(--primary-foreground)) 1px,
        hsl(var(--primary-foreground)) 2px
      );
      border-radius: 1px;
      opacity: 0.7;
    }
    .rte-img-wrap:hover .rte-img-handle {
      opacity: 1;
    }
    .rte-img-wrap:hover img {
      outline: 2px solid hsl(var(--primary) / 0.5);
      outline-offset: 1px;
      border-radius: 4px;
    }
  `}</style>
);
