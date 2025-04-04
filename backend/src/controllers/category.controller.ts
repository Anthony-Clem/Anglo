import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { getAllCategoriesService } from "../services/category.service";

export const getAllCategoriesController = asyncHandler(async (req, res) => {
  const { categories } = await getAllCategoriesService();

  res.status(HTTPSTATUS.OK).json({
    message: "Categories fetched successfully",
    data: categories,
  });
});
