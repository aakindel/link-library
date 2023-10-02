import { Skeleton } from "@/components/Skeleton";
import {
  BasicLinkMetadataType,
  LinkMetadataType,
  LoadingLinkMetadataType,
} from "@/types";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { cn } from "@/utils";
import { useLinkStore } from "./store";
import React from "react";
import { ImageIcon } from "lucide-react";

const LinkCard = React.forwardRef(
  (
    {
      link,
      noBorder = false,
    }: {
      link: BasicLinkMetadataType | LinkMetadataType | LoadingLinkMetadataType;
      noBorder?: boolean;
    },
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    const deleteLink = useLinkStore((state) => state.deleteLink);

    return (
      <div ref={ref} className="group/block relative h-full w-full">
        <div
          className={cn(
            "h-full w-full overflow-hidden rounded-md bg-white hover:bg-neutral-50 dark:bg-neutral-950 dark:hover:bg-neutral-900",
            !noBorder &&
              "border border-solid border-neutral-200 dark:border-neutral-800"
          )}
        >
          <Link
            href={link.url}
            target="_blank"
            className="flex h-full w-full flex-col items-center"
          >
            {(link as LinkMetadataType)?.image ? (
              <picture className="flex w-full items-center justify-center bg-white dark:bg-neutral-950">
                <img
                  className="aspect-[73/41] w-full max-w-[610px] border-b border-neutral-200 object-cover dark:border-neutral-800 sm:max-w-[355px] md:max-w-[315px] lg:max-w-[295px]"
                  src={(link as LinkMetadataType)?.image ?? ""}
                  alt={`${new URL(link.url).hostname ?? "site"} image`}
                ></img>
              </picture>
            ) : (
              <div className="flex aspect-[73/41] w-full items-center justify-center border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                <ImageIcon className="h-20 w-20 text-neutral-200 dark:text-neutral-800" />
              </div>
            )}
            <div className="flex w-full items-center gap-2.5 px-2.5 py-4">
              <div className="min-w-8">
                {"isLoading" in link ? (
                  <Skeleton className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-800" />
                ) : (
                  <picture className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-md bg-transparent">
                    <img
                      className={cn(
                        "relative block h-auto w-full max-w-full overflow-hidden object-cover"
                      )}
                      alt={"link logo"}
                      src={link.logo}
                    ></img>
                  </picture>
                )}
              </div>
              <div className="flex max-w-full flex-1 flex-col gap-1.5 overflow-hidden">
                {"isLoading" in link ? (
                  <Skeleton className="h-[20px] w-full rounded-md" />
                ) : (
                  <span className="line-clamp-2 max-h-[40px] w-full overflow-hidden text-ellipsis whitespace-normal break-words text-sm font-medium leading-[20px] text-neutral-700 dark:text-neutral-300">
                    {link.title ? link.title : link.url}
                  </span>
                )}
                <span className="block w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs font-normal text-neutral-500 dark:text-neutral-500">
                  {link.url}
                </span>
              </div>
            </div>
          </Link>
        </div>
        <span
          className="absolute right-0 top-0 -mr-1.5 -mt-1.5 flex h-4 w-4 cursor-pointer select-none opacity-0 transition-opacity group-hover/block:opacity-100"
          onClick={(e) => {
            e.preventDefault();
            deleteLink(link);
          }}
        >
          <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 dark:bg-red-700">
            <XMarkIcon className="h-2.5 w-2.5 stroke-2 text-white" />
          </span>
        </span>
      </div>
    );
  }
);
LinkCard.displayName = "LinkCard";

export default LinkCard;
