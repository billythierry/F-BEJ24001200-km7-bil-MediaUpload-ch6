/*
  Warnings:

  - Added the required column `fileId` to the `image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "image" ADD COLUMN     "fileId" TEXT NOT NULL;
