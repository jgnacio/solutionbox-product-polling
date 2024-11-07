import {
  Product,
  ProductType,
  Provider,
} from "../../../domain/product/entities/Product";
import { IProductRepository } from "../../../domain/product/repositories/IProductRepository";
import axios from "axios";
import { SolutionboxAPITokenAdapter } from "./SolutionboxAPITokenAdapter";
import { SolutionboxAPIProduct } from "../entities/Products/SolutionboxAPIProduct";
import { SolutionboxCategoriesAdapter } from "../SolutionboxAPIRequest";
import { RelevantCategoriesType } from "../../../domain/categories/defaultCategories";

export const solutionBoxProvider: Provider = {
  name: "Solutionbox",
  mainPageUrl: "https://www.solutionbox.com.uy/",
  searchPageUrl: "https://www.solutionbox.com.uy/detalle?sku=",
  logoUrl:
    "https://res.cloudinary.com/dhq5ewbyu/image/upload/v1729604229/ASLAN/vkr0voqeoh47duv94jw3.png",
};

export class SolutionboxAPIProductAdapter implements IProductRepository {
  private static products: Product[];
  private static lastFetched: number | null = null;
  private readonly URL = process.env.API_SOLUTIONBOX_URL;
  private static readonly CACHE_DURATION = 1.5 * 60 * 60 * 1000; // 1.5 hours in milliseconds

  constructor() {}

  private async fetchProduct(id: number): Promise<any> {
    throw new Error("Method not implemented.");
  }

  private async fetchProducts(params: any): Promise<Product[]> {
    const token = await new SolutionboxAPITokenAdapter().getToken();
    const response = await axios
      .get(`${this.URL}/listas/articulos`, {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
        return [];
      });

    const products = this.productMapperList(response);
    return products;
  }

  async getInstance(): Promise<Product[]> {
    const now = Date.now();

    console.log(
      `Is Ready to fetch products?: ${
        !SolutionboxAPIProductAdapter.lastFetched ||
        now - SolutionboxAPIProductAdapter.lastFetched >=
          SolutionboxAPIProductAdapter.CACHE_DURATION
          ? "YYYYYYYYYY"
          : "NNNNNNNNNN"
      }`
    );

    if (
      !SolutionboxAPIProductAdapter.lastFetched ||
      now - SolutionboxAPIProductAdapter.lastFetched >=
        SolutionboxAPIProductAdapter.CACHE_DURATION
    ) {
      SolutionboxAPIProductAdapter.lastFetched = now;
      SolutionboxAPIProductAdapter.products = await this.fetchProducts({});
    }

    console.log("Products fetched from Solutionbox API");
    console.log(SolutionboxAPIProductAdapter.products.length);

    return SolutionboxAPIProductAdapter.products;
  }

  async getBySKU(sku: string): Promise<Product | null> {
    const products = await this.fetchProducts({});
    const product = products.find((product) => product.getSku() === sku);
    return product || null;
  }
  async getByPartNumber(partNumber: string): Promise<Product | null> {
    const products = await this.fetchProducts({});
    const product = products.find(
      (product) =>
        product.partNumber && product.partNumber[0].partNumber === partNumber
    );

    return product || null;
  }

  async getByCategory(category: RelevantCategoriesType): Promise<Product[]> {
    let productsFiltered: Product[] = [];

    for (const cat of category.providerCategories) {
      const keywords = [
        cat.providerMainCategoryCode !== undefined
          ? cat.providerMainCategoryCode.toString().toUpperCase()
          : undefined,
        cat.providerMainCategoryName !== undefined
          ? cat.providerMainCategoryName.toString().toUpperCase()
          : undefined,
        cat.providerCategoryCode !== undefined
          ? cat.providerCategoryCode.toString().toUpperCase()
          : undefined,
        cat.providerCategoryName !== undefined
          ? cat.providerCategoryName.toUpperCase()
          : undefined,
      ].filter(
        (word): word is string => typeof word === "string" && word.trim() !== ""
      );

      if (keywords.length > 0) {
        console.log("Keywords", keywords);
        const products = await this.getInstance();

        productsFiltered = products.filter((product) => {
          if (!product.title) return false;
          const productTitle = product.title.toUpperCase();
          return keywords.some((keyword) => productTitle.includes(keyword));
        });
      }
    }

    return productsFiltered;
  }

  async getAll(): Promise<Product[]> {
    const products = await this.fetchProducts({});

    return products;
  }

  async getFeatured(request?: any): Promise<Product[]> {
    const products = await this.fetchProducts({});
    const featuredProducts = products.filter((product) => product.stock <= 10);
    return featuredProducts;
  }

  async getOffers(request?: any): Promise<Product[]> {
    throw new Error("Method not implemented.");
  }

  productMapper(product: SolutionboxAPIProduct): Product {
    const productMapped = new Product({
      title: product.Descripcion,
      description: product.Detalle || "",
      price: product.Precio,
      priceHistory: [],
      sku: product.Alias,
      stock: product.Stock,
      marca: product.Marca,
      availability: product.Stock > 0 ? "in_stock" : "out_of_stock",
      provider: solutionBoxProvider,
      partNumber: [
        {
          partNumber: product.Numero_de_Parte,
          ean: 1234567890123,
          units_x_box: 1,
        },
      ],
      category: {
        name: "N/A",
        id: "N/A",
      },
      images: [],
      submitDate: new Date(),
    });

    return productMapped;
  }

  productMapperList(products: SolutionboxAPIProduct[]): Product[] {
    return products.map((product) => this.productMapper(product));
  }
}
