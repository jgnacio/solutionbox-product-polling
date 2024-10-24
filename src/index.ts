import { HttpFunction } from "@google-cloud/functions-framework";
import { ProductType } from "./domain/product/entities/Product";
import {
  createProduct,
  getAllProducts,
  updateProduct,
} from "./Utils/Functions/ProductDB";
import { createAndListCategories } from "./_actions/defaults/createAllDefaultCategories";
import createAllDefaultProviders from "./_actions/defaults/createAllDefaultProviders";
import { PrismaClient } from ".prisma/client/default";

require("dotenv").config();

const PASSWORD_FUNCTION = process.env.PASSWORD_FUNCTION;
const prisma = new PrismaClient();

const main = async (providerName: string) => {
  try {
    let products: ProductType[] = [];

    if (providerName !== "solutionbox") {
      console.error("Invalid not supported provider", providerName);
      return { error: "Invalid not supported provider" };
    }

    const provider = await prisma.provider.findFirst({
      where: { name: providerName },
    });

    if (!provider) {
      console.error("Provider not found");
      return { error: "Provider not found" };
    }

    const allProductsDB = await prisma.product.findMany();

    if (allProductsDB.length === 0) {
      await createAllDefaultProviders();
      await createAndListCategories();
    }

    products = await getAllProducts();

    if (products.length === 0) {
      console.log("No products found");
      return {
        status: "failure",
        error: "No products found",
      };
    }

    let updatedProducts = 0;
    let skippedProducts = 0;
    let deletedProducts = 0;

    for (const productOnDB of allProductsDB) {
      const product = products.find((p) => p.sku === productOnDB.sku);

      if (product) {
        const partNumber = product.partNumber
          ? product.partNumber[0].partNumber
          : "";
        if (
          productOnDB.title !== product.title ||
          productOnDB.price !== product.price ||
          productOnDB.stock !== product.stock ||
          productOnDB.partNumber !== partNumber
        ) {
          console.log("Product updated", product.id);
          await updateProduct(productOnDB, product, provider);
          updatedProducts++;
          products = products.filter((p) => p.sku !== product.sku);
        } else {
          console.log("Product skipped", product.sku);
          skippedProducts++;
          products = products.filter((p) => p.sku !== product.sku);
        }
      } else {
        console.log("Product not found. Delete: ", productOnDB.sku);
        await prisma.product.delete({
          where: { id: productOnDB.id },
        });
        deletedProducts++;
      }
    }

    console.log("Remaining products to create", products.length);

    for (const product of products) {
      await createProduct(product, provider);
    }

    return {
      updatedProducts,
      skippedProducts,
      deletedProducts,
      newProducts: products.length,
    };
  } catch (error) {
    console.error("Error in main function", error);
    throw error; // Propagamos el error para que sea capturado en la función `hello`
  }
};

export const UpdateProducts: HttpFunction = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(401).json({ error: "Unauthorized request method" });
  }

  if (req.body.password !== PASSWORD_FUNCTION) {
    return res.status(401).json({ error: "Invalid password" });
  }

  if (!req.body.provider) {
    return res.status(401).json({ error: "Invalid provider" });
  }

  try {
    const result = await main(req.body.provider);

    if (result.error) {
      return res.status(500).json({
        status: "failure",
        message: result.error,
      });
    }

    return res.json({
      status: "success",
      message: "Productos actualizados correctamente",
      details: result,
    });
  } catch (error) {
    console.error("Error in hello function", error);

    // Respuesta con detalles del error
    return res.status(500).json({
      status: "failure",
      message: "Error al actualizar productos",
      error: error || "Error desconocido",
    });
  }
};
