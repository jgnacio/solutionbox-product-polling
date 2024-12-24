import { UnicomAPITokenAdapter } from "../API/Unicom/adapters/UnicomAPITokenAdapter";
import { PCServiceAPIProductAdapter } from "../API/PC Service/adapters/PCServiceAPIProductAdapter";
import { SolutionboxAPIProductAdapter } from "../API/Solutionbox/adapters/SolutionboxAPIProductAdapter";
import { UnicomAPIProductAdapter } from "../API/Unicom/adapters/UnicomAPIProductAdapter";
import { Product, ProductType } from "../domain/product/entities/Product";
import { ProductClassToObj } from "../Utils/Functions/ClassToObject";
import { defaultUnicomAPIRelevantCategories } from "../API/Unicom/UnicomAPIRequets";
import { RelevantCategoriesType } from "../domain/categories/defaultCategories";
import { CDRMediosAPIProductAdapter } from "../API/CDR/adapters/CDRMediosAPIProductAdapter";
import { IntcomexAPIProductAdapter } from "../API/Intcomex/adapters/IntcomexAPIProductAdapter";

export const getProductsByProvider = async ({
  provider,
  category,
}: {
  provider: string;
  category: RelevantCategoriesType;
}): Promise<ProductType[]> => {
  let productsUnicom: Product[] = [];
  let productsPCService: Product[] = [];
  let productsSolutionbox: Product[] = [];
  let productsCDR: Product[] = [];
  let productsIntcomex: Product[] = [];

  console.log("Provider: ", provider);

  switch (provider) {
    case "Solutionbox":
      try {
        const solutionboxAPIAdapter = new SolutionboxAPIProductAdapter();

        const products = await solutionboxAPIAdapter.getByCategory(category);

        productsSolutionbox = [...productsSolutionbox, ...products];
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

        const products = await unicomAPIAdapter.getByCategory(category);
        productsUnicom = [...productsUnicom, ...products];
      } catch (error) {
        console.error(
          `Error getting products <getByCategory> on category ${category.name} from Unicom API`,
          error
        );
      }
      break;
    case "PCService":
      try {
        const pcServiceAPIAdapter = new PCServiceAPIProductAdapter();
        const products = await pcServiceAPIAdapter.getByCategory(category);
        productsPCService = [...productsPCService, ...products];
      } catch (error) {
        console.error(
          `Error getting products <getByCategory> on category ${category.name} from PC Service API`,
          error
        );
      }
      break;
    case "CDR":
      try {
        const cdrAPIAdapter = new CDRMediosAPIProductAdapter();
        const products = await cdrAPIAdapter.getByCategory(category);
        productsCDR = [...productsCDR, ...products];
      } catch (error) {
        console.error(
          `Error getting products <getByCategory> on category ${category.name} from CDR API`,
          error
        );
      }
      break;
    case "Intcomex":
      try {
        const intcomexAPIAdapter = new IntcomexAPIProductAdapter();
        const products = await intcomexAPIAdapter.getByCategory(category);
        productsIntcomex = [...productsIntcomex, ...products];
      } catch (error) {
        console.error(
          `Error getting products <getByCategory> on category ${category.name} from Intcomex API`,
          error
        );
      }
      break;
    default:
      console.error("Provider not found Get Products By Provider");
      return [];
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

  const productCDRObj = productsCDR.map((product) =>
    ProductClassToObj(product)
  );
  const productIntcomexObj = productsIntcomex.map((product) =>
    ProductClassToObj(product)
  );

  const productList = [
    ...productUnicomObj,
    ...productPCServiceObj,
    ...productSolutionboxObj,
    ...productCDRObj,
    ...productIntcomexObj,
  ];

  return productList;
};
