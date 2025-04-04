import { z } from "zod";

export const startNewGameSchema = z.object({
  category: z
    .string()
    .min(1, "Category required")
    .transform((val) => val.toLowerCase()),
});

export const guessLetterSchema = z.object({
  gameId: z.string().min(1, "Game ID required"),
  guessedLetter: z
    .string()
    .min(1, "Guess is required")
    .max(1, "Guess must be a single letter")
    .regex(/^[a-zA-Z]$/, "Guess must be a letter")
    .transform((val) => val.toLowerCase()),
  duration: z.number().min(0, "Duration cannot be less than 0"),
});
