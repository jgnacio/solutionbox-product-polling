import { ProductType } from "../domain/product/entities/Product";
import { SolutionboxAPIProductAdapter } from "@/API/Solutionbox/adapters/SolutionboxAPIProductAdapter";

export const getProductBySku = async (
  sku: string
): Promise<ProductType | null> => {
  const solutionboxAPIProductAdapter = new SolutionboxAPIProductAdapter();
  const product = await solutionboxAPIProductAdapter.getBySKU(sku);
  if (!product) {
    return null;
  }
  return product.toPlainObject();
};
