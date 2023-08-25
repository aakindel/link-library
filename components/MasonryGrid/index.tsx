"use client";

/* 
  Adaptation of tsuyoshiwada's react-stack-grid
  - repo: https://github.com/tsuyoshiwada/react-stack-grid
  - demo: https://tsuyoshiwada.github.io/react-stack-grid/
*/

import React, {
  RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  createArray,
  isNumber,
  isPercentageNumber,
  arrayOfObjectsEqual,
} from "./utils";
import { MasonryGridProps, doLayoutForClientProps, rectType } from "./types";
import { useColumnsAtBreakpoints, useRefDimensions } from "./hooks";

const TRANSITION_DURATION = 300;

// wrapper around elements passed into MasonryGrid
const GridItem = ({
  children,
  style,
}: {
  children: React.ReactElement;
  style: React.CSSProperties;
}) => {
  return (
    <div
      style={{
        ...style,
        display: "block",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1,
      }}
    >
      {children}
    </div>
  );
};

// returns numerical column width and max # of columns gridContainer can fit
const getColumnWidthAndMaxColumnsInContainer = (
  containerWidth: number,
  userColumnWidth: number | string,
  gutterWidth: number
): [number, number] => {
  if (isNumber(userColumnWidth)) {
    // e.g. `columnWidth` = 400 (i.e. 400px)
    const columnWidth = parseFloat(userColumnWidth.toString());
    const sumOfGutterWidths = (containerWidth / columnWidth - 1) * gutterWidth;
    const maxColumns = Math.floor(
      (containerWidth - sumOfGutterWidths) / columnWidth
    );

    return [columnWidth, maxColumns];
  } else if (isPercentageNumber(userColumnWidth)) {
    // e.g. `columnWidth` = "33%" (i.e. 33% of containerWidth)
    const columnPercentage = parseFloat(userColumnWidth.toString()) / 100;
    const maxColumns = Math.floor(1 / columnPercentage);
    const sumOfGutterWidths = gutterWidth * (maxColumns - 1);
    const columnWidth = (containerWidth - sumOfGutterWidths) / maxColumns;

    return [columnWidth, maxColumns];
  }

  // if `userColumnWidth` has invalid type (i.e. not number | string)
  return [-1, -1];
};

const doLayoutForClient = ({
  children,
  alignment,
  gridContainerWidth,
  columnWidth: rawColumnWidth = 400,
  gutterWidth = 10,
  gutterHeight = 10,
}: doLayoutForClientProps): { rects: rectType[]; gridHeight: number } => {
  // store the grid's children elements in an array
  const childArray = React.Children.toArray(children) as React.ReactElement[];

  // create default layout to return if computing layout has errors
  const defaultLayout = {
    rects: [{ top: -1, left: -1, width: -1, height: -1 }],
    gridHeight: -1,
  };

  if (!childArray.length) {
    return defaultLayout;
  }

  const getItemHeight = (el: HTMLElement): number => {
    if (el !== null || el !== undefined) {
      const candidate = [
        el?.scrollHeight,
        el?.clientHeight,
        el?.offsetHeight,
        0,
      ].filter(isNumber);

      return Math.max(...candidate);
    }

    return 0;
  };

  // get column width and the max # of columns that can fit in container
  const [columnWidth, maxColumns] = getColumnWidthAndMaxColumnsInContainer(
    gridContainerWidth, // containerWidth
    rawColumnWidth, // rawColumnWidth
    gutterWidth // gutterWidth
  );

  // if `columnWidth` or `maxColumns` is invalid, return
  if (columnWidth === -1 || maxColumns === -1) {
    return defaultLayout;
  }

  const columnHeights = createArray(0, maxColumns);

  const sumHeights = childArray.reduce(
    (sum, child) =>
      (sum as number) +
      Math.round(getItemHeight(child.props.element)) +
      gutterHeight,
    0
  ) as number;

  let rects: rectType[];

  if (alignment === "vertical") {
    const maxHeight = sumHeights / maxColumns;

    let currentColumn = 0;

    rects = childArray.map((child) => {
      const column =
        currentColumn >= maxColumns - 1 ? maxColumns - 1 : currentColumn;
      const height = getItemHeight(child.props.element);
      const left = column * columnWidth + column * gutterWidth;
      const top =
        columnHeights[column] === undefined ? null : columnHeights[column];

      if (height) {
        columnHeights[column] += Math.round(height) + gutterHeight;
      }
      if (columnHeights[column] >= maxHeight) {
        currentColumn += 1;
      }

      return { top, left, width: columnWidth, height };
    });
  } else {
    rects = childArray.map((child, index) => {
      const column =
        alignment === "indexHorizontal"
          ? index % maxColumns
          : columnHeights.indexOf(Math.min(...columnHeights));
      const height = getItemHeight(child.props.element);
      const left = column * columnWidth + column * gutterWidth;
      const top = columnHeights[column];

      columnHeights[column] += Math.round(height) + gutterHeight;

      return { top, left, width: columnWidth, height };
    });
  }

  const height = Math.max(...columnHeights) - gutterHeight;

  const layout = { rects: rects, gridHeight: height };

  return layout;
};

