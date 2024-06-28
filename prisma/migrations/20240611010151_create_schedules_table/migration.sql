-- CreateTable
CREATE TABLE "schedules" (
    "id" UUID NOT NULL,
    "day_of_week" STRING NOT NULL,
    "start_time" INT4 NOT NULL,
    "end_time" INT4 NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);
