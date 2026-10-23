export type Bundle = {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string;
  /** Background tone of the card: peach, green, blue or rose. */
  tone: string;
};

export type Collection = {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string;
};
