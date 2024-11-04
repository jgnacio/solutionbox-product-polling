import { RelevantCategoriesBASE } from "../../domain/categories/defaultCategories";

export interface UnicomAPIProductRequest {
  solo_modificados_desde?: string;
  tipo_informe?: string;
  solo_articulos_destacados?: boolean;
  solo_favoritos?: boolean;
  codigo_grupo?: string;
  codigo_marca?: string;
  rango_articulos_informe: {
    desde_articulo_nro: number;
    hasta_articulo_nro: number;
  };
  [key: string]: any;
}

export const defaultUnicomAPIProductRequest: UnicomAPIProductRequest = {
  solo_modificados_desde: "",
  tipo_informe: "completo",
  solo_articulos_destacados: false,
  solo_favoritos: false,
  codigo_grupo: "",
  codigo_marca: "",
  rango_articulos_informe: {
    hasta_articulo_nro: 200,
    desde_articulo_nro: 0,
  },
};

export interface UnicomAPICategoryRequest {
  codigo_grupo: string;
  formato: "arbol" | "plano";
}

export const defaultUnicomAPICategoryRequest: UnicomAPICategoryRequest = {
  codigo_grupo: "",
  formato: "arbol",
};

export const defaultUnicomAPIRelevantCategories = [
  {
    name: "Notebooks",
    nameES: "Notebooks",
    code: "08.00",
  },
  {
    name: "UltraBooks",
    nameES: "UltraBooks",
    code: "08.25",
  },
  {
    name: "Notebooks Accessories",
    nameES: "Accesorios de Notebooks",
    code: "00.30",
  },
  {
    name: "Memories",
    nameES: "Memorias",
    code: "01.07",
  },
  {
    name: "CPU",
    nameES: "Procesadores",
    code: "01.06",
  },
  {
    name: "Motherboards",
    nameES: "Motherboards",
    code: "01.05",
  },
  {
    name: "Graphics Cards",
    nameES: "GPU",
    code: "01.03",
  },
  {
    name: "Power Supplies",
    nameES: "Fuentes",
    code: "01.17",
  },
  {
    name: "Storage",
    nameES: "Almacenamiento",
    code: "01.01",
  },
  {
    name: "Cooling",
    nameES: "Refrigeración",
    code: "01.01",
  },
  {
    name: "Accessories",
    nameES: "Accesorios",
    code: "00",
  },
  {
    name: "Cabinets",
    nameES: "Gabinetes",
    code: "01.10",
  },
  {
    name: "Webcams",
    nameES: "Webcams",
    code: "00.14",
  },
  {
    name: "monitors",
    nameES: "Monitores",
    code: "02",
  },
  {
    name: "For Cabinets",
    nameES: "Accesorios Gabinetes",
    code: "00.90",
  },
  {
    name: "Desks",
    nameES: "Escritorios",
    code: "62.10",
  },
  {
    name: "Chairs",
    nameES: "Sillas",
    code: "62.11",
  },
  {
    name: "Headets",
    nameES: "Auriculares",
    code: "00.02",
  },
  {
    name: "speakers",
    nameES: "Parlantes",
    code: "00.04",
  },
];

export const UnicomCategoriesAdapter: RelevantCategoriesBASE = {
  provider: "Unicom",
  categories: [
    {
      name: "Notebooks Gamer",
      nameES: "Laptops Gamer",
      code: "notebooks-gamer",
      provider: "Unicom",
      providerCategories: [
        {
          providerCategoryName: "UltraBooks",
          providerCategoryCode: "08.25",
        },
      ],
    },
    {
      name: "Notebooks Home/Office",
      nameES: "Laptops Home/Office",
      code: "notebooks-home-office",
      provider: "Unicom",
      providerCategories: [
        {
          providerCategoryName: "Notebooks",
          providerCategoryCode: "08.00",
        },
      ],
    },
    {
      name: "MacBooks",
      nameES: "MacBooks",
      code: "macbooks",
      provider: "Unicom",
      providerCategories: [],
    },
    {
      name: "Monitors",
      nameES: "Monitores",
      code: "monitors",
      provider: "Unicom",
      providerCategories: [
        {
          providerCategoryName: "monitors",
          providerCategoryCode: "02",
        },
      ],
    },
    {
      name: "Storage",
      nameES: "Almacenamiento",
      code: "storage",
      provider: "Unicom",
      providerCategories: [
        {
          providerCategoryName: "Storage",
          providerCategoryCode: "01.01",
        },
      ],
    },
    {
      name: "Power Supplies",
      nameES: "Fuentes",
      code: "power-supplies",
      provider: "Unicom",
      providerCategories: [
        {
          providerCategoryName: "Power Supplies",
          providerCategoryCode: "01.17",
        },
      ],
    },
    {
      name: "Cases",
      nameES: "Gabinetes",
      code: "cases",
      provider: "Unicom",
      providerCategories: [
        {
          providerCategoryName: "Cabinets",
          providerCategoryCode: "01.10",
        },
        {
          providerCategoryName: "Webcams",
          providerCategoryCode: "00.14",
        },
        {
          providerCategoryName: "For Cabinets",
          providerCategoryCode: "00.90",
        },
      ],
    },
    {
      name: "GPU",
      nameES: "GPU",
      code: "gpu",
      provider: "Unicom",
      providerCategories: [
        {
          providerCategoryName: "Graphics Cards",
          providerCategoryCode: "01.03",
        },
      ],
    },
    {
      name: "RAM",
      nameES: "RAM",
      code: "ram",
      provider: "Unicom",
      providerCategories: [
        {
          providerCategoryName: "Memories",
          providerCategoryCode: "01.07",
        },
      ],
    },
    {
      name: "Motherboards",
      nameES: "Motherboards",
      code: "motherboards",
      provider: "Unicom",
      providerCategories: [
        {
          providerCategoryName: "Motherboards",
          providerCategoryCode: "01.05",
        },
      ],
    },
    {
      name: "Peripherals",
      nameES: "Periféricos",
      code: "peripherals",
      provider: "Unicom",
      providerCategories: [
        {
          providerCategoryName: "Accessories",
          providerCategoryCode: "00",
        },
        {
          providerCategoryName: "Notebooks Accessories",
          providerCategoryCode: "00.30",
        },
        {
          providerCategoryName: "Headets",
          providerCategoryCode: "00.02",
        },
        {
          providerCategoryName: "speakers",
          providerCategoryCode: "00.04",
        },
      ],
    },
    {
      name: "CPU",
      nameES: "CPU",
      code: "cpu",
      provider: "Unicom",
      providerCategories: [
        {
          providerCategoryName: "CPU",
          providerCategoryCode: "01.06",
        },
      ],
    },
    {
      name: "Cooling",
      nameES: "Refrigeración",
      code: "cooling",
      provider: "Unicom",
      providerCategories: [
        {
          providerCategoryName: "Cooling",
          providerCategoryCode: "01.01",
        },
      ],
    },
    {
      name: "Chairs",
      nameES: "Sillas",
      code: "chairs",
      provider: "Unicom",
      providerCategories: [
        {
          providerCategoryName: "Chairs",
          providerCategoryCode: "62.11",
        },
      ],
    },
    {
      name: "Other",
      nameES: "Otros",
      code: "other",
      provider: "Unicom",
      providerCategories: [
        {
          providerCategoryName: "Desks",
          providerCategoryCode: "62.10",
        },
      ],
    },
  ],
};

