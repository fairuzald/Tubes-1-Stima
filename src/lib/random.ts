import { Matrix, Target } from "@/types";
import toast from "react-hot-toast";

const randomizeMatrix = (rowCount: number, colCount: number): Matrix => {
  if (rowCount < 1 || colCount < 1) {
    toast.error("Row count and col count must be more than 0");
    return [];
  }
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const matrix: Matrix = {};

  for (let i = 0; i < rowCount; i++) {
    const row: string[] = [];
    for (let j = 0; j < colCount; j++) {
      const randomCharIndex1 = Math.floor(Math.random() * characters.length);
      const randomCharIndex2 = Math.floor(Math.random() * characters.length);
      const randomChar1 = characters.charAt(randomCharIndex1);
      const randomChar2 = characters.charAt(randomCharIndex2);
      row.push(randomChar1 + randomChar2);
    }
    matrix[i] = row;
  }

  return matrix;
};

const randomizeTarget = (
  matrix: Matrix,
  count: number,
  buffer: number
): Target[] => {
  if (count < 1) {
    toast.error("Target count must be more than 0");
    return [];
  }
  if (buffer < 1) {
    toast.error("Buffer must be more than 0");
    return [];
  }
  if (Object.keys(matrix).length < 1) {
    toast.error("Matrix must be initialized first");
    return [];
  }

  let randomTargets: Target[] = [];
  for (let i = 0; i < count; i++) {
    let random = [];
    let randomCountSeq = Math.floor(Math.random() * 6) + 1;
    const minimumValue = 2;
    if (randomCountSeq < minimumValue) {
      randomCountSeq = minimumValue;
    }

    for (let j = 0; j < randomCountSeq; j++) {
      const randomRowIndex = Math.floor(
        Math.random() * Object.keys(matrix).length
      );
      const randomColIndex = Math.floor(
        Math.random() * matrix[randomRowIndex].length
      );
      random.push(matrix[randomRowIndex][randomColIndex]);
    }

    if (random.length > buffer) {
      random = random.slice(0, buffer);
    }
    const randomTarget: Target = {
      sequence: random,
      points: Math.floor(Math.random() * 100),
    };
    randomTargets.push(randomTarget);
  }

  return randomTargets;
};

export { randomizeMatrix, randomizeTarget };

