import type { CamelCasedProperties } from "@services/query";

export type SUBCATEGORIES_DTO = {
  id: string;
  name: string;
  category_id: string;
  description: string;
  slug: string;
};

export type SUBCATEGORIES_CAMEL_DTO = CamelCasedProperties<SUBCATEGORIES_DTO>;
