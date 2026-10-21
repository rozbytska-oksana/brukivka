export interface ImageAsset {
  id: string;
  src: string;
  large: string;
  thumbnail?: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  variants: { src: string; width: number }[];
}
export interface Category {
  slug: string;
  group: string;
  title: string;
  seoTitle: string;
  description: string;
  guide: { title: string; text: string; checklist: string[] };
  cover: string;
  count: number;
}

export interface BusinessContacts {
  sinceYear: number;
  siteURL: string;
  phones: readonly { number: string; label: string }[];
  emails: readonly string[];
  address: { country: string; city: string; street: string; label: string };
}
