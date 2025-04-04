import { Router } from "express";
import {
  getGameController,
  getGameStatsController,
  guessLetterController,
  startNewGameController,
} from "../controllers/game.controller";

const gameRoute = Router();

gameRoute.post("/", startNewGameController);
gameRoute.get("/stats/:id", getGameStatsController);
gameRoute.get("/:id", getGameController);
gameRoute.put("/:id", guessLetterController);

export default gameRoute;
