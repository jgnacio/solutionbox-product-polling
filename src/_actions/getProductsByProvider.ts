"use server";
import { PCServiceAPIProductAdapter } from "../API/PC Service/adapters/PCServiceAPIProductAdapter";
import { SolutionboxAPIProductAdapter } from "../API/Solutionbox/adapters/SolutionboxAPIProductAdapter";
import { UnicomAPIProductAdapter } from "../API/Unicom/adapters/UnicomAPIProductAdapter";
import { Product, ProductType } from "../domain/product/entities/Product";
import { ProductClassToObj } from "../Utils/Functions/ClassToObject";

export const getProductsByProvider = async ({
  provider,
}: {
  provider: string;
}): Promise<ProductType[]> => {
  let productsUnicom: Product[] = [];
  let productsPCService: Product[] = [];
  let productsSolutionbox: Product[] = [];

  switch (provider) {
    case "Solutionbox":
      try {
        const solutionboxAPIAdapter = new SolutionboxAPIProductAdapter();

        productsSolutionbox = await solutionboxAPIAdapter.getAll();
      } catch (error) {
        console.error(
          "Error getting featured products from Solutionbox API",
          error
        );
      }
      break;

    case "Unicom":
      try {
        const unicomAPIAdapter = new UnicomAPIProductAdapter();

        productsUnicom = await unicomAPIAdapter.getAll({ page: 1 });
      } catch (error) {
        console.error("Error getting featured products from Unicom API", error);
      }
      break;
    case "PC Service":
      try {
        const pcServiceAPIAdapter = new PCServiceAPIProductAdapter();

        productsPCService = await pcServiceAPIAdapter.getFeatured();
      } catch (error) {
        console.error(
          "Error getting products <getAll> from PC Service API",
          error
        );
      }
      break;
    default:
      console.error("Provider not found");
      break;
  }

  const productUnicomObj = productsUnicom.map((product) =>
    ProductClassToObj(product)
  );

  const productPCServiceObj = productsPCService.map((product) =>
    ProductClassToObj(product)
  );

  const productSolutionboxObj = productsSolutionbox.map((product) =>
    ProductClassToObj(product)
  );

  const productList = [
    ...productUnicomObj,
    ...productPCServiceObj,
    ...productSolutionboxObj,
  ];

  return productList;
};
