/*
  Warnings:

  - A unique constraint covering the columns `[name,nameES,code]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Category_name_nameES_code_key` ON `Category`(`name`, `nameES`, `code`);
