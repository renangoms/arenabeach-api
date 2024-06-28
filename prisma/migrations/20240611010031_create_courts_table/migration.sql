-- CreateTable
CREATE TABLE "courts" (
    "id" UUID NOT NULL,
    "name" STRING NOT NULL,
    "avaiability" BOOL NOT NULL,

    CONSTRAINT "courts_pkey" PRIMARY KEY ("id")
);
