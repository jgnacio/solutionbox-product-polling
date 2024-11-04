import { UnicomAPITokenAdapter } from "../API/Unicom/adapters/UnicomAPITokenAdapter";
import { PCServiceAPIProductAdapter } from "../API/PC Service/adapters/PCServiceAPIProductAdapter";
import { SolutionboxAPIProductAdapter } from "../API/Solutionbox/adapters/SolutionboxAPIProductAdapter";
import { UnicomAPIProductAdapter } from "../API/Unicom/adapters/UnicomAPIProductAdapter";
import { Product, ProductType } from "../domain/product/entities/Product";
import { ProductClassToObj } from "../Utils/Functions/ClassToObject";
import { defaultUnicomAPIRelevantCategories } from "../API/Unicom/UnicomAPIRequets";
import { RelevantCategoriesType } from "../domain/categories/defaultCategories";

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

        // const categories = defaultUnicomAPIRelevantCategories.map(
        //   (category) => category.code
        // );

        // for (const category of categories) {
        //   const products = await unicomAPIAdapter.getAll({
        //     request: {
        //       solo_articulos_destacados: false,
        //       codigo_grupo: category,
        //       tipo_informe: "completo",
        //       solo_favoritos: false,
        //       rango_articulos_informe: {
        //         desde_articulo_nro: 0,
        //         hasta_articulo_nro: 200,
        //       },
        //     },
        //   });

        //   productsUnicom = [...productsUnicom, ...products];
        // }

        const products = await unicomAPIAdapter.getByCategory(category);
        productsUnicom = [...productsUnicom, ...products];
      } catch (error) {
        console.error("Error getting featured products from Unicom API", error);
      }
      break;
    case "PCService":
      try {
        const pcServiceAPIAdapter = new PCServiceAPIProductAdapter();
        productsPCService = await pcServiceAPIAdapter.getAll();
      } catch (error) {
        console.error(
          "Error getting products <getFeatured> from PC Service API",
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
