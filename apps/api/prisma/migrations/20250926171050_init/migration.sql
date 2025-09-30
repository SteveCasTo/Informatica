-- CreateTable
CREATE TABLE "users" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "google_id" TEXT,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "user_role" TEXT NOT NULL,
    "profile_picture" TEXT,
    "status" TEXT NOT NULL,
    "registration_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "reports" (
    "report_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "publication_id" INTEGER,
    "reporter_user_id" INTEGER NOT NULL,
    "report_type" TEXT NOT NULL,
    "description" TEXT,
    "report_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewer_admin_id" INTEGER,
    "admin_comment" TEXT,
    "review_date" DATETIME,
    CONSTRAINT "reports_reporter_user_id_fkey" FOREIGN KEY ("reporter_user_id") REFERENCES "users" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "reports_reviewer_admin_id_fkey" FOREIGN KEY ("reviewer_admin_id") REFERENCES "users" ("user_id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "reports_publication_id_fkey" FOREIGN KEY ("publication_id") REFERENCES "publications" ("publication_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "publications" (
    "publication_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "update_date" DATETIME,
    "publication_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "views" INTEGER NOT NULL DEFAULT 0,
    "total_ratings" INTEGER NOT NULL DEFAULT 0,
    "total_comments" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "publications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "publications_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects" ("subject_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "comments" (
    "comment_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "publication_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "comment_data" TEXT NOT NULL,
    "comment_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_date" DATETIME,
    "edited" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comments_publication_id_fkey" FOREIGN KEY ("publication_id") REFERENCES "publications" ("publication_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ratings" (
    "rating_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "publication_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "rating_type" TEXT NOT NULL,
    "rating_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ratings_publication_id_fkey" FOREIGN KEY ("publication_id") REFERENCES "publications" ("publication_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "files" (
    "file_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "publication_id" INTEGER NOT NULL,
    "file_type_id" INTEGER NOT NULL,
    "file_title" TEXT NOT NULL,
    "description" TEXT,
    "web_url" TEXT,
    "filepath" TEXT,
    "size_bytes" INTEGER,
    "upload_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "files_publication_id_fkey" FOREIGN KEY ("publication_id") REFERENCES "publications" ("publication_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "files_file_type_id_fkey" FOREIGN KEY ("file_type_id") REFERENCES "file_types" ("file_type_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "file_types" (
    "file_type_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "file_name" TEXT NOT NULL,
    "description" TEXT,
    "mime_type" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "notifications" (
    "notification_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT,
    "publication_id" INTEGER,
    "subject_id" INTEGER,
    "read_state" BOOLEAN NOT NULL DEFAULT false,
    "creation_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "notifications_publication_id_fkey" FOREIGN KEY ("publication_id") REFERENCES "publications" ("publication_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "notifications_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects" ("subject_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "subjects" (
    "subject_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "subject_name" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "creation_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "subject_enrollments" (
    "enrollment_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "enrollment_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "subject_enrollments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "subject_enrollments_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects" ("subject_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_statistics" (
    "statistic_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "views_made" INTEGER NOT NULL DEFAULT 0,
    "materials_published" INTEGER NOT NULL DEFAULT 0,
    "reports_made" INTEGER NOT NULL DEFAULT 0,
    "reports_received" INTEGER NOT NULL DEFAULT 0,
    "files_downloaded" INTEGER NOT NULL DEFAULT 0,
    "comments_made" INTEGER NOT NULL DEFAULT 0,
    "ratings_given" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "update_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_statistics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "activity" (
    "activity_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "activity_type" TEXT NOT NULL,
    "user_id" INTEGER,
    "publication_id" INTEGER,
    "subject_id" INTEGER,
    "user_name" TEXT,
    "publication_title" TEXT,
    "subject_name" TEXT,
    "description" TEXT,
    "activity_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_statistics_user_id_key" ON "user_statistics"("user_id");
