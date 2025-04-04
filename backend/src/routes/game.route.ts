import { Router } from "express";
import {
  getGameStatsController,
  guessLetterController,
  startNewGameController,
} from "../controllers/game.controller";

const gameRoute = Router();

gameRoute.post("/", startNewGameController);
gameRoute.put("/:id", guessLetterController);
gameRoute.get("/:id", getGameStatsController);

export default gameRoute;
