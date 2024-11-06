import { Product, Provider } from "../../../domain/product/entities/Product";
import { IProductRepository } from "../../../domain/product/repositories/IProductRepository";
import axios from "axios";
import {
  PCServiceProductByDate,
  PCServiceProductDetails,
  PCServiceRootObject,
} from "../entities/Product/PCServiceAPIProduct";
import {
  defaultPCServiceRelevantCategories,
  PCServiceCategoriesAdapter,
  PCServiceCategoryCodeType,
} from "../PCServiceAPIRequest";
import { PCServiceAPITokenAdapter } from "./PCServiceAPITokenAdapter";
import { getDateInYYYY } from "../../../Utils/Functions/DateFunctions";
import { Prisma } from "@prisma/client";
import {
  CategoriesProvider,
  RelevantCategoriesType,
} from "../../../domain/categories/defaultCategories";
require("dotenv").config();

type Request = {
  body?: any;
  route: string;
  method: string;
};
type FetchProductsByCategory = {
  category: string;
  id?: never;
  request?: Request;
};

type FetchProductsById = {
  id: number;
  category?: never;
  request?: Request;
};
type FetchProductsRequest = {
  id?: number;
  category?: never;
  request: Request;
};

type FetchProductsParams =
  | FetchProductsByCategory
  | FetchProductsById
  | FetchProductsRequest;

export const logoPCService: Provider = {
  name: "PCService",
  mainPageUrl: "https://www.pcservice.com.uy/",
  searchPageUrl:
    "https://www.pcservice.com.uy/others/PCsResults.jsp?queryref=17031901&reforderby=relev&querypage=1&searchstr=",
  logoUrl:
    "https://res.cloudinary.com/dhq5ewbyu/image/upload/v1729171066/ASLAN/hao6sciafwm5rqllsknh.png",
};

export class PCServiceAPIProductAdapter implements IProductRepository {
  private readonly API_PCSERVICE_URL = process.env.API_PCSERVICE_URL;

  constructor() {}