export interface UnicomAPICartRequest {
  codigo_articulo: string;
  cantidad?: number;
}
/**
 * TDatos_Venta_a_ingresar, Schema for type Model.UserData.TDatos_Venta_a_ingresar
 */
export interface UnicomAPIPurchaseOrderRequest {
  codigo_promocion?: string;
  comentarios?: string;
  /**
   * for the case where the order enters DT
   */
  comentarios_dt?: string;
  /**
   * ISO 8601 format e.g. "2024-09-21T12:31:52.000-03:00"
   */
  fecha_hora_entrega?: string;
  /**
   * required delivery method
   */
  forma_entrega?: DeliveryMethod;
  modo?: EntryModes;
  [property: string]: any;
}

/**
 * required delivery method
 */
export interface DeliveryMethod {
  /**
   * for the case where it is DropShipping
   */
  entrega_dropshipping?: DropShippingDelivery;
  entrega_regular?: RegularDelivery;
  [property: string]: any;
}

/**
 * for the case where it is DropShipping
 */
export interface DropShippingDelivery {
  apartamento?: string;
  /**
   * required depending on the DropShipping system
   */
  ciudad?: string;
  codigo_dropshipping: number;
  /**
   * Optional
   */
  codpostal?: string;
  /**
   * required depending on the DropShipping system
   */
  departamento?: string;
  /**
   * required depending on the DropShipping system
   */
  direccion?: string;
  /**
   * required depending on the DropShipping system
   */
  documento?: string;
  /**
   * required depending on the DropShipping system
   */
  email?: string;
  /**
   * true, if it requires sending the QR code to the consumer as well
   */
  enviar_qr_a_consumidor?: boolean;
  /**
   * required depending on the DropShipping system
   */
  etiqueta_base64?: string;
  /**
   * required depending on the DropShipping system
   */
  factura_base64?: string;
  /**
   * ISO 8601 format e.g. "2024-09-21T12:31:52.000-03:00"
   */
  hora_cierre: string;
  /**
   * ISO 8601 format e.g. "2024-09-21T12:31:52.000-03:00"
   */
  hora_entrega: string;
  /**
   * ISO 8601 format e.g. "2024-09-21T12:31:52.000-03:00"
   */
  hora_fin: string;
  latitud?: number;
  /**
   * Optional
   */
  longitud?: number;
  nombre_destinatario?: string;
  /**
   * required depending on the DropShipping system
   */
  operador_logistico?: string;
  /**
   * required depending on the DropShipping system
   */
  tel?: string;
  /**
   * required depending on the DropShipping system
   */
  tipo_documento?: DocumentTypes;
  [property: string]: any;
}

/**
 * required depending on the DropShipping system
 *
 * DocumentTypes
 */
export enum DocumentTypes {
  Ci = "CI",
  Dni = "DNI",
  OtroDocumento = "otro_documento",
  Pasaporte = "pasaporte",
}
/**
 * RegularDelivery, Schema for type Model.UserData.RegularDelivery
 */
export interface RegularDelivery {
  /**
   * not necessary if the delivery_method = <delivery_at_counter>
   */
  codigo_direccion?: number;
  /**
   * method requested for delivery.
   */
  forma_entrega?: DeliveryMethods;
  [property: string]: any;
}

/**
 * method requested for delivery.
 *
 * DeliveryMethods
 */
export enum DeliveryMethods {
  EntregaEnMostrador = "entrega_en_mostrador",
  FleteFast = "flete_fast",
  FleteInterior = "flete_interior",
  FleteRegular = "flete_regular",
}

/**
 * EntryModes
 */
export enum EntryModes {
  ModoProduccion = "modo_produccion",
  ModoPrueba = "modo_prueba",
}
