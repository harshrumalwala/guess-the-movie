# Migration `20200924053530-v3`

This migration has been generated by Harsh Rumalwala at 9/24/2020, 11:05:30 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "Movie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "directorId" INTEGER NOT NULL,
    "genre" TEXT NOT NULL,
    "releaseDate" DATETIME NOT NULL,

    FOREIGN KEY ("directorId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE
)

CREATE TABLE "Person" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
)

CREATE TABLE "_CastMapping" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    FOREIGN KEY ("A") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE
)

CREATE UNIQUE INDEX "_CastMapping_AB_unique" ON "_CastMapping"("A", "B")

CREATE INDEX "_CastMapping_B_index" ON "_CastMapping"("B")
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200920102702-v2..20200924053530-v3
--- datamodel.dml
+++ datamodel.dml
@@ -1,19 +1,27 @@
 datasource db {
   provider = "sqlite"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
+  experimentalFeatures = ["connectOrCreate"]
 }
 model Movie {
-  id          Int      @id @default(autoincrement())
-  createdAt   DateTime @default(now())
+  id          Int       @id @default(autoincrement())
+  createdAt   DateTime  @default(now())
   name        String
-  director    String
-  actors      String
-  actresses   String
+  directorId  Int
+  director    Person    @relation("DirectorMapping", fields: [directorId], references: [id])
+  cast        Person[]  @relation("CastMapping", references: [id])
   genre       String
-  releaseDate DateTime
+  releaseDate DateTime  
 }
+
+model Person {
+  id        Int     @id @default(autoincrement())
+  name      String    
+  acted     Movie[] @relation("CastMapping")
+  directed  Movie[] @relation("DirectorMapping")
+}
```

