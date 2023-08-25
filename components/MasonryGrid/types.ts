import { RefObject } from "react";

export type MasonryGridProps = {
  children: React.ReactElement[];
  shouldShowGridDimensions?: boolean;
  shouldCenterGridInContainer?: boolean;
  shouldDisableGridTransitions?: boolean;
  breakpointColumns?: {
    [key: number]: number;
  };
  alignment?: "vertical" | "horizontal" | "indexHorizontal";
  columnWidth?: number | string;
  gutterWidth?: number;
  gutterHeight?: number;
  userGridContainerRef?: RefObject<HTMLDivElement> | null;
  isGridLoading?: boolean;
  setIsGridLoading?: React.Dispatch<React.SetStateAction<boolean>>;
};

export type doLayoutForClientProps = MasonryGridProps & {
  gridContainerWidth: number;
};

export type rectType = {
  top: number;
  left: number;
  width: number;
  height: number;
};
