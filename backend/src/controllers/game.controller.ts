import { z } from "zod";
import { HTTPSTATUS } from "../config/http.config";
import { guessLetterSchema, startNewGameSchema } from "../lib/schema";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import {
  getGameStatsService,
  guessLetterService,
  startNewGameService,
} from "../services/game.service";

export const startNewGameController = asyncHandler(async (req, res) => {
  const { category } = startNewGameSchema.parse(req.body);

  const { game } = await startNewGameService(category);

  return res.status(HTTPSTATUS.CREATED).json({
    message: "New game started successfully",
    data: game,
  });
});

export const guessLetterController = asyncHandler(async (req, res) => {
  const { gameId, guessedLetter, duration } = guessLetterSchema.parse({
    gameId: req.params.id,
    ...req.body,
  });

  const { status, hp, correctGuesses, guessResult, guessedLetters } =
    await guessLetterService(gameId, guessedLetter, duration);

  return res.status(HTTPSTATUS.OK).json({
    message: `${guessedLetter} was guessed`,
    data: {
      status,
      hp,
      guessResult,
      correctGuesses,
      guessedLetters,
    },
  });
});

export const getGameStatsController = asyncHandler(async (req, res) => {
  const gameId = z.string().parse(req.params.id);

  const { result, word, duration, numberOfGuesses } = await getGameStatsService(
    gameId
  );

  return res.status(HTTPSTATUS.OK).json({
    message: "Game stats fetched successfully",
    data: {
      result,
      word,
      duration,
      numberOfGuesses,
    },
  });
});
