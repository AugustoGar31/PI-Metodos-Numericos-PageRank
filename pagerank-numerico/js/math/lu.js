/**
 * lu.js
 * Descomposición LU (Método de Doolittle) y Resolución de Sistemas Lineales
 * Proyecto Integrador - Métodos Numéricos 2026-2
 */

import { computeResidualNorm, normalizeVectorSum } from './matrix.js';

/**
 * Descompone una matriz cuadrada A en el producto L · U usando el algoritmo de Doolittle:
 *   - L: Matriz triangular inferior con 1s en la diagonal principal (L_ii = 1).
 *   - U: Matriz triangular superior.
 * 
 * Fórmulas:
 *   U_ij = A_ij - sum_{k=0}^{i-1} L_ik * U_kj   (para j >= i)
 *   L_ji = (A_ji - sum_{k=0}^{i-1} L_jk * U_ki) / U_ii   (para j > i)
 * 
 * @param {number[][]} A Matriz cuadrada N x N
 * @returns {{ L: number[][], U: number[][] }}
 */
export function decomposeLU(A) {
  const n = A.length;
  const L = Array.from({ length: n }, () => new Array(n).fill(0));
  const U = Array.from({ length: n }, () => new Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    // 1. Calcular fila i de U
    for (let j = i; j < n; j++) {
      let sum = 0.0;
      for (let k = 0; k < i; k++) {
        sum += L[i][k] * U[k][j];
      }
      U[i][j] = A[i][j] - sum;
    }

    // Diagonal de L fijada en 1 (Doolittle)
    L[i][i] = 1.0;

    // Verificar si el pivote U[i][i] es nulo
    if (Math.abs(U[i][i]) < 1e-15) {
      throw new Error(`Pivote singular o casi nulo detectado en U[${i}][${i}] = ${U[i][i]}. Se requiere pivoteo.`);
    }

    // 2. Calcular columna i de L
    for (let j = i + 1; j < n; j++) {
      let sum = 0.0;
      for (let k = 0; k < i; k++) {
        sum += L[j][k] * U[k][i];
      }
      L[j][i] = (A[j][i] - sum) / U[i][i];
    }
  }

  return { L, U };
}

/**
 * Sustitución hacia adelante para resolver L · y = b
 * Como L es triangular inferior con 1s en la diagonal:
 *   y_i = b_i - sum_{k=0}^{i-1} L_ik * y_k
 * 
 * @param {number[][]} L Matriz triangular inferior con diag(L) = 1
 * @param {number[]} b Vector de términos independientes
 * @returns {{ y: number[], steps: string[] }}
 */
export function forwardSubstitution(L, b) {
  const n = L.length;
  const y = new Array(n).fill(0);
  const steps = [];

  for (let i = 0; i < n; i++) {
    let sum = 0.0;
    for (let k = 0; k < i; k++) {
      sum += L[i][k] * y[k];
    }
    y[i] = b[i] - sum;

    steps.push(`y_${i + 1} = b_${i + 1} - sum(L · y) = ${b[i].toFixed(6)} - ${sum.toFixed(6)} = ${y[i].toFixed(6)}`);
  }

  return { y, steps };
}

/**
 * Sustitución hacia atrás para resolver U · x = y
 * Como U es triangular superior:
 *   x_i = (y_i - sum_{k=i+1}^{n-1} U_ik * x_k) / U_ii
 * 
 * @param {number[][]} U Matriz triangular superior
 * @param {number[]} y Vector intermedio obtenido de Ly = b
 * @returns {{ x: number[], steps: string[] }}
 */
export function backSubstitution(U, y) {
  const n = U.length;
  const x = new Array(n).fill(0);
  const steps = [];

  for (let i = n - 1; i >= 0; i--) {
    let sum = 0.0;
    for (let k = i + 1; k < n; k++) {
      sum += U[i][k] * x[k];
    }
    x[i] = (y[i] - sum) / U[i][i];

    steps.push(`r_${i + 1} = (y_${i + 1} - sum(U · r)) / U_${i + 1}_${i + 1} = (${y[i].toFixed(6)} - ${sum.toFixed(6)}) / ${U[i][i].toFixed(6)} = ${x[i].toFixed(6)}`);
  }

  // Las operaciones se realizaron de n-1 a 0, invertimos los pasos para lectura pedagógica natural
  steps.reverse();

  return { x, steps };
}

/**
 * Resuelve el sistema lineal A · r = b mediante Factorización LU directa
 * Ejecuta:
 *   1. Descomposición A = L · U (Doolittle)
 *   2. Sustitución hacia adelante: L · y = b
 *   3. Sustitución hacia atrás: U · r = y
 *   4. Evaluación del residuo cuadrático: ||A·r - b||_2
 * 
 * @param {number[][]} A Matriz del sistema N x N
 * @param {number[]} b Vector de términos independientes de longitud N
 * @returns {object} Objeto con la solución, matrices L y U, pasos y residuo
 */
export function solveLU(A, b) {
  const startTime = performance.now();
  const n = A.length;

  if (b.length !== n) {
    throw new Error(`Dimensiones incompatibles: A (${n}x${n}) vs b (${b.length}).`);
  }

  // 1. Descomposición LU
  const { L, U } = decomposeLU(A);

  // 2. Sustitución hacia adelante Ly = b
  const { y, steps: forwardSteps } = forwardSubstitution(L, b);

  // 3. Sustitución hacia atrás Ur = y
  const { x, steps: backSteps } = backSubstitution(U, y);

  const endTime = performance.now();
  const executionTimeMs = endTime - startTime;
  const residualNorm = computeResidualNorm(A, x, b);
  const normalizedSolution = normalizeVectorSum(x);

  return {
    solution: x,
    normalizedSolution,
    L,
    U,
    forwardSolutionY: y,
    executionTimeMs,
    residualNorm,
    steps: {
      forward: forwardSteps,
      backward: backSteps
    }
  };
}
