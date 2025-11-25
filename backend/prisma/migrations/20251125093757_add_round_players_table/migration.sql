-- CreateTable
CREATE TABLE "round_players" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "round_id" INTEGER NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "round_players_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "round_players_user_id_round_id_key" ON "round_players"("user_id", "round_id");

-- AddForeignKey
ALTER TABLE "round_players" ADD CONSTRAINT "round_players_users_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "round_players" ADD CONSTRAINT "round_players_rounds_fk" FOREIGN KEY ("round_id") REFERENCES "rounds"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
