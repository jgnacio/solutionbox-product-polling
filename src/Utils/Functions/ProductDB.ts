import { PrismaClient, Prisma } from "@prisma/client";
import { getProductsByPage } from "../../_actions/getProductsByPage";
import { ProductType } from "../../domain/product/entities/Product";
import { createAndListCategories } from "../../_actions/defaults/createAllDefaultCategories";

const prisma = new PrismaClient();

export const createProduct = async (product: ProductType, provider?: any) => {
  const partNumber = product.partNumber
    ? product.partNumber[0].partNumber
    : "Part Number not available";

  if (!provider) {
    console.log("Provider not found");
    return;
  }

  if (
    !product.title ||
    !product.price ||
    (!product.category.id && !product.category)
  ) {
    console.log("Product data is not complete", product);
    return;
  }

  // Buscar un producto con el mismo Titulo y SKU para no duplicar

  const productExists = await prisma.product.findFirst({
    where: {
      AND: [
        { title: product.title },
        { sku: product.sku },
        { providerId: provider.ID_Provider },
        { partNumber: partNumber },
      ],
    },
  });

  if (productExists) {
    console.log("Product already exists");
    // Update Product
    const productUpdated = updateProduct(productExists, product, provider);
    console.log("Product updated", productUpdated);
    return productUpdated;
  } else {
    let newProduct;
    let categoryFound = await prisma.category.findFirst({
      where: {
        code: product.category.id,
      },
    });
    if (!categoryFound) {
      console.log("Category not found");
      try {
        await prisma.category.create({
          data: {
            name: product.category.name,
            nameES: product.category.name,
            code: product.category.id,
          },
        });
      } catch (error) {
        console.error("Error creating default categories", error);
      }

      categoryFound = await prisma.category.findFirst({
        where: {
          code: product.category.id,
        },
      });

      if (!categoryFound) return;
    }
    try {
      newProduct = await prisma.product.create({
        data: {
          title: product.title,
          price: product.price,
          categoryId: categoryFound?.id,
          providerId: provider.ID_Provider,
          availability: product.availability,
          description: product.description,
          marca: product.marca,
          partNumber: partNumber,
          sku: product.sku,
          stock: product.stock,
          createdAt: new Date(),
          estimatedArrivalDate: product.estimatedArrivalDate,
          updatedAt: new Date(),
          guaranteeDays: product.guaranteeDays,
          favorite: product.favorite,
          onSale: product.onSale,
        },
      });
      console.log("Product created", newProduct);
    } catch (error) {
      console.log("Error creating product", product, error);
    }
    return newProduct;
  }
};

export const updateProduct = async (
  productDatabase: any,
  productUpdated: ProductType,
  provider?: any
) => {
  const partNumber = productUpdated.partNumber
    ? productUpdated.partNumber[0].partNumber
    : productDatabase.partNumber;

  if (productDatabase.price !== productUpdated.price) {
    await prisma.priceHistory.create({
      data: {
        productId: productDatabase.id,
        price: productUpdated.price,
        priceUpdatedAt: new Date(),
        previousPrice: productDatabase.price,
      },
    });
  }

  const updatedProduct = await prisma.product.update({
    where: {
      id: productDatabase.id,
    },
    data: {
      title: productUpdated.title,
      price: productUpdated.price,
      categoryId: productDatabase.categoryId,
      providerId: provider.ID_Provider,
      availability: productUpdated.stock > 0 ? "in_stock" : "out_of_stock",
      description: productUpdated.description,
      marca: productUpdated.marca,
      partNumber: partNumber,
      sku: productUpdated.sku,
      stock: productUpdated.stock,
      createdAt: productDatabase.createdAt,
      estimatedArrivalDate: productUpdated.estimatedArrivalDate,
      updatedAt: new Date(),
      guaranteeDays: productUpdated.guaranteeDays,
      favorite: productUpdated.favorite,
      onSale: productUpdated.onSale,
    },
  });

  return updatedProduct;
};

export const filterProducts = async (
  categoryCode: string,
  providerId: number
) => {
  let category = await prisma.category.findFirst({
    where: {
      code: categoryCode,
    },
  });

  if (!category) {
    console.log("Category not found");
    try {
      await createAndListCategories();
    } catch (error) {
      console.error("Error creating default categories", error);
    }

    category = await prisma.category.findFirst({
      where: {
        code: categoryCode,
      },
    });

    if (!category) return [];
  }

  return await prisma.product.findMany({
    where: {
      AND: [{ categoryId: category?.id }, { providerId: providerId }],
    },
    include: {
      category: true,
      provider: true,
    },
  });
};

export const sortedProducts = async (
  sortBy: "price" | "title",
  order: "asc" | "desc"
) => {
  return await prisma.product.findMany({
    orderBy: {
      [sortBy]: order,
    },
    include: {
      category: true,
      provider: true,
    },
  });
};

export const getAllProducts = async (): Promise<ProductType[]> => {
  const products = await getProductsByPage({ page: 1 });
  return products;
};
