/*
  Warnings:

  - Added the required column `semester` to the `subjects` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_subjects" (
    "subject_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "subject_name" TEXT NOT NULL,
    "description" TEXT,
    "semester" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "creation_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_subjects" ("active", "creation_date", "description", "subject_id", "subject_name") SELECT "active", "creation_date", "description", "subject_id", "subject_name" FROM "subjects";
DROP TABLE "subjects";
ALTER TABLE "new_subjects" RENAME TO "subjects";
CREATE UNIQUE INDEX "uq_subjects_name" ON "subjects"("subject_name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
