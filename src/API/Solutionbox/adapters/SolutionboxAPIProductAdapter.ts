import { Product, Provider } from "../../../domain/product/entities/Product";
import { IProductRepository } from "../../../domain/product/repositories/IProductRepository";
import axios from "axios";
import { SolutionboxAPITokenAdapter } from "./SolutionboxAPITokenAdapter";
import { SolutionboxAPIProduct } from "../entities/Products/SolutionboxAPIProduct";

export const solutionBoxProvider: Provider = {
  name: "Solutionbox",
  mainPageUrl: "https://www.solutionbox.com.uy/",
  searchPageUrl: "https://www.solutionbox.com.uy/detalle?sku=",
  logoUrl:
    "https://res.cloudinary.com/dhq5ewbyu/image/upload/v1729604229/ASLAN/vkr0voqeoh47duv94jw3.png",
};

export class SolutionboxAPIProductAdapter implements IProductRepository {
  private readonly URL = process.env.API_SOLUTIONBOX_URL;

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

  async getByCategory(category: string): Promise<Product[]> {
    const products = await this.fetchProducts({});
    switch (category) {
      case "Notebooks":
        return products.filter(
          (product) =>
            product.title.includes("Notebook") ||
            product.title.includes("Laptop") ||
            product.title.includes("DELL") ||
            product.marca.includes("APPLE")
        );
      case "Motherboards":
        return products.filter((product) =>
          product.title.includes("Motherboard")
        );
      case "Monitors":
        return products.filter(
          (product) =>
            product.title.includes("Monitor") ||
            product.title.includes("Pantalla") ||
            product.title.includes("Display")
        );
      case "CPU":
        return products.filter((product) => product.marca.includes("AMD"));
      case "GPU":
        return products.filter((product) => product.title.includes("RTX"));
      case "RAM":
        return products.filter((product) => product.title.includes("RAM"));
      case "Fuentes":
        return products.filter((product) => product.title.includes("Fuente"));
      case "Refrigeración":
        return products.filter(
          (product) =>
            product.title.includes("REF.LIQ") ||
            product.title.includes("REFRIGERACION") ||
            product.title.includes(" 240MM") ||
            product.title.includes(" 120MM") ||
            product.title.includes(" 360MM")
        );

      default:
        return [];
    }
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
