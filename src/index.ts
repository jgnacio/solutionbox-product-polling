import { HttpFunction } from "@google-cloud/functions-framework";
import { ProductType } from "./domain/product/entities/Product";
import { createProduct, getAllProducts } from "./Utils/Functions/ProductDB";
import { createAndListCategories } from "./_actions/defaults/createAllDefaultCategories";
import createAllDefaultProviders from "./_actions/defaults/createAllDefaultProviders";
import { PrismaClient } from ".prisma/client/default";

require("dotenv").config();

const PASSWORD_FUNCTION = process.env.PASSWORD_FUNCTION;
const prisma = new PrismaClient();

const main = async () => {
  // // 1. Obtener todos los productos
  let products: ProductType[] = [];

  // const product: ProductType = {
  //   id: "4efa192a-0fc8-4390-9b52-f5b0c620a73b",
  //   title: "ACC.KODAK CAMA PLANA LEGAL S20X0",
  //   price: 300,
  //   partNumber: [{ partNumber: "1015791", ean: 1234567890123, units_x_box: 1 }],
  //   sku: "1015791",
  //   description:
  //     "<br>Cuando necesite escanear documentos encuadernados, originales delicados o documentos voluminosos, necesitará un accesori",
  //   images: [],
  //   category: { name: "N/A", id: "N/A" },
  //   marca: "KODAK SCANNERS",
  //   stock: 2,
  //   availability: "out_of_stock",
  //   submitDate: new Date(),
  //   favorite: undefined,
  //   onSale: undefined,
  //   guaranteeDays: undefined,
  //   estimatedArrivalDate: undefined,
  // };
  // const provider = await prisma.provider.findFirst({
  //   where: {
  //     name: "Solutionbox",
  //   },
  // });

  // if (!provider) {
  //   throw new Error("Provider not found");
  // }
  // console.log(await createProduct(product, provider));
  products = await getAllProducts();

  if (products.length === 0) {
    throw new Error("No products found");
  }

  console.log("Products", products.length);
  for (const product of products) {
    const provider = await prisma.provider.findFirst({
      where: {
        name: "Solutionbox",
      },
    });

    if (!provider) {
      throw new Error("Provider not found");
    }
    await createProduct(product, provider);
  }
};

export const hello: HttpFunction = async (req, res) => {
  // Configura que sea Post y que tenga que enviar una contraseña para poder ejecutar la función
  if (req.method !== "POST") {
    res.status(401).send("Unauthorized");
    return;
  }

  if (req.body.password === PASSWORD_FUNCTION) {
    // Ejectuar la función principal y manejo de errores
    try {
      await main();
      res.send("Hello, World!");
    } catch (error) {
      console.error("Error", error);
      res.status(500).send("Error");
    }
  }
  res.status(401).send("Unauthorized");
  return;
};
