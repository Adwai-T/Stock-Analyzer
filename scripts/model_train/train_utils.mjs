import { Icons } from "../utils/icons.mjs";

/**
 * Dot product of 2 matrices
 * @param { Array } a Array of arrays
 * @param { Array } b Array of arrays
 */
export function dotProduct(a, b) {
  const rowsA = a.length;
  const colsA = a[0].length;
  const rowsB = b.length;
  const colsB = b[0].length;

  if (colsA != rowsB) {
    throw new Error(
      `${Icons.error}Columns of A - ${colsA} and Rows of B - ${rowsB} are should be equal to perform dot products.`
    );
  }

  // -- initialize array with 0 having shape of resulting array.
  const result = Array.from({ length: rowsA }, () => {
    return Array(colsB).fill(0); //-- create array of length and fill with 0
  });

  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      for (let k = 0; k < colsA; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }

  return result;
}
