# Migration `20201011161916-v2`

This migration has been generated by Harsh Rumalwala at 10/11/2020, 9:49:16 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "Room" ADD COLUMN     "roundStartedAt" DATETIME
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201003080246-v1..20201011161916-v2
--- datamodel.dml
+++ datamodel.dml
@@ -1,7 +1,7 @@
 datasource db {
   provider = "sqlite"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider        = "prisma-client-js"
@@ -62,8 +62,9 @@
   players        User[]    @relation("PlayerMapping")
   host           User?     @relation("HostMapping")
   round          Int
   roundLimit     Int
+  roundStartedAt DateTime?
   roundCompleted User[]
   roundMovieId   Int?
   language       Language? @relation(fields: [languageId], references: [id])
   languageId     Int?
```


