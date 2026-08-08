-- Create a partial unique index for pending transactions
-- ensuring only one pending transaction exists per listing/user pair.
CREATE UNIQUE INDEX IF NOT EXISTS "Transaction_pending_listing_user_unique"
ON "Transaction" ("listingId", "userId")
WHERE status = 'pending';
