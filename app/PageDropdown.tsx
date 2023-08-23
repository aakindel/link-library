"use client";

import { Button } from "@/components/Button";
import { useLinkStore } from "./store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/DropdownMenu";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import { useState } from "react";
import { ThemeChangerSwitch } from "@/components/ThemeChanger";

export default function PageDropdown() {
  const addedLinks = useLinkStore((state) => state.addedLinks);
  const { resolvedTheme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(resolvedTheme === "dark");

  const changeTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
    setIsDarkMode(!isDarkMode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="pointer-events-auto flex h-9 w-9 items-center justify-center p-[6px] text-neutral-500 transition-none hover:bg-neutral-100 hover:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-400"
        >
          <span className="sr-only">Actions</span>
          <EllipsisHorizontalIcon className="h-6 w-6 stroke-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="flex cursor-pointer items-center space-x-16"
          onSelect={(e) => {
            e.preventDefault();
            changeTheme();
          }}
        >
          <span>Dark mode</span>
          <ThemeChangerSwitch
            isDarkMode={isDarkMode}
            changeTheme={changeTheme}
          />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="flex flex-col gap-1 px-2 py-1.5 text-xs text-neutral-500">
          <span className="block">Web links: {addedLinks.length}</span>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
