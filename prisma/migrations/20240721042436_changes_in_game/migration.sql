/*
  Warnings:

  - You are about to drop the column `rating` on the `game` table. All the data in the column will be lost.
  - You are about to drop the column `rawg_id` on the `game` table. All the data in the column will be lost.
  - Added the required column `pulse_rating` to the `game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "game" DROP COLUMN "rating",
DROP COLUMN "rawg_id",
ADD COLUMN     "pulse_rating" INTEGER NOT NULL;
