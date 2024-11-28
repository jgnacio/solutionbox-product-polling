export interface CDRAPIProductRequest {
  email: string;
  token: string;
  fecha: string;
  formato: "" | "XML" | "JSON";
}

import { RelevantCategoriesBASE } from "../../domain/categories/defaultCategories";

export const CDRCategoriesAdapter: RelevantCategoriesBASE = {
  provider: "CDR",
  categories: [
    {
      name: "Notebooks Gamer",
      nameES: "Laptops Gamer",
      code: "notebooks-gamer",
      provider: "CDR",
      providerCategories: [
        {
          providerCategoryName: "notebook",
          providerCategoryCode: "",
          providerMainCategoryName: "",
          providerMainCategoryCode: "",
        },
      ],
    },
    {
      name: "Notebooks Home/Office",
      nameES: "Laptops Home/Office",
      code: "notebooks-home-office",
      provider: "CDR",
      providerCategories: [
        {
          providerCategoryName: "notebook",
          providerCategoryCode: "",
          providerMainCategoryName: "",
          providerMainCategoryCode: "",
        },
      ],
    },
    {
      name: "MacBooks",
      nameES: "MacBooks",
      code: "macbooks",
      provider: "CDR",
      providerCategories: [
        {
          providerCategoryName: "macbook",
          providerCategoryCode: "",
          providerMainCategoryName: "",
          providerMainCategoryCode: "",
        },
      ],
    },
    {
      name: "Monitors",
      nameES: "Monitores",
      code: "monitors",
      provider: "CDR",
      providerCategories: [
        {
          providerCategoryName: "monitor",
          providerCategoryCode: "",
          providerMainCategoryName: "",
          providerMainCategoryCode: "",
        },
      ],
    },
    {
      name: "Storage",
      nameES: "Almacenamiento",
      code: "storage",
      provider: "CDR",
      providerCategories: [
        {
          providerCategoryName: "disco ssd",
          providerCategoryCode: "nvme pcie m2",
          providerMainCategoryName: "",
          providerMainCategoryCode: "",
        },
      ],
    },
    {
      name: "Power Supplies",
      nameES: "Fuentes",
      code: "power-supplies",
      provider: "CDR",
      providerCategories: [
        {
          providerCategoryName: "fuente",
          providerCategoryCode: "",
          providerMainCategoryName: "",
          providerMainCategoryCode: "",
        },
      ],
    },
    {
      name: "Cases",
      nameES: "Gabinetes",
      code: "cases",
      provider: "CDR",
      providerCategories: [
        {
          providerCategoryName: "gabinete",
          providerCategoryCode: "",
          providerMainCategoryName: "",
          providerMainCategoryCode: "",
        },
      ],
    },
    {
      name: "GPU",
      nameES: "GPU",
      code: "gpu",
      provider: "CDR",
      providerCategories: [
        {
          providerCategoryName: "tarjeta video",
          providerCategoryCode: "",
          providerMainCategoryName: "",
          providerMainCategoryCode: "",
        },
      ],
    },
    {
      name: "RAM",
      nameES: "RAM",
      code: "ram",
      provider: "CDR",
      providerCategories: [
        {
          providerCategoryName: "memoria ddr4",
          providerCategoryCode: "memoria ddr5",
          providerMainCategoryName: "",
          providerMainCategoryCode: "",
        },
      ],
    },
    {
      name: "Motherboards",
      nameES: "Motherboards",
      code: "motherboards",
      provider: "CDR",
      providerCategories: [
        {
          providerCategoryName: "motherboard",
          providerCategoryCode: "",
          providerMainCategoryName: "",
          providerMainCategoryCode: "",
        },
      ],
    },
    {
      name: "Peripherals",
      nameES: "Periféricos",
      code: "peripherals",
      provider: "CDR",
      providerCategories: [
        {
          providerMainCategoryName: "Teclado",
          providerMainCategoryCode: "Mouse",
          providerCategoryCode: "Combo Mouse",
          providerCategoryName: "Combo Teclado",
        },
      ],
    },
    {
      name: "CPU",
      nameES: "CPU",
      code: "cpu",
      provider: "CDR",
      providerCategories: [
        {
          providerCategoryName: "procesador amd",
          providerCategoryCode: "procesador intel",
          providerMainCategoryName: "",
          providerMainCategoryCode: "",
        },
      ],
    },
    {
      name: "Cooling",
      nameES: "Refrigeración",
      code: "cooling",
      provider: "CDR",
      providerCategories: [
        {
          providerMainCategoryName: " fancooler",
          providerMainCategoryCode: "cooler",
          providerCategoryName: "fan cooler",
          providerCategoryCode: " cooler liquido",
        },
      ],
    },
    {
      name: "Chairs",
      nameES: "Sillas",
      code: "chairs",
      provider: "CDR",
      providerCategories: [
        {
          providerCategoryName: "silla gamer",
          providerCategoryCode: "alfombra p/silla",
          providerMainCategoryName: "",
          providerMainCategoryCode: "",
        },
      ],
    },
    {
      name: "Other",
      nameES: "Otros",
      code: "other",
      provider: "CDR",
      providerCategories: [
        {
          providerCategoryName: "",
          providerCategoryCode: "",
          providerMainCategoryName: "",
          providerMainCategoryCode: "",
        },
      ],
    },
  ],
};
