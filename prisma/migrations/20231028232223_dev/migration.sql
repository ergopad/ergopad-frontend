-- CreateTable
CREATE TABLE "unsupported_wallets" (
    "id" SERIAL NOT NULL,
    "type" TEXT,
    "changeAddress" TEXT NOT NULL,
    "unusedAddresses" TEXT[],
    "usedAddresses" TEXT[],
    "user_id" TEXT NOT NULL,

    CONSTRAINT "unsupported_wallets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unsupported_wallets_changeAddress_key" ON "unsupported_wallets"("changeAddress");

-- AddForeignKey
ALTER TABLE "unsupported_wallets" ADD CONSTRAINT "unsupported_wallets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
