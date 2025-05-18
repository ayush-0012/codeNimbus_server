/*
  Warnings:

  - The values [nodejs,reactjs,nextjs] on the enum `projectStack` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `userId` on table `File` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "projectStack_new" AS ENUM ('nodeJs', 'reactJs', 'nextJs');
ALTER TABLE "Project" ALTER COLUMN "projectStack" TYPE "projectStack_new" USING ("projectStack"::text::"projectStack_new");
ALTER TYPE "projectStack" RENAME TO "projectStack_old";
ALTER TYPE "projectStack_new" RENAME TO "projectStack";
DROP TYPE "projectStack_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_userId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_userId_fkey";

-- AlterTable
ALTER TABLE "File" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
