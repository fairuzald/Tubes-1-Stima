import { Matrix } from "@/types";

const getRowCount = (matrix: Matrix): number => {
  return Object.keys(matrix).length;
};

const getColumnCount = (matrix: Matrix): number => {
  if (getRowCount(matrix) === 0) {
    // Handle empty matrix case
    return 0;
  }
  // Ambil panjang array pada salah satu baris, karena semua baris dianggap memiliki jumlah kolom yang sama
  const firstRowKey = parseInt(Object.keys(matrix)[0]);
  return matrix[firstRowKey].length;
};


export { getColumnCount, getRowCount };
