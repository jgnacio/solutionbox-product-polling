-- CreateTable
CREATE TABLE `Product` (
    `id` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `partNumber` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `marca` VARCHAR(191) NOT NULL,
    `stock` INTEGER NOT NULL,
    `availability` ENUM('in_stock', 'out_of_stock', 'pre_order', 'on_demand') NOT NULL,
    `favorite` BOOLEAN NULL,
    `onSale` BOOLEAN NULL,
    `guaranteeDays` INTEGER NULL,
    `estimatedArrivalDate` DATETIME(3) NULL,
    `providerId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Provider` (
    `ID_Provider` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `contact` VARCHAR(191) NOT NULL,
    `direction` TEXT NOT NULL,
    `searchPageUrl` VARCHAR(191) NOT NULL,
    `mainPageUrl` VARCHAR(191) NOT NULL,
    `logoUrl` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Provider_name_key`(`name`),
    PRIMARY KEY (`ID_Provider`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `nameES` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Category_name_nameES_code_key`(`name`, `nameES`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PriceHistory` (
    `id` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `previousPrice` DOUBLE NULL,
    `productId` VARCHAR(191) NOT NULL,
    `priceUpdatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `priceChangeReason` VARCHAR(191) NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'USD',

    INDEX `PriceHistory_productId_priceUpdatedAt_idx`(`productId`, `priceUpdatedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_providerId_fkey` FOREIGN KEY (`providerId`) REFERENCES `Provider`(`ID_Provider`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PriceHistory` ADD CONSTRAINT `PriceHistory_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
