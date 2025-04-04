import { GameStatus } from "@prisma/client";
import { HTTPSTATUS } from "../config/http.config";
import { prisma } from "../config/prisma.config";
import { HttpError } from "../utils/http-error";

export const startNewGameService = async (categoryName: string) => {
  const category = await prisma.category.findFirst({
    where: {
      name: categoryName,
    },
    include: {
      words: true,
    },
  });
  if (!category) {
    throw new HttpError(
      `Category ${categoryName} not found`,
      HTTPSTATUS.NOT_FOUND
    );
  }

  const randomWord =
    category.words[Math.floor(Math.random() * category.words.length)];

  const game = await prisma.game.create({
    data: {
      categoryId: category.id,
      wordId: randomWord.id,
    },
    include: {
      category: true,
    },
  });

  return { game };
};

export const guessLetterService = async (
  gameId: string,
  guessedLetter: string,
  duration: number
) => {
  const game = await prisma.game.findFirst({
    where: {
      id: gameId,
    },
    include: {
      word: true,
    },
  });

  if (!game) {
    throw new HttpError("Game not found", HTTPSTATUS.NOT_FOUND);
  }

  if (game.status !== "ONGOING") {
    throw new HttpError("Game already concluded", HTTPSTATUS.BAD_REQUEST);
  }

  if (duration <= game.duration) {
    throw new HttpError(
      "Duration cannot be less than or equal to the time already lasped in game",
      HTTPSTATUS.BAD_REQUEST
    );
  }

  if (game.guessed.includes(guessedLetter)) {
    throw new HttpError("Letter already guessed", HTTPSTATUS.BAD_REQUEST);
  }

  const normalizedWord = game.word.text.toLowerCase();
  const normalizedGuess = guessedLetter.toLowerCase();

  const guessedSet = new Set([...game.guessed, normalizedGuess]);

  let guessResult;
  let newStatus: GameStatus = game.status;
  let newHp = game.hp;
  let correctGuesses = [...game.correctGuesses];
  let guessedLetters = [...game.guessed, normalizedGuess];

  if (normalizedWord.includes(normalizedGuess)) {
    correctGuesses.push(normalizedGuess);
    guessResult = "correct";

    if (normalizedWord.split("").every((letter) => guessedSet.has(letter))) {
      newStatus = "WON";
    }
  } else {
    newHp -= 1;
    guessResult = "incorrect";
    if (newHp === 0) {
      newStatus = "LOST";
    }
  }

  const updatedGame = await prisma.game.update({
    where: { id: gameId },
    data: {
      guessed: guessedLetters,
      correctGuesses,
      hp: newHp,
      status: newStatus,
      duration: duration,
    },
  });

  return {
    status: updatedGame.status,
    hp: updatedGame.hp,
    correctGuesses: updatedGame.correctGuesses,
    guessedLetters: updatedGame.guessed,
    guessResult,
  };
};

export const getGameStatsService = async (gameId: string) => {
  const game = await prisma.game.findFirst({
    where: {
      id: gameId,
    },
    include: {
      word: true,
    },
  });
  if (!game) {
    throw new HttpError("Game not found", HTTPSTATUS.NOT_FOUND);
  }
  if (game.status === "ONGOING") {
    throw new HttpError(
      "Cannot get stats of ongoing game",
      HTTPSTATUS.BAD_REQUEST
    );
  }

  return {
    result: game.status,
    duration: game.duration,
    word: game.word.text,
    numberOfGuesses: game.guessed.length,
  };
};

export const getGameService = async (gameId: string) => {
  const game = await prisma.game.findFirst({
    where: {
      id: gameId,
    },
    include: {
      word: true,
      category: true,
    },
  });
  if (!game) {
    throw new HttpError("Game not found", HTTPSTATUS.NOT_FOUND);
  }

  return { game };
};
