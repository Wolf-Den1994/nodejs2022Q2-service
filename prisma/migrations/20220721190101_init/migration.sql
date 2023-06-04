-- AlterTable
ALTER TABLE "favorites" ALTER COLUMN "id" SET DEFAULT 0,
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "favorites_id_seq";
