-- DropIndex
DROP INDEX "user_auth_id_key";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "auth_id" DROP NOT NULL;
