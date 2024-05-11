/*
  Warnings:

  - The primary key for the `contribution_rounds` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_contribution_id_fkey";

-- AlterTable
ALTER TABLE "contribution_rounds" DROP CONSTRAINT "contribution_rounds_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "contribution_rounds_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "contribution_rounds_id_seq";

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "contribution_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_contribution_id_fkey" FOREIGN KEY ("contribution_id") REFERENCES "contribution_rounds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
