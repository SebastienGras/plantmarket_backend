import camelcaseKeys from "camelcase-keys";

import db from "./db";
import { logger } from "./logger";

type CamelCase<S extends string> = S extends `${infer Head}_${infer Tail}`
  ? `${Head}${Capitalize<CamelCase<Tail>>}`
  : S;

type CamelCasedProperties<T> = {
  [K in keyof T as K extends string ? CamelCase<K> : K]: T[K];
};

type QueryResult<T> = {
  rows: CamelCasedProperties<T>[];
  rowCount: number;
};

type PgError = Error & {
  code?: string;
  detail?: string;
  constraint?: string;
  table?: string;
};
export async function safeQuery<T extends Record<string, unknown>>(
  query: string,
  params: unknown[] = []
): Promise<QueryResult<T> | null> {
  try {
    const result = await db.query<T>(query, params);
    const camelRows = camelcaseKeys(result.rows, {
      deep: true,
    }) as CamelCasedProperties<T>[];

    return { rows: camelRows, rowCount: result.rowCount ?? 0 };
  } catch (err) {
    const pgErr = err as PgError;

    logger.error("💥 Database error:", {
      message: pgErr.message,
      code: pgErr.code,
      detail: pgErr.detail,
      constraint: pgErr.constraint,
      table: pgErr.table,
    });

    throw pgErr;
  }
}
