"use client";

import {
  LoadingLinkMetadataType,
  BasicLinkMetadataType,
  LinkMetadataType,
} from "@/types";
import { persist } from "zustand/middleware";
import { useState, useEffect } from "react";
import { create } from "zustand";

type LinkStore = {
  addedLinks: (
    | LoadingLinkMetadataType
    | BasicLinkMetadataType
    | LinkMetadataType
  )[];
  addLoadingLink: (link: LoadingLinkMetadataType) => void;
  setLoadedLink: (link: LinkMetadataType | BasicLinkMetadataType) => void;
  deleteLink: (
    link: LoadingLinkMetadataType | BasicLinkMetadataType | LinkMetadataType
  ) => void;
  setAddedLinks: (links: (LinkMetadataType | BasicLinkMetadataType)[]) => void;
};

export const useLinkStore = create<LinkStore>()(
  persist(
    (set) => ({
      addedLinks: [],
      addLoadingLink: (link: LoadingLinkMetadataType) =>
        set((state) => ({ addedLinks: [...state.addedLinks, link] })),
      setLoadedLink: (link: LinkMetadataType | BasicLinkMetadataType) =>
        set((state) => {
          const newAddedLinks = [...state.addedLinks];
          newAddedLinks.splice(
            state.addedLinks.findIndex(
              (addedLink) =>
                addedLink.id === link.id && "isLoading" in addedLink
            ),
            1,
            { ...link }
          );
          return { addedLinks: newAddedLinks };
        }),
      deleteLink: (
        link: LoadingLinkMetadataType | BasicLinkMetadataType | LinkMetadataType
      ) =>
        set((state) => {
          const newAddedLinks = [...state.addedLinks];
          newAddedLinks.splice(
            state.addedLinks.findIndex((addedLink) => addedLink.id === link.id),
            1
          );
          return { addedLinks: newAddedLinks };
        }),
      setAddedLinks: (links: (LinkMetadataType | BasicLinkMetadataType)[]) =>
        set({ addedLinks: [...links] }),
    }),
    {
      name: "zustand-store",
    }
  )
);

// from https://docs.pmnd.rs/zustand/integrations/persisting-store-data
export const useLinkStoreHydration = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsubHydrate = useLinkStore.persist.onHydrate(() =>
      setHydrated(false)
    );

    const unsubFinishHydration = useLinkStore.persist.onFinishHydration(() =>
      setHydrated(true)
    );

    setHydrated(useLinkStore.persist.hasHydrated());

    return () => {
      unsubHydrate();
      unsubFinishHydration();
    };
  }, []);

  return hydrated;
};
