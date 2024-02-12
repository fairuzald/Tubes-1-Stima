import type { Matrix, Target } from "@/types";
import toast from "react-hot-toast";

// Function to randomize a matrix with the given row and column count
const randomizeMatrix = (rowCount: number, colCount: number): Matrix => {
  // Check if rowCount is less than 2, show error and return empty matrix
  if (rowCount < 2) {
    toast.error("Matrix height must be at least 2.");
    return [];
  }
  // Check if colCount is less than 2, show error and return empty matrix
  if (colCount < 2) {
    toast.error("Matrix width must be at least 2.");
    return [];
  }
  // Define characters to be used in the matrix
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const matrix: Matrix = {};

  // Loop through rows
  for (let i = 0; i < rowCount; i++) {
    const row: string[] = [];
    // Loop through columns
    for (let j = 0; j < colCount; j++) {
      // Generate random characters for each cell
      const randomCharIndex1 = Math.floor(Math.random() * characters.length);
      const randomCharIndex2 = Math.floor(Math.random() * characters.length);
      const randomChar1 = characters.charAt(randomCharIndex1);
      const randomChar2 = characters.charAt(randomCharIndex2);
      row.push(randomChar1 + randomChar2);
    }
    matrix[i] = row;
  }
  // Return the generated matrix
  return matrix;
};

// Function to randomize targets based on a matrix, count, and buffer
const randomizeTarget = (
  matrix: Matrix,
  count: number,
  buffer: number
): Target[] => {
  // Check if count is less than 1, show error and return empty array
  if (count < 1) {
    toast.error("Target count must be more than 0");
    return [];
  }
  // Check if buffer is less than 1, show error and return empty array
  if (buffer < 1) {
    toast.error("Buffer must be more than 0");
    return [];
  }
  // Check if the matrix is not initialized, show error and return empty array
  if (Object.keys(matrix).length < 1) {
    toast.error("Matrix must be initialized first");
    return [];
  }
  let randomTargets: Target[] = [];
  // Loop to generate random targets
  for (let i = 0; i < count; i++) {
    let random = [];
    // Generate random count for the sequence (between 2 and 6)
    let randomCountSeq = Math.floor(Math.random() * 6) + 1;
    const minimumValue = 2;
    // Ensure minimum count for the sequence
    if (randomCountSeq < minimumValue) {
      randomCountSeq = minimumValue;
    }

    // Loop to generate random sequence based on matrix
    for (let j = 0; j < randomCountSeq; j++) {
      // Generate random row and column indices
      const randomRowIndex = Math.floor(
        Math.random() * Object.keys(matrix).length
      );
      const randomColIndex = Math.floor(
        Math.random() * matrix[randomRowIndex].length
      );
      random.push(matrix[randomRowIndex][randomColIndex]);
    }

    // If the sequence is longer than the buffer, trim it
    if (random.length > buffer) {
      random = random.slice(0, buffer);
    }
    // Create a random target with the generated sequence and points
    const randomTarget: Target = {
      sequence: random,
      points: Math.floor(Math.random() * 100),
    };
    randomTargets.push(randomTarget);
  }

  return randomTargets;
};

export { randomizeMatrix, randomizeTarget };

