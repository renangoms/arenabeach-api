-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" STRING NOT NULL,
    "phone" STRING NOT NULL,
    "email" STRING NOT NULL,
    "password" STRING NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
