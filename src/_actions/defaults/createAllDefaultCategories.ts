import { UnicomCategoriesAdapter } from "../../API/Unicom/UnicomAPIRequets";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// Función para crear y listar categorías
export const createAndListCategories = async () => {
  try {
    // Inserta todas las categorías en la base de datos
    await Promise.all(
      UnicomCategoriesAdapter.categories.map(async (category) => {
        try {
          await prisma.category.create({
            data: {
              name: category.name,
              nameES: category.nameES,
              code: category.code,
            },
          });
        } catch (error) {
          console.error("Error creando categoría:", category);
          return;
        }
      })
    );
  } catch (error) {
    console.error("Error creando categorías:", error);
  } finally {
    await prisma.$disconnect();
  }
};
