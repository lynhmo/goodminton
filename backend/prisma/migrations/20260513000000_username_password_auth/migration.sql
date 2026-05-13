ALTER TABLE "members" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

ALTER TABLE "members" ADD COLUMN IF NOT EXISTS "username" TEXT;
ALTER TABLE "members" ADD COLUMN IF NOT EXISTS "password_hash" TEXT;

UPDATE "members"
SET "username" = lower(regexp_replace(coalesce(split_part("email", '@', 1), 'user_' || substr("id"::text, 1, 8)), '[^a-zA-Z0-9_]', '', 'g'))
WHERE "username" IS NULL;

UPDATE "members" m
SET "username" = m."username" || '_' || substr(m."id"::text, 1, 8)
WHERE EXISTS (
  SELECT 1
  FROM "members" x
  WHERE x."username" = m."username"
    AND x."id" <> m."id"
    AND x."id"::text < m."id"::text
);

ALTER TABLE "members" ALTER COLUMN "username" SET NOT NULL;
ALTER TABLE "members" ALTER COLUMN "email" DROP NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "members_username_key" ON "members"("username");
