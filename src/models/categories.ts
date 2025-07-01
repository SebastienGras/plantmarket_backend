import type { CamelCasedProperties } from "@services/query";

export type CATEGORY_DTO = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
};

export type CATEGORY_CAMEL_DTO = CamelCasedProperties<CATEGORY_DTO>;
