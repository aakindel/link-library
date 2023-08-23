"use client";

import React, { useState } from "react";
import ContentEditable from "@/components/ContentEditable";

const PageTitle = () => {
  const defaultPageTitle = "Editable Page Title";
  const [, setPageTitle] = useState(defaultPageTitle);
  const [pageTitleClone] = useState(defaultPageTitle);

  return (
    <ContentEditable
      className="mb-10 text-3xl font-semibold"
      placeholder="Untitled"
      tag="h1"
      preventNewLine
      onInput={(event) => {
        setPageTitle((event.target as HTMLElement).innerText);
      }}
    >
      {pageTitleClone}
    </ContentEditable>
  );
};

export default PageTitle;
