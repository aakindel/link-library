import { BasicLinkMetadataType, LinkMetadataType } from "@/types";
import { twMerge } from "tailwind-merge";
import { ClassValue, clsx } from "clsx";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

// from https://github.com/shadcn/ui/blob/main/templates/next-template/lib/utils.ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFirstKnownValue = (valueArray: unknown[]) => {
  const firstKnownValue = valueArray.find(
    (value) => value && value !== undefined && value != null
  );

  return firstKnownValue && typeof firstKnownValue === "string"
    ? firstKnownValue
    : "";
};

export const getLogoFromURL = (url: string) => {
  const hostname = new URL(url).hostname;
  return `https://icons.duckduckgo.com/ip3/${hostname}.ico`;
};

export async function fetchMetadata(
  url: string
): Promise<LinkMetadataType | BasicLinkMetadataType> {
  return axios
    .get(`/api/metadata?url=${encodeURIComponent(url.trim())}`) // send a GET request
    .then((response) => {
      return response.data as LinkMetadataType;
    })
    .catch((error) => {
      const hostname = new URL(url).hostname;

      const linkMetadata: BasicLinkMetadataType = {
        id: uuidv4(),
        logo: getLogoFromURL(url),
        url: url,
        title: hostname,
      };

      // error is handled in catch block
      if (error.response) {
        // status code out of the range of 2xx
        console.error("Data :", error.response.data);
        console.error("Status :" + error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error(error.request);
      } else {
        // Error on setting up the request
        console.error("Error", error.message);
      }

      return linkMetadata;
    });
}
