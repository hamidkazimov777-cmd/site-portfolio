-- AlterTable
ALTER TABLE "experience" ADD COLUMN     "translations" JSONB;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "translations" JSONB;

-- AlterTable
ALTER TABLE "site_settings" ADD COLUMN     "translations" JSONB;
