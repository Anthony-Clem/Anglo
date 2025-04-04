import { prisma } from "../config/prisma.config";

export const getAllCategoriesService = async () => {
  const categories = await prisma.category.findMany();

  return { categories };
};
