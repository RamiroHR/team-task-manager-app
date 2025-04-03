-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "title" SET DEFAULT 'New Task';