const MasonryGrid = React.forwardRef(
  (
    {
      children,
      shouldShowGridDimensions = false,
      shouldCenterGridInContainer = false,
      shouldDisableGridTransitions: propShouldDisableGridTransitions = false,
      breakpointColumns,
      alignment = "indexHorizontal",
      columnWidth = 150,
      gutterWidth = 0,
      gutterHeight = 0,
      userGridContainerRef = null,
      isGridLoading: userIsGridLoading,
      setIsGridLoading: userSetIsGridLoading,
    }: MasonryGridProps,
    ref
  ) => {
    const [gridMaxWidth, setGridMaxWidth] = useState(-1);
    const [shouldDisableGridTransitions, setShouldDisableGridTransitions] =
      useState(true);

    const [localIsGridLoading, setLocalIsGridLoading] = useState(true);
    const isGridLoading =
      userIsGridLoading !== undefined ? userIsGridLoading : localIsGridLoading;
    const setIsGridLoading = userSetIsGridLoading
      ? userSetIsGridLoading
      : setLocalIsGridLoading;

    const breakpointColumnPercentage = `${
      (1 / useColumnsAtBreakpoints(breakpointColumns ?? [])) * 100
    }%`;

    // array of refs for children passed into MasonryGrid
    const childrenRef = useRef<RefObject<Element>[]>([]);

    // associate each child to its ref and rendered element
    const validChildren: React.ReactElement[] = React.Children.map(
      children,
      (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement, {
            element: childrenRef.current[index],
            ref: (ref: RefObject<Element>) =>
              (childrenRef.current[index] = ref),
          });
        }
      }
    );

    // ref for the grid container
    const innerGridContainerRef = useRef<HTMLDivElement>(null);

    const gridContainerRef = userGridContainerRef
      ? userGridContainerRef
      : innerGridContainerRef;

    // get grid container's width and height
    const {
      refWidth: gridContainerWidth,
      refHeight: gridContainerHeight,
      updateRefDimensions,
    } = useRefDimensions(gridContainerRef);

    const [gridHeight, setGridHeight] = useState<number>(-1);

    const [rects, setRects] = useState<rectType[]>([
      { top: 0, left: 0, width: 0, height: 0 },
    ]);

    useEffect(() => {
      if (gridHeight > 0) {
        updateRefDimensions();
      }
    }, [gridHeight, updateRefDimensions]);

    useEffect(() => {
      if (gridContainerWidth !== -1 && gridContainerHeight !== -1) {
        setIsGridLoading(false);
        setTimeout(() => {
          setShouldDisableGridTransitions(propShouldDisableGridTransitions);
        }, TRANSITION_DURATION);
      }
    }, [
      gridContainerWidth,
      gridContainerHeight,
      propShouldDisableGridTransitions,
      setIsGridLoading,
    ]);

    const updateLayout = useCallback(() => {
      // get column width and the max # of columns that can fit in container
      const [numericalColumnWidth, maxColumns] =
        getColumnWidthAndMaxColumnsInContainer(
          gridContainerWidth, // containerWidth
          breakpointColumns ? breakpointColumnPercentage : columnWidth, // rawColumnWidth
          gutterWidth // gutterWidth
        );

      const layout = doLayoutForClient({
        children: validChildren,
        alignment,
        gridContainerWidth,
        columnWidth: breakpointColumns
          ? breakpointColumnPercentage
          : columnWidth,
        gutterWidth,
        gutterHeight,
      });
      if (
        !arrayOfObjectsEqual(rects, layout.rects) &&
        layout.rects[0].top !== null
      ) {
        setRects(layout.rects);
        setGridHeight(layout.gridHeight);
      }

      const maxWidth =
        maxColumns * numericalColumnWidth + (maxColumns - 1) * gutterWidth;

      if (maxColumns !== -1 && maxWidth !== gridMaxWidth) {
        setGridMaxWidth(
          maxWidth >= gridContainerWidth ? gridContainerWidth : maxWidth
        );
      }
    }, [
      validChildren,
      gridContainerWidth,
      gutterWidth,
      gutterHeight,
      columnWidth,
      breakpointColumns,
      breakpointColumnPercentage,
      rects,
      alignment,
      gridMaxWidth,
    ]);

    useEffect(() => {
      updateLayout();
    }, [updateLayout]);

    const getPositionStyles = (rect: rectType): React.CSSProperties => {
      if (!rect) return {};
      return {
        transform: `translateX(${Math.round(
          rect.left
        )}px) translateY(${Math.round(rect.top)}px)`,
        width: `${rect.width}px`,
        transition: !shouldDisableGridTransitions
          ? `opacity ${TRANSITION_DURATION}ms cubic-bezier(0.165, 0.84, 0.44, 1) 0s, transform ${TRANSITION_DURATION}ms cubic-bezier(0.165, 0.84, 0.44, 1) 0s`
          : "",
      };
    };

    // https://stackoverflow.com/a/37950970 : call child method from parent
    useImperativeHandle(ref, () => ({
      updateLayout() {
        updateLayout();
      },
    }));

    return (
      <div
        ref={gridContainerRef}
        className="flex h-full w-full flex-col items-center"
        style={{ opacity: isGridLoading ? 0 : 1 }}
      >
        {shouldShowGridDimensions && (
          <div>
            {`[gridWidth: ${gridContainerWidth}, gridHeight: ${gridContainerHeight}]`}
          </div>
        )}
        <div
          className="relative"
          style={{
            width:
              shouldCenterGridInContainer && gridMaxWidth !== -1
                ? gridMaxWidth
                : "100%",
            height: `${gridHeight}px`,
            transition: !shouldDisableGridTransitions
              ? "height 200ms ease"
              : "",
          }}
        >
          {validChildren.map((child, index) => {
            return (
              <GridItem
                key={child.key}
                style={rects ? getPositionStyles(rects[index]) : {}}
              >
                {child}
              </GridItem>
            );
          })}
        </div>
      </div>
    );
  }
);
MasonryGrid.displayName = "MasonryGrid";

export default MasonryGrid;
