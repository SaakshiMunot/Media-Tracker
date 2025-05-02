/*
  Warnings:

  - You are about to drop the column `genre` on the `movie` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `movie` DROP COLUMN `genre`,
    ADD COLUMN `genres` JSON NULL;
