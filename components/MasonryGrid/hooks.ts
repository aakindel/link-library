import { RefObject, useCallback, useEffect, useState } from "react";

// https://www.manuelkruisz.com/blog/posts/react-width-height-resize-hook
// https://stackoverflow.com/a/59989768 : get width of react element
export const useRefDimensions = (myRef: RefObject<HTMLElement>) => {
  const [refWidth, setRefWidth] = useState(-1);
  const [refHeight, setRefHeight] = useState(-1);

  const updateRefDimensions = useCallback(() => {
    if (myRef.current) {
      setRefWidth(myRef.current.offsetWidth);
      setRefHeight(myRef.current.offsetHeight);
    }
  }, [myRef]);

  useEffect(() => {
    updateRefDimensions();

    window.addEventListener("load", updateRefDimensions);
    window.addEventListener("resize", updateRefDimensions);

    return () => {
      window.removeEventListener("load", updateRefDimensions);
      window.removeEventListener("resize", updateRefDimensions);
    };
  }, [myRef, updateRefDimensions]);

  return { refWidth, refHeight, updateRefDimensions };
};

// https://codesandbox.io/s/masonry-grid-mdovb?file=/src/useMedia.ts
export const useColumnsAtBreakpoints = (breakpointColumns: {
  [key: number]: number;
}): number => {
  const queries = Object.keys(breakpointColumns)
    .map((key) => {
      return `(min-width: ${key}px)`;
    })
    .reverse();
  const values = Object.values(breakpointColumns).reverse();

  const match = useCallback(
    () => values[queries.findIndex((q) => matchMedia(q).matches)] || 1,
    [queries, values]
  );

  const [value, set] = useState(match);

  const handler = useCallback(() => {
    set(() => values[queries.findIndex((q) => matchMedia(q).matches)] || 1);
  }, [queries, values]);

  useEffect(() => {
    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [handler]);

  return value >= 1 ? value : 1;
};
