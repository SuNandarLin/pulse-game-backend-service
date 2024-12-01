-- CreateTable
CREATE TABLE "user_rating" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "game_id" INTEGER,
    "ratings_count" INTEGER NOT NULL,

    CONSTRAINT "user_rating_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_rating" ADD CONSTRAINT "user_rating_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_rating" ADD CONSTRAINT "user_rating_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
