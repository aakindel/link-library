"use client";

import React from "react";
import ContentEditable from "@/components/ContentEditable";

const PageTitle = ({
  pageTitleClone,
  setPageTitle,
}: {
  pageTitleClone: string | undefined;
  setPageTitle: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <ContentEditable
      className="mb-10 text-3xl font-semibold text-neutral-700 dark:text-neutral-300"
      placeholder="Untitled"
      tag="h1"
      preventNewLine
      onInput={(event) => {
        setPageTitle((event.target as HTMLElement).innerText);
      }}
    >
      {pageTitleClone ?? ""}
    </ContentEditable>
  );
};

export default PageTitle;
