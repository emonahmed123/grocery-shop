/** A store category, from the backend or the built-in demo list. */
export type Category = {
  id: string;
  name: string;
  slug: string;
  /** Full image URLs. */
  image: {
    thumbnail: string;
    original: string;
  };
  /** Small icon for the search filters; the thumbnail is used when there is none. */
  icon?: string;
  children?: {
    id: string;
    name: string;
    slug: string;
  }[];
};

/** A simple named filter option, such as a dietary need or a brand. */
export type FilterOption = {
  id: number;
  name: string;
  slug: string;
};
