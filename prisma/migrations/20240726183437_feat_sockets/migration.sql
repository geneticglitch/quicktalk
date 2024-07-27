-- CreateTable
CREATE TABLE "SocketConnection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "socketId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocketConnection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SocketConnection_socketId_key" ON "SocketConnection"("socketId");

-- AddForeignKey
ALTER TABLE "SocketConnection" ADD CONSTRAINT "SocketConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
