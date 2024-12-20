import { RelevantCategoriesType } from "../../../domain/categories/defaultCategories";
import { Product } from "../../../domain/product/entities/Product";
import { IProductRepository } from "../../../domain/product/repositories/IProductRepository";
import { getFormattedDate } from "../../../Utils/Functions/DateFunctions";
import { CDRAPIProduct } from "../entities/CDRMediosAPIProductEntitie";
const soap = require("soap");

export class CDRMediosAPIProductAdapter implements IProductRepository {
  private readonly API_URL = process.env.API_CDRMEDIOS_URL || "";
  private soapClient: any | null = null; // Variable para almacenar el cliente SOAP
  private static lastFetched: number | null = null;
  private static readonly CACHE_DURATION = 1.5 * 60 * 60 * 1000; // 1.5 hours in milliseconds
  private static products: Product[];

  constructor() {}

  async getInstance(): Promise<Product[]> {
    const now = Date.now();

    console.log(
      `Is Ready to fetch products?: ${
        !CDRMediosAPIProductAdapter.lastFetched ||
        now - CDRMediosAPIProductAdapter.lastFetched >=
          CDRMediosAPIProductAdapter.CACHE_DURATION
          ? "YYYYYYYYYY"
          : "NNNNNNNNNN"
      }`
    );

    if (
      !CDRMediosAPIProductAdapter.lastFetched ||
      now - CDRMediosAPIProductAdapter.lastFetched >=
        CDRMediosAPIProductAdapter.CACHE_DURATION
    ) {
      CDRMediosAPIProductAdapter.lastFetched = now;
      CDRMediosAPIProductAdapter.products = await this.fetchProducts();
    }

    console.log("Products fetched from CDR API");

    return CDRMediosAPIProductAdapter.products;
  }

  private async getSoapClient(): Promise<any> {
    if (!this.soapClient) {
      try {
        // Crea el cliente SOAP solo si no existe
        this.soapClient = await soap.createClientAsync(this.API_URL);
        console.log("SOAP client initialized.");
      } catch (error) {
        console.error("Error initializing SOAP client:", error);
        throw error;
      }
    }
    return this.soapClient;
  }

  private async fetchProducts(): Promise<Product[]> {
    const client = await this.getSoapClient();

    const params = {
      email: process.env.API_CDRMEDIOS_USER,
      token: process.env.API_CDRMEDIOS_TOKEN,
      fecha: getFormattedDate(30),
      formato: "",
    };

    try {
      const response = await client.productos_con_galeriaAsync(params);

      // Accede al contenido de 'productos_con_galeriaReturn'
      const rawData = response[0]?.productos_con_galeriaReturn?.$value;

      if (!rawData) {
        throw new Error(
          "No se encontró la propiedad $value en la respuesta SOAP."
        );
      }

      // Convierte la cadena JSON en un objeto
      const data: CDRAPIProduct[] = JSON.parse(rawData);

      if (!data) {
        throw new Error("No se pudo parsear la respuesta JSON.");
      }

      return this.mapProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  async getBySKU(sku: string): Promise<Product | null> {
    throw new Error("Method not implemented.");
  }
  async getAll({
    request,
    page,
    category,
    provider,
  }: {
    request?: any;
    page?: number;
    category?: string;
    provider?: string;
  }): Promise<Product[]> {
    const response = await this.fetchProducts();

    if (response) {
      return response;
    }

    return [];
  }

  async getByCategory(category: RelevantCategoriesType): Promise<Product[]> {
    let productsFiltered: Product[] = [];

    for (const cat of category.providerCategories) {
      const keywords = [
        cat.providerMainCategoryCode !== undefined
          ? cat.providerMainCategoryCode.toString()
          : undefined,
        cat.providerMainCategoryName !== undefined
          ? cat.providerMainCategoryName.toString()
          : undefined,
        cat.providerCategoryCode !== undefined
          ? cat.providerCategoryCode.toString()
          : undefined,
        cat.providerCategoryName !== undefined
          ? cat.providerCategoryName
          : undefined,
      ].filter(
        (word): word is string => typeof word === "string" && word.trim() !== ""
      );

      if (keywords.length > 0) {
        const normalizedKeywords = keywords.map((keyword) =>
          keyword.toLowerCase()
        ); // Normalizamos las palabras clave

        console.log("Keywords:", normalizedKeywords);

        const products = await this.getInstance();

        productsFiltered = products.filter((product) => {
          if (!product.title) return false;
          const productTitle = product.title.toLowerCase(); // Normalizamos el título del producto
          return normalizedKeywords.some((keyword) =>
            productTitle.includes(keyword)
          );
        });

        // Eliminamos duplicados
        let deleteDuplicates = new Set(productsFiltered);
        productsFiltered = [...deleteDuplicates];
      }
    }

    return productsFiltered;
  }
  async getFeatured(request?: any): Promise<Product[]> {
    throw new Error("Method not implemented.");
  }
  async getOffers(request?: any): Promise<Product[]> {
    throw new Error("Method not implemented.");
  }

  async getOptions(): Promise<any> {
    const client = await this.getSoapClient();

    console.log("Funciones disponibles en el servicio:");
    console.log(client.describe());
  }

  mapToProduct(data: CDRAPIProduct): Product | null {
    console.log("Mapping product:", data);
    try {
      const product = new Product({
        sku: data.codigo,
        title: data.nombre,
        description: data.descripcion,
        marca: data.marca || "",
        price: parseFloat(data.precio),
        availability: parseInt(data.stock) > 0 ? "in_stock" : "out_of_stock",
        partNumber: [
          {
            partNumber: data.nro_parte,
            ean: 0,
            units_x_box: 1,
          },
        ],
        stock: parseInt(data.stock),
        images: [""],
        submitDate: new Date(),
        category: {
          name: "N/A",
          id: "N/A",
        },
        priceHistory: [],
      });
      return product;
    } catch (error) {
      console.error("Error mapping product:", error);
      return null;
    }
  }
  mapProducts(data: CDRAPIProduct[]): Product[] {
    console.log("Mapping products:", data);
    return data
      .map((product) => this.mapToProduct(product))
      .filter((p) => p !== null) as Product[];
  }
}
