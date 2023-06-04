-- CreateTable
CREATE TABLE "favorites" (
    "id" SERIAL NOT NULL,
    "artists" TEXT[],
    "albums" TEXT[],
    "tracks" TEXT[],

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);
