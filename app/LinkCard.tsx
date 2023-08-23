import { Skeleton } from "@/components/Skeleton";
import {
  BasicLinkMetadataType,
  LinkMetadataType,
  LoadingLinkMetadataType,
} from "@/types";
import { cn } from "@/utils";

const LinkCard = ({
  link,
  noBorder = false,
}: {
  link: BasicLinkMetadataType | LinkMetadataType | LoadingLinkMetadataType;
  noBorder?: boolean;
}) => {
  return (
    <div
      className={cn(
        noBorder
          ? "bg-white dark:bg-neutral-900"
          : "h-full w-full rounded-md border border-solid border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-900"
      )}
    >
      <div className="flex h-full items-center gap-2.5 px-2.5 py-4">
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
    </div>
  );
};

export default LinkCard;
