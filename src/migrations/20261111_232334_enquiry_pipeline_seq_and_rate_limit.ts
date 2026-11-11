import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE SEQUENCE IF NOT EXISTS enquiry_ref_seq START 101;
    CREATE TABLE IF NOT EXISTS rate_limits (
      ip_hash VARCHAR(64) PRIMARY KEY,
      window_start TIMESTAMPTZ NOT NULL,
      count INTEGER NOT NULL DEFAULT 1
    );
    CREATE INDEX IF NOT EXISTS rate_limits_window_start_idx ON rate_limits (window_start);
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS rate_limits;
    DROP SEQUENCE IF EXISTS enquiry_ref_seq;
  `)
}
