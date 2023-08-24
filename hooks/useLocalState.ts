"use client";

import { useState, useEffect } from "react";

export const useLocalState = (key: string, defaultValue: unknown) => {
  const [value, setValue] = useState(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem(key) : "";
    const initial = saved ? JSON.parse(saved) : null;
    return initial !== null ? initial : defaultValue;
  });

  useEffect(() => {
    typeof window !== "undefined" &&
      localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
