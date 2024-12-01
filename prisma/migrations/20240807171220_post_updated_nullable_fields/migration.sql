-- AlterTable
ALTER TABLE "post" ALTER COLUMN "downvote_count" DROP NOT NULL,
ALTER COLUMN "upvote_count" DROP NOT NULL;
