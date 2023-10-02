"use client";

import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import PageTitle from "./PageTitle";
import AddLinkDialog from "./AddLinkDialog";
import { useLinkStore, useLinkStoreHydration } from "./store";
import LinkCard from "./LinkCard";
import PageDropdown from "./PageDropdown";
import DeleteAllLinksDialog from "./DeleteAllLinksDialog";
import { Spinner } from "@/components/Spinner";
import { useLocalState } from "@/hooks/useLocalState";
import MasonryGrid from "@/components/MasonryGrid";

const Home: NextPage = () => {
  const addedLinks = useLinkStore((state) => state.addedLinks);
  const [showAddLinkDialog, setShowAddLinkDialog] = useState(false);
  const isLinkStoreHydrated = useLinkStoreHydration();
  const [showDeleteAllLinksDialog, setShowDeleteAllLinksDialog] =
    useState(false);

  const pageTitleKey = "page-title";
  const defaultPageTitle = "Editable Page Title";
  const [, setPageTitle] = useLocalState(pageTitleKey, defaultPageTitle);
  const [pageTitleClone, setPageTitleClone] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const localPageTitle = localStorage.getItem(pageTitleKey);
    setTimeout(() => {
      setPageTitleClone(
        localPageTitle !== null
          ? JSON.parse(localPageTitle)
          : "defaultPageTitle"
      );
    }, 250);
  }, [setPageTitleClone]);

  return isLinkStoreHydrated && pageTitleClone !== undefined ? (
    <React.Fragment>
      <main>
        <div className="mx-auto flex h-[60px] w-full max-w-7xl flex-wrap items-center justify-end px-4">
          <ul className="flex list-none items-center gap-4 sm:gap-4">
            <li className="block">
              <PageDropdown
                setShowDeleteAllLinksDialog={setShowDeleteAllLinksDialog}
              />
              <DeleteAllLinksDialog
                showDeleteAllLinksDialog={showDeleteAllLinksDialog}
                setShowDeleteAllLinksDialog={setShowDeleteAllLinksDialog}
              />
            </li>
          </ul>
        </div>
        <div className="mx-auto min-h-[calc(100vh-60px)] max-w-7xl px-4 pb-32">
          <PageTitle
            pageTitleClone={pageTitleClone}
            setPageTitle={setPageTitle}
          />
          <AddLinkDialog
            showAddLinkDialog={showAddLinkDialog}
            setShowAddLinkDialog={setShowAddLinkDialog}
          />
          <MasonryGrid
            breakpointColumns={{ 640: 2, 768: 3, 1024: 4 }}
            gutterWidth={24}
            gutterHeight={24}
          >
            {addedLinks.map((addedLink, index) => {
              return <LinkCard key={index} link={addedLink} />;
            })}
          </MasonryGrid>
          <button
            className="fixed bottom-10 right-10 z-[90] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-neutral-800 shadow-md transition-colors duration-100 hover:bg-neutral-700 dark:bg-neutral-100 dark:hover:bg-neutral-200"
            onClick={() => {
              setShowAddLinkDialog(true);
            }}
          >
            <PlusIcon className="h-6 w-6 stroke-[3] text-white dark:text-neutral-950" />
          </button>
        </div>
      </main>
    </React.Fragment>
  ) : (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-2.5">
      <Spinner className="h-7 w-7 text-neutral-400 dark:text-neutral-500" />
      <span className="block text-sm text-neutral-400 dark:text-neutral-500">
        Loading link page...
      </span>
    </div>
  );
};

export default Home;
