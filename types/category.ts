export type Category = {
  id: number;
  name: string;
  slug: string;
  image: {
    id: number;
    thumbnail: string;
    original: string;
  };
  icon: string;
  children?: {
    id: number;
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
