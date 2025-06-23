export type USER_DTO = {
  id: string;
  email: string;
  passwordHash: string;
  firstname: string;
  lastname: string;
  phoneNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  zipcode?: string;
  country?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type USER_CAMEL_DTO = {
  id: string;
  email: string;
  passwordHash: string;
  firstname: string;
  lastname: string;
  phoneNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  zipcode?: string;
  country?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type USER_CAMEL_DTO_WITH_TOKEN = USER_CAMEL_DTO & {
  token: string;
};
