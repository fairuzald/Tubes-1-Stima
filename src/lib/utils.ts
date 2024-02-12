import { Matrix } from "@/types";

// Function to get the row count of a matrix
const getRowCount = (matrix: Matrix): number => {
  // Return the length of the keys (rows) in the matrix object
  return Object.keys(matrix).length;
};

// Function to get the column count of a matrix
const getColumnCount = (matrix: Matrix): number => {
  // Check if the matrix has zero rows, return 0 if true
  if (getRowCount(matrix) === 0) {
    return 0;
  }
  const firstRowKey = parseInt(Object.keys(matrix)[0]);
  // Return the length of the array in the first row, representing column count
  return matrix[firstRowKey].length;
};

export { getColumnCount, getRowCount };

