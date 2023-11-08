/*
  Warnings:

  - Added the required column `salt` to the `auth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `auth` ADD COLUMN `salt` VARCHAR(191) NOT NULL;
