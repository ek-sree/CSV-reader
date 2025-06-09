-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CsvFile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "columnHeaders" TEXT[],
    "rowCount" INTEGER NOT NULL,
    "batchType" TEXT,
    "fieldMappings" JSONB,

    CONSTRAINT "CsvFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CsvRow" (
    "id" TEXT NOT NULL,
    "csvFileId" TEXT NOT NULL,
    "rowData" JSONB NOT NULL,
    "rowIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CsvRow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "CsvFile_userId_idx" ON "CsvFile"("userId");

-- CreateIndex
CREATE INDEX "CsvRow_csvFileId_idx" ON "CsvRow"("csvFileId");

-- CreateIndex
CREATE INDEX "CsvRow_csvFileId_rowIndex_idx" ON "CsvRow"("csvFileId", "rowIndex");

-- AddForeignKey
ALTER TABLE "CsvFile" ADD CONSTRAINT "CsvFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CsvRow" ADD CONSTRAINT "CsvRow_csvFileId_fkey" FOREIGN KEY ("csvFileId") REFERENCES "CsvFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
