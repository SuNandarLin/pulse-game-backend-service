/*
  Warnings:

  - You are about to drop the column `image_url` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `post_text` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `vote` on the `post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "post" DROP COLUMN "image_url",
DROP COLUMN "post_text",
DROP COLUMN "vote",
ADD COLUMN     "downvote_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "downvoted_userids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN     "post_desc" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "post_title" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "upvote_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "upvoted_userids" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
