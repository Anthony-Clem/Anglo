import { Router } from "express";
import { getAllCategoriesController } from "../controllers/category.controller";

const categoryRoutes = Router();

categoryRoutes.get("/", getAllCategoriesController);

export default categoryRoutes;
