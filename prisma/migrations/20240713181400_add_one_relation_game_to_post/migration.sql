-- AlterTable
ALTER TABLE "post" ADD COLUMN     "game_id" INTEGER;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
