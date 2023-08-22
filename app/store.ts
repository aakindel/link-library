"use client";

import {
  LoadingLinkMetadataType,
  BasicLinkMetadataType,
  LinkMetadataType,
} from "@/types";
import { create } from "zustand";

type LinkStore = {
  addedLinks: (
    | LoadingLinkMetadataType
    | BasicLinkMetadataType
    | LinkMetadataType
  )[];
  addLoadingLink: (link: LoadingLinkMetadataType) => void;
  setLoadedLink: (link: LinkMetadataType | BasicLinkMetadataType) => void;
  setAddedLinks: (links: (LinkMetadataType | BasicLinkMetadataType)[]) => void;
};

export const useLinkStore = create<LinkStore>((set) => ({
  addedLinks: [],
  addLoadingLink: (link: LoadingLinkMetadataType) =>
    set((state) => ({ addedLinks: [...state.addedLinks, link] })),
  setLoadedLink: (link: LinkMetadataType | BasicLinkMetadataType) =>
    set((state) => {
      const newAddedLinks = [...state.addedLinks];
      newAddedLinks.splice(
        state.addedLinks.findIndex(
          (addedLink) => addedLink.id === link.id && "isLoading" in addedLink
        ),
        1,
        { ...link }
      );
      return { addedLinks: newAddedLinks };
    }),
  setAddedLinks: (links: (LinkMetadataType | BasicLinkMetadataType)[]) =>
    set({ addedLinks: [...links] }),
}));
