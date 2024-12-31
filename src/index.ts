import { PrismaClient } from ".prisma/client/default";
import { HttpFunction } from "@google-cloud/functions-framework";
import { ProductType } from "./domain/product/entities/Product";
import {
  createProduct,
  getAllProducts,
  updateProduct,
} from "./Utils/Functions/ProductDB";
import createAllDefaultProviders from "./_actions/defaults/createAllDefaultProviders";
import { createAndListCategories } from "./_actions/defaults/createAllDefaultCategories";
import { getProductsByProvider } from "./_actions/getProductsByProvider";
import { UnicomCategoriesAdapter } from "./API/Unicom/UnicomAPIRequets";
import { PCServiceCategoriesAdapter } from "./API/PC Service/PCServiceAPIRequest";
import {
  CategoriesProvider,
  RelevantCategoriesType,
} from "./domain/categories/defaultCategories";
import { SolutionboxCategoriesAdapter } from "./API/Solutionbox/SolutionboxAPIRequest";
import { CDRCategoriesAdapter } from "./API/CDR/CDRAPIRequest";
import { IntcomexCategoriesAdapter } from "./API/Intcomex/IntcomexAPIRequest";

require("dotenv").config();

const PASSWORD_FUNCTION = process.env.PASSWORD_FUNCTION;
const prisma = new PrismaClient();

const main = async (providerName: string) => {
  try {
    let products: ProductType[] = [];

    let provider = await prisma.provider.findFirst({
      where: { name: providerName },
    });

    if (!provider) {
      try {
        await createAllDefaultProviders();

        provider = await prisma.provider.findFirst({
          where: { name: providerName },
        });
      } catch (error) {
        console.error("Error creating default providers", error);
      }
      if (!provider) {
        console.error("Provider not found");
        return { error: "Provider not found" };
      }
    }
    console.log("Provider found", provider.name);

    const allProductsDB = await prisma.product.findMany({
      where: { providerId: provider.ID_Provider },
    });

    console.log("Products on Database: ", allProductsDB.length);

    let updatedProducts = 0;
    let skippedProducts = 0;
    let deletedProducts = 0;
    let newProducts = 0;
    let allProductsFetch: ProductType[] = [];

    let categoriesAdapter: RelevantCategoriesType[] = [];

    switch (provider.name) {
      case "Unicom":
        categoriesAdapter = UnicomCategoriesAdapter.categories;
        break;
      case "PCService":
        categoriesAdapter = PCServiceCategoriesAdapter.categories;
        break;
      case "Solutionbox":
        categoriesAdapter = SolutionboxCategoriesAdapter.categories;
        break;
      case "CDR":
        categoriesAdapter = CDRCategoriesAdapter.categories;
        break;
      case "Intcomex":
        categoriesAdapter = IntcomexCategoriesAdapter.categories;
        break;
      default:
        console.error("Provider not found in categories");
        throw new Error("Provider not found in categories");
    }

    for (const category of categoriesAdapter) {
      products = [];
      const productsByCategory = await getProductsByProvider({
        provider: provider.name,
        category,
      });

      if (productsByCategory.length === 0) {
        console.log("No products found");
        continue;
      }

      products = [...products, ...productsByCategory];
      allProductsFetch = [...allProductsFetch, ...productsByCategory];

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
            // console.log("Product updated", product.id);
            await updateProduct(productOnDB, product, provider);
            updatedProducts++;
            products = products.filter((p) => p.sku !== product.sku);
          } else {
            // console.log("Product skipped", product.sku);
            skippedProducts++;
            products = products.filter((p) => p.sku !== product.sku);
          }
        }
      }

      console.log("Remaining products to create", products.length);

      for (const product of products) {
        // Eliminar duplicados
        let deleteDuplicates = new Set(products);
        products = [...deleteDuplicates];
        await createProduct(product, category, provider);
        newProducts++;
      }
    }

    for (const productOnDB of allProductsDB) {
      const product = allProductsFetch.find((p) => p.sku === productOnDB.sku);

      if (!product) {
        console.log("Product deleted", productOnDB.sku);
        await prisma.product.delete({ where: { id: productOnDB.id } });
        deletedProducts++;
      }
    }
    return {
      updatedProducts,
      skippedProducts,
      deletedProducts,
      newProducts,
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