  private async fetchProduct(id: number): Promise<any> {
    const token = await new PCServiceAPITokenAdapter().getToken();
    const response = await axios
      .get(`${this.API_PCSERVICE_URL}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      })
      .then((response) => {
        return response.data as PCServiceProductDetails;
      });
    return response;
  }

  private async fetchProducts(params: FetchProductsParams): Promise<Product[]> {
    const token = await new PCServiceAPITokenAdapter().getToken();
    if (params.category) {
      let category: PCServiceCategoryCodeType = {
        name: "",
        nameES: "",
        code: 0,
        subCategories: [
          {
            name: "",
            nameES: "",
            code: 0,
          },
        ],
      };

      console.log(params.category);

      category = defaultPCServiceRelevantCategories.find(
        (category) => category.nameES === params.category
      ) as PCServiceCategoryCodeType;

      if (!category) {
        return [];
      }

      let productListMapped: Product[][] = [];

      const response = await Promise.all(
        category.subCategories.map(async (subCategory) => {
          const productsByCategories = await axios
            .get(
              `${this.API_PCSERVICE_URL}/categories/${category.code}/${subCategory.code}/products`,
              {
                headers: {
                  Authorization: `Bearer ${token.token}`,
                },
              }
            )
            .then((response) => {
              return response.data as PCServiceRootObject;
            })
            .catch((error) => {
              throw new Error(error);
            });
          const productList = await Promise.all(
            productsByCategories.childs.map(async (child) => {
              const productsWithDetails = await Promise.all(
                child.products.map((product) => {
                  return this.fetchProduct(
                    product.id
                  ) as Promise<PCServiceProductDetails>;
                })
              );

              // Llama a productMapperList para mapear los productos con detalles
              return this.productMapperList(productsWithDetails, {
                id: "",
                name: "",
              }).flat();
            })
          );
          productListMapped.push(productList.flat());
          return productList.flat();
        })
      );

      return productListMapped.flat();
    } else {
      const { method, route } = params.request || {};

      const response = await axios
        .get(`${this.API_PCSERVICE_URL}${route}`, {
          headers: {
            Authorization: `Bearer ${token.token}`,
          },
        })
        .then((response) => {
          return response.data as PCServiceProductByDate[];
        })
        .catch((error) => {
          console.error(error);
          throw new Error(error);
        });

      const productList = response.map((product) => {
        let category: PCServiceCategoryCodeType = {
          name: "Not Defined",
          nameES: "Not Defined",
          code: 0,
          subCategories: [
            {
              name: "Not Defined",
              nameES: "Not Defined",
              code: 0,
            },
          ],
        };

        // Busca en las categorías de producto
        const foundCategory = product.categories.find((cat) => {
          return defaultPCServiceRelevantCategories.some(
            (categoryCode) => categoryCode.code === cat.id
          );
        });

        // Si se encuentra una categoría, mapea a PCServiceCategoryCodeType
        if (foundCategory) {
          const categoryCode = defaultPCServiceRelevantCategories.find(
            (categoryCode) => categoryCode.code === foundCategory.id
          );

          if (categoryCode) {
            category = categoryCode; // Asignar la categoría encontrada
          }
        }

        return this.productMapper(product, {
          id: "",
          name: "",
        });
      });
      return productList.flat();
    }
  }

  async getBySKU(sku: string): Promise<Product | null> {
    console.log(sku);
    const skuNumber = parseInt(sku);
    const product = await this.fetchProduct(skuNumber).then((product) => {
      const categoryName = product.title.split(" ")[0];
      return this.productMapper(product, {
        id: "",
        name: "",
      });
    });
    return product;
  }
  async fetchProductsV2(category: CategoriesProvider): Promise<Product[]> {
    const token = await new PCServiceAPITokenAdapter().getToken();

    const productsByCategory = await axios
      .get(
        `${this.API_PCSERVICE_URL}/categories/${category.providerMainCategoryCode}/${category.providerCategoryCode}/products`,
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
          },
        }
      )
      .then((response) => {
        return response.data as PCServiceRootObject;
      });

    if (!productsByCategory.childs[0].products) {
      return [];
    }

    const productList = await Promise.all(
      productsByCategory.childs.map(async (child) => {
        const productsWithDetails = await Promise.all(
          child.products.map((product) => {
            return this.fetchProduct(
              product.id
            ) as Promise<PCServiceProductDetails>;
          })
        );

        // Llama a productMapperList para mapear los productos con detalles
        return this.productMapperList(productsWithDetails, {
          id: "",
          name: "",
        }).flat();
      })
    );

    if (productList.length === 0) {
      return [];
    }

    return productList.flat();
  }
  async getByCategory(category: RelevantCategoriesType): Promise<Product[]> {
    if (category.providerCategories.length > 0) {
      const productPromises = category.providerCategories.map(
        (providerCategory) => this.fetchProductsV2(providerCategory)
      );

      const productsArray = await Promise.all(productPromises);

      // Combina todos los productos en un solo array
      const allProducts = productsArray.flat();
      return allProducts;
    }

    return [];
  }
  async getAll(): Promise<Product[]> {
    // this.getByCategory("Notebooks Gamer");
    return [];
  }

  getFeatured(request?: any): Promise<Product[]> {
    const productsList = this.fetchProducts({
      request: {
        route: `/products/bydate/?from=${getDateInYYYY(-3 * 60 * 60 * 1000)}`,
        method: "GET",
      },
    });

    return productsList;
  }
  getOffers(request?: any): Promise<Product[]> {
    throw new Error("Method not implemented.");
  }

  productMapper(
    product: PCServiceProductDetails,
    category: {
      id: string;
      name: string;
    }
  ): Product {
    const newProduct = new Product({
      partNumber: [
        {
          partNumber: product.sku,
          ean: 0,
          units_x_box: 1,
        },
      ],
      sku: product.id.toString(),
      title: product.title,
      description: product.body,
      price: product.price.price,
      priceHistory: [],
      provider: logoPCService,
      category: {
        id: category.id,
        name: category.name,
      },
      stock: product.availability.stock,
      availability: product.availability.availability
        ? "in_stock"
        : "out_of_stock",
      images: [""],
      marca: product.extraData.brand || "Not Defined",
      submitDate: new Date(),
    });

    return newProduct;
  }
  productMapperList(
    products: PCServiceProductDetails[],
    category: {
      id: string;
      name: string;
    }
  ): Product[] {
    return products.map((product) => this.productMapper(product, category));
  }
}
