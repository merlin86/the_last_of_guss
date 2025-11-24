-- CreateTable
CREATE TABLE "rounds" (
    "id" SERIAL NOT NULL,
    "round_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rounds_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rounds_round_id_key" ON "rounds"("round_id");
