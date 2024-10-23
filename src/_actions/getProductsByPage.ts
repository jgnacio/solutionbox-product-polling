import { ProductType } from "../domain/product/entities/Product";
import { SolutionboxAPIProductAdapter } from "../API/Solutionbox/adapters/SolutionboxAPIProductAdapter";

export const getProductsByPage = async ({
  page,
  category,
}: {
  page: number;
  category?: string;
}): Promise<ProductType[]> => {
  const SolutionboxAPIAdapter = new SolutionboxAPIProductAdapter();

  const products = SolutionboxAPIAdapter.getAll();
  const productList: ProductType[] = (await products).map((product) =>
    product.toPlainObject()
  );
  return productList;
};
