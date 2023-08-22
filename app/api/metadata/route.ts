import { BasicLinkMetadataType, LinkMetadataType } from "@/types";
import { getFirstKnownValue, getLogoFromURL } from "@/utils";
import { NextRequest, NextResponse } from "next/server";
import urlMetadata from "url-metadata";
import { v4 as uuidv4 } from "uuid";

const getLinkMetadata = async (url: string): Promise<LinkMetadataType> => {
  const hostname = new URL(url).hostname;
  const metadata = await urlMetadata(url);
  console.log(JSON.stringify(metadata, null, 2));

  const metadataTitle = getFirstKnownValue([
    metadata["og:title"],
    metadata["twitter:title"],
    metadata.title,
    hostname,
  ]);
  const metadataImage = getFirstKnownValue([
    metadata["og:image"],
    metadata.image,
  ]);
  const metadataDescription = getFirstKnownValue([
    metadata["og:description"],
    metadata.description,
  ]);

  // https://stackoverflow.com/a/10796141 : get favicon
  const linkMetadata: LinkMetadataType = {
    id: uuidv4(),
    logo: getLogoFromURL(url),
    url: url,
    description: metadataDescription,
    image: metadataImage,
    title: metadataTitle,
  };

  return linkMetadata;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url || typeof url !== "string") {
    return NextResponse.json(
      { error: "Invalid or missing URL parameter" },
      { status: 400 }
    );
  }

  try {
    const linkMetadata = await getLinkMetadata(url);
    return NextResponse.json(linkMetadata, { status: 200 });
  } catch (error) {
    const hostname = new URL(url).hostname;

    const linkMetadata: BasicLinkMetadataType = {
      id: uuidv4(),
      logo: `https://icons.duckduckgo.com/ip3/${hostname}.ico`,
      url: url,
      title: hostname,
    };

    return NextResponse.json(
      { error: "Error fetching metadata", ...linkMetadata },
      { status: 500 }
    );
  }
}
