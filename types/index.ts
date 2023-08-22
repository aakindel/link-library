export type LoadingLinkMetadataType = {
  id: string;
  isLoading: boolean;
  url: string;
};

export type BasicLinkMetadataType = {
  id: string;
  logo: string;
  url: string;
  title: string;
};

export type LinkMetadataType = BasicLinkMetadataType & {
  description: string;
  image: string;
};
