CREATE TABLE "Subscriber" (
  "id" SERIAL PRIMARY KEY,
  "email" varchar NOT NULL,
  "password" varchar NOT NULL,
  "created_at" timestamp NOT NULL
);

CREATE TABLE "Service" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar NOT NULL
);

CREATE TABLE "Subscription" (
  "id_subscriber" int NOT NULL,
  "id_service" int NOT NULL
);

ALTER TABLE "Subscription" ADD FOREIGN KEY ("id_subscriber") REFERENCES "Subscriber" ("id");

ALTER TABLE "Subscription" ADD FOREIGN KEY ("id_service") REFERENCES "Service" ("id");