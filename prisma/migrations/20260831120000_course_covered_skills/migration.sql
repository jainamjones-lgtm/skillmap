-- CreateTable: many-to-many between Course and Skill for secondary coverage
CREATE TABLE "_CourseCoveredSkills" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CourseCoveredSkills_A_fkey" FOREIGN KEY ("A") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CourseCoveredSkills_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_CourseCoveredSkills_AB_unique" ON "_CourseCoveredSkills"("A", "B");
CREATE INDEX "_CourseCoveredSkills_B_index" ON "_CourseCoveredSkills"("B");
