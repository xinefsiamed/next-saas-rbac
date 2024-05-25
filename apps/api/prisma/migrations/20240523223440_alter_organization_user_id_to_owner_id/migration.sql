/*
  Warnings:

  - You are about to drop the column `user_id` on the `orgazizations` table. All the data in the column will be lost.
  - Added the required column `owner_id` to the `orgazizations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "orgazizations" DROP CONSTRAINT "orgazizations_user_id_fkey";

-- AlterTable
ALTER TABLE "orgazizations" DROP COLUMN "user_id",
ADD COLUMN     "owner_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "orgazizations" ADD CONSTRAINT "orgazizations_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
