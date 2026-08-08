-- Add stripe idempotency key support, remove the old pending uniqueness constraint,
-- and preserve the pending transaction uniqueness index.
DO $$
DECLARE
  old_constraint_name text;
  old_index_name text;
BEGIN
  SELECT conname
  INTO old_constraint_name
  FROM pg_constraint
  WHERE conrelid = '"Transaction"'::regclass
    AND contype = 'u'
    AND conkey = (
      SELECT array_agg(attnum ORDER BY attnum)
      FROM pg_attribute
      WHERE attrelid = '"Transaction"'::regclass
        AND attname IN ('listingId', 'userId', 'status')
    )
  LIMIT 1;

  IF old_constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE "Transaction" DROP CONSTRAINT %I', old_constraint_name);
  END IF;

  SELECT ci.relname
  INTO old_index_name
  FROM pg_index i
  JOIN pg_class ci ON ci.oid = i.indexrelid
  WHERE i.indrelid = '"Transaction"'::regclass
    AND i.indisunique
    AND NOT i.indisprimary
    AND pg_get_indexdef(i.indexrelid) LIKE '%("listingId", "userId", "status")%'
    AND pg_get_indexdef(i.indexrelid) NOT LIKE '%WHERE%'
  LIMIT 1;

  IF old_index_name IS NOT NULL THEN
    EXECUTE format('DROP INDEX IF EXISTS %I', old_index_name);
  END IF;
END$$;

ALTER TABLE "Transaction"
  ADD COLUMN IF NOT EXISTS "stripeIdempotencyKey" text;

CREATE UNIQUE INDEX IF NOT EXISTS "Transaction_stripeIdempotencyKey_key"
  ON "Transaction" ("stripeIdempotencyKey");

CREATE UNIQUE INDEX IF NOT EXISTS "Transaction_pending_listing_user_unique"
  ON "Transaction" ("listingId", "userId")
  WHERE status = 'pending';
