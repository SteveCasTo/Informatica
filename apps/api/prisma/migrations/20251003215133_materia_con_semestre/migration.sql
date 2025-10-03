/*
  Warnings:

  - A unique constraint covering the columns `[subject_name]` on the table `subjects` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "uq_subjects_subject_name" ON "subjects"("subject_name");
