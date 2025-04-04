import { prisma } from "../config/prisma.config";
import categories from "../lib/data.json";

const seed = async () => {
  console.log("Seeding database starting");

  try {
    for (const category of categories) {
      const categoryName = category.name.toLowerCase();

      let existingCategory = await prisma.category.findUnique({
        where: {
          name: categoryName,
        },
      });

      if (!existingCategory) {
        existingCategory = await prisma.category.create({
          data: {
            name: categoryName,
          },
        });
        console.log(`Created a new category: ${categoryName}`);
      }

      for (const word of category.words) {
        const wordText = word.toLowerCase();

        const existingWord = await prisma.word.findUnique({
          where: {
            text: wordText,
            categoryId: existingCategory.id,
          },
        });

        if (!existingWord) {
          await prisma.word.create({
            data: { text: wordText, categoryId: existingCategory.id },
          });
          console.log(`Added word: ${wordText} to category: ${categoryName}`);
        }
      }
    }
  } catch (error) {
    console.log("Error occurred during seeding", error);
    return;
  } finally {
    await prisma.$disconnect();
  }
};

seed();
