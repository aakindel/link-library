import React from "react";
import { cn } from "@/utils";

type TagType = keyof JSX.IntrinsicElements;

type ContentEditableProps = {
  className?: string;
  style?: React.CSSProperties;
  tag?: TagType;
  placeholder?: string;
  preventNewLine?: boolean;
  children?: JSX.Element | string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
  onInput?: (event: React.SyntheticEvent<HTMLElement, Event>) => void;
} & Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>,
  keyof React.SVGProps<SVGSymbolElement>
>;

const ContentEditable = ({
  className = "",
  style = {},
  tag = "div",
  placeholder = "",
  preventNewLine = false,
  children,
  onKeyDown,
  onInput,
  ...props
}: ContentEditableProps) => {
  /* empties out contenteditable if it only contains <br> tag 
     (so that placeholder will show up); e.g. if you type 'x',
     press ENTER, then CMD + A & BACKSPACE, a <br> tag is left */
  const removeBreakTag = (event: React.SyntheticEvent) => {
    if ((event.target as HTMLElement).innerHTML.trim() === "<br>") {
      (event.target as HTMLElement).innerText = "";
    }
  };

  const preventEnterKey = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const Tag = (() => {
    return tag;
  })() as TagType;

  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      spellCheck="false"
      onPaste={(event) => {
        // if preventNewLine, prevent multi-line strings from being pasted
        if (
          preventNewLine &&
          JSON.stringify(event.clipboardData.getData("Text")).includes("\\n")
        ) {
          event.preventDefault();
        }
      }}
      onKeyDown={(event) => {
        onKeyDown && onKeyDown(event as React.KeyboardEvent<HTMLElement>);
        preventNewLine &&
          preventEnterKey(event as React.KeyboardEvent<HTMLElement>);
      }}
      onInput={(event) => {
        onInput && onInput(event as React.SyntheticEvent<HTMLElement, Event>);
        removeBreakTag(event as React.SyntheticEvent<HTMLElement, Event>);
      }}
      placeholder={placeholder}
      className={cn(
        /* https://stackoverflow.com/a/61659129 : show contenteditable placeholder */
        "block text-neutral-700 empty:before:pointer-events-none empty:before:text-neutral-400 empty:before:content-[attr(placeholder)] focus:outline-none dark:text-neutral-300 empty:before:dark:text-neutral-600",
        className
      )}
      style={{ ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default ContentEditable;
