import { Product, ProductType } from "../entities/Product";

export interface IProductRepository {
  getBySKU(sku: string): Promise<Product | null>;
  getAll({
    request,
    page,
    category,
  }: {
    request?: any;
    page?: number;
    category?: string;
  }): Promise<Product[]>;
  getByCategory(category: string): Promise<Product[]>;
  getFeatured(request?: any): Promise<Product[]>;
  getOffers(request?: any): Promise<Product[]>;
}
