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
};
