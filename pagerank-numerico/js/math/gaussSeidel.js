/**
 * gaussSeidel.js
 * Implementación rigurosa del Método Iterativo de Gauss-Seidel para A·r = b
 * Proyecto Integrador - Métodos Numéricos 2026-2
 */

import { computeResidualNorm, normalizeVectorSum } from './matrix.js';

/**
 * Resuelve el sistema lineal A·x = b mediante el método iterativo de Gauss-Seidel.
 * 
 * Fórmulas de recurrencia:
 *   x_i^(k+1) = (b_i - sum_{j < i} a_ij * x_j^(k+1) - sum_{j > i} a_ij * x_j^(k)) / a_ii
 * 
 * Error absoluto por componente:
 *   |E_i^(k+1)| = |x_i^(k+1) - x_i^(k)|
 * 
 * Criterio de parada:
 *   max_i |E_i^(k+1)| < tol
 * 
 * @param {number[][]} A Matriz de coeficientes N x N
 * @param {number[]} b Vector de términos independientes de longitud N
 * @param {object} options Opciones de configuración
 * @param {number[]} [options.x0] Vector inicial (por defecto equiprobable 1/N)
 * @param {number} [options.tol=1e-5] Tolerancia de convergencia
 * @param {number} [options.maxIter=100] Límite máximo de iteraciones
 * @returns {object} Objeto con la solución, métricas e historial paso a paso
 */
export function solveGaussSeidel(A, b, options = {}) {
  const startTime = performance.now();
  const n = A.length;

  // Validación de dimensiones
  if (b.length !== n) {
    throw new Error(`Dimensiones incompatibles: A es de ${n}x${n} pero b tiene longitud ${b.length}.`);
  }

  // Comprobar elementos diagonales no nulos
  for (let i = 0; i < n; i++) {
    if (Math.abs(A[i][i]) < 1e-15) {
      throw new Error(`El elemento diagonal A[${i}][${i}] es cero o casi cero. Gauss-Seidel no puede despejar x_${i}.`);
    }
  }

  const tol = options.tol !== undefined ? options.tol : 1e-5;
  const maxIter = options.maxIter !== undefined ? options.maxIter : 100;

  // Vector inicial x^(0): por defecto 1/N para cada componente
  let currentX = options.x0 && options.x0.length === n
    ? [...options.x0]
    : new Array(n).fill(1.0 / n);

  // Historial de iteraciones
  const history = [
    {
      iter: 0,
      values: [...currentX],
      errors: null,
      maxError: null
    }
  ];

  let converged = false;
  let iterations = 0;

  while (iterations < maxIter && !converged) {
    iterations++;
    const nextX = [...currentX];
    const errors = new Array(n).fill(0);

    for (let i = 0; i < n; i++) {
      let sumLower = 0.0;
      let sumUpper = 0.0;

      // Componentes ya actualizados en la iteración actual (j < i)
      for (let j = 0; j < i; j++) {
        sumLower += A[i][j] * nextX[j];
      }

      // Componentes de la iteración anterior (j > i)
      for (let j = i + 1; j < n; j++) {
        sumUpper += A[i][j] * currentX[j];
      }

      // Despeje de la incógnita i
      const calculatedVal = (b[i] - sumLower - sumUpper) / A[i][i];
      nextX[i] = calculatedVal;

      // Error absoluto individual: |E_i| = |x_i^(k+1) - x_i^(k)|
      errors[i] = Math.abs(calculatedVal - currentX[i]);
    }

    const maxError = Math.max(...errors);

    // Guardar en el historial
    history.push({
      iter: iterations,
      values: [...nextX],
      errors: [...errors],
      maxError
    });

    // Criterio de parada: todos los errores individuales deben estar por debajo de la tolerancia
    if (maxError < tol) {
      converged = true;
    }

    currentX = nextX;
  }

  const endTime = performance.now();
  const executionTimeMs = endTime - startTime;
  const residualNorm = computeResidualNorm(A, currentX, b);
  const normalizedSolution = normalizeVectorSum(currentX);

  return {
    solution: currentX,
    normalizedSolution,
    iterations,
    converged,
    executionTimeMs,
    residualNorm,
    tolerance: tol,
    maxIter,
    history
  };
}
