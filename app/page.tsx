"use client";

import type { NextPage } from "next";
import React, { useState } from "react";
import ThemeChanger from "@/components/ThemeChanger";
import PageTitle from "./PageTitle";
import AddLinkDialog from "./AddLinkDialog";

const Home: NextPage = () => {
  const [showAddLinkDialog, setShowAddLinkDialog] = useState(false);

  return (
    <React.Fragment>
      <main>
        <div className="mx-auto flex h-[60px] w-full max-w-7xl flex-wrap items-center justify-end px-4">
          <ul className="flex list-none items-center gap-4 sm:gap-4">
            <li className="block">
              <ThemeChanger />
            </li>
          </ul>
        </div>
        <div className="mx-auto min-h-[calc(100vh-60px)] max-w-7xl px-4">
          <PageTitle />
          <div className="mb-20 grid h-full w-full max-w-full grid-flow-dense grid-cols-1 gap-4 text-sm sm:grid-cols-2 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6">
            <AddLinkDialog
              showAddLinkDialog={showAddLinkDialog}
              setShowAddLinkDialog={setShowAddLinkDialog}
            ></AddLinkDialog>
          </div>
        </div>
      </main>
    </React.Fragment>
  );
};

export default Home;
