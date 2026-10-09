/**
 * matrix.js
 * Módulo de Álgebra Lineal y Métodos Numéricos para PageRank
 * Proyecto Integrador - Métodos Numéricos 2026-2
 */

/**
 * Crea una matriz identidad de tamaño N x N
 * @param {number} n Dimensión de la matriz
 * @returns {number[][]} Matriz identidad N x N
 */
export function createIdentity(n) {
  const I = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    I[i][i] = 1.0;
  }
  return I;
}

/**
 * Resta dos matrices A - B de dimensión N x M
 * @param {number[][]} A Matriz minuendo
 * @param {number[][]} B Matriz sustraendo
 * @returns {number[][]} Matriz resultado A - B
 */
export function matrixSubtract(A, B) {
  const rows = A.length;
  const cols = A[0].length;
  const result = Array.from({ length: rows }, () => new Array(cols).fill(0));
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[i][j] = A[i][j] - B[i][j];
    }
  }
  return result;
}

/**
 * Multiplica una matriz por un escalar: s * A
 * @param {number[][]} A Matriz N x M
 * @param {number} s Escalar
 * @returns {number[][]} Matriz escalada
 */
export function matrixScale(A, s) {
  const rows = A.length;
  const cols = A[0].length;
  const result = Array.from({ length: rows }, () => new Array(cols).fill(0));
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[i][j] = A[i][j] * s;
    }
  }
  return result;
}

/**
 * Multiplicación matriz-vector: A * x
 * @param {number[][]} A Matriz N x M
 * @param {number[]} x Vector de longitud M
 * @returns {number[]} Vector resultado de longitud N
 */
export function matrixVectorMultiply(A, x) {
  const rows = A.length;
  const cols = A[0].length;
  const result = new Array(rows).fill(0);
  for (let i = 0; i < rows; i++) {
    let sum = 0;
    for (let j = 0; j < cols; j++) {
      sum += A[i][j] * x[j];
    }
    result[i] = sum;
  }
  return result;
}

/**
 * Resta dos vectores: u - v
 * @param {number[]} u 
 * @param {number[]} v 
 * @returns {number[]}
 */
export function vectorSubtract(u, v) {
  return u.map((val, idx) => val - v[idx]);
}

/**
 * Norma infinito de la diferencia entre dos vectores: max_i |u_i - v_i|
 * @param {number[]} u Vector 1
 * @param {number[]} v Vector 2
 * @returns {number} ||u - v||_inf
 */
export function vectorNormInf(u, v) {
  let maxDiff = 0;
  for (let i = 0; i < u.length; i++) {
    const diff = Math.abs(u[i] - v[i]);
    if (diff > maxDiff) {
      maxDiff = diff;
    }
  }
  return maxDiff;
}

/**
 * Norma euclidiana (norma 2) de un vector: sqrt(sum(v_i^2))
 * @param {number[]} v Vector
 * @returns {number} ||v||_2
 */
export function vectorNorm2(v) {
  let sumSq = 0;
  for (let i = 0; i < v.length; i++) {
    sumSq += v[i] * v[i];
  }
  return Math.sqrt(sumSq);
}

/**
 * Calcula la norma euclidiana del residuo: ||A*x - b||_2
 * @param {number[][]} A Matriz del sistema
 * @param {number[]} x Vector solución candidata
 * @param {number[]} b Vector de términos independientes
 * @returns {number} ||A*x - b||_2
 */
export function computeResidualNorm(A, x, b) {
  const Ax = matrixVectorMultiply(A, x);
  const r = vectorSubtract(Ax, b);
  return vectorNorm2(r);
}

/**
 * Evalúa si una matriz cuadrada es estrictamente diagonal dominante
 * Analiza dominancia tanto por filas como por columnas (crucial para PageRank)
 * @param {number[][]} A Matriz cuadrada N x N
 * @returns {object} Resumen de dominancia diagonal y detalles por fila/columna
 */
export function isDiagonallyDominant(A) {
  const n = A.length;
  let isRowDominant = true;
  let isColDominant = true;

  const rowDetails = [];
  const colDetails = [];

  // Verificación por Filas: |a_ii| > sum_{j != i} |a_ij|
  for (let i = 0; i < n; i++) {
    const diag = Math.abs(A[i][i]);
    let offDiagSum = 0;
    for (let j = 0; j < n; j++) {
      if (j !== i) {
        offDiagSum += Math.abs(A[i][j]);
      }
    }
    const dominant = diag > offDiagSum;
    if (!dominant) isRowDominant = false;

    rowDetails.push({
      index: i,
      diag,
      offDiagSum,
      margin: diag - offDiagSum,
      ratio: offDiagSum > 0 ? (offDiagSum / diag) : 0,
      dominant
    });
  }

  // Verificación por Columnas: |a_jj| > sum_{i != j} |a_ij|
  for (let j = 0; j < n; j++) {
    const diag = Math.abs(A[j][j]);
    let offDiagSum = 0;
    for (let i = 0; i < n; i++) {
      if (i !== j) {
        offDiagSum += Math.abs(A[i][j]);
      }
    }
    const dominant = diag > offDiagSum;
    if (!dominant) isColDominant = false;

    colDetails.push({
      index: j,
      diag,
      offDiagSum,
      margin: diag - offDiagSum,
      ratio: offDiagSum > 0 ? (offDiagSum / diag) : 0,
      dominant
    });
  }

  return {
    isRowDominant,
    isColDominant,
    rowDetails,
    colDetails,
    explanation: isRowDominant
      ? "La matriz es estrictamente diagonal dominante por filas: para toda fila i, |a_ii| > sum_{j!=i} |a_ij|."
      : isColDominant
      ? "La matriz es estrictamente diagonal dominante por columnas: para toda columna j, |a_jj| > sum_{i!=j} |a_ij| (garantizado con d < 1)."
      : "La matriz no cumple dominancia diagonal estricta directa, pero la convergencia está garantizada por ser el radio espectral rho(T) <= d < 1."
  };
}

/**
 * Construye la matriz de transición estocástica M para una red de N nodos
 * Regla PageRank:
 * - Si el nodo j tiene enlaces salientes L_j: M[i][j] = 1 / L_j si j -> i, de lo contrario 0.
 * - Si el nodo j es 'dangling' (sin enlaces salientes): M[i][j] = 1 / N para todo i.
 * 
 * @param {number} numNodes Cantidad de nodos N
 * @param {Array<{from: number, to: number}>} edges Lista de aristas dirigidas (índices 0-based)
 * @returns {number[][]} Matriz de transición M de N x N (estocástica por columnas)
 */
export function buildTransitionMatrix(numNodes, edges) {
  const n = numNodes;
  const M = Array.from({ length: n }, () => new Array(n).fill(0));

  // Calcular el grado de salida (out-degree) de cada nodo j
  const outDegree = new Array(n).fill(0);
  const outTargets = Array.from({ length: n }, () => new Set());

  edges.forEach(({ from, to }) => {
    if (from >= 0 && from < n && to >= 0 && to < n) {
      if (!outTargets[from].has(to)) {
        outTargets[from].add(to);
        outDegree[from]++;
      }
    }
  });

  // Llenar columnas de M
  for (let j = 0; j < n; j++) {
    if (outDegree[j] === 0) {
      // Dangling node: distribuye equiprobablemente a todos los nodos
      for (let i = 0; i < n; i++) {
        M[i][j] = 1.0 / n;
      }
    } else {
      const prob = 1.0 / outDegree[j];
      for (const i of outTargets[j]) {
        M[i][j] = prob;
      }
    }
  }

  return M;
}

/**
 * Formula el sistema de ecuaciones lineales canónico de PageRank:
 *   r = d * M * r + ((1 - d) / N) * 1
 *   (I - d * M) * r = ((1 - d) / N) * 1
 * 
 * Donde:
 *   A = I - d * M
 *   b = ((1 - d) / N) * 1
 * 
 * @param {number[][]} M Matriz de transición N x N
 * @param {number} d Factor de amortiguamiento (damping factor, típicamente 0.85)
 * @returns {{ A: number[][], b: number[], d: number, N: number }}
 */
export function buildPageRankLinearSystem(M, d = 0.85) {
  const n = M.length;
  const I = createIdentity(n);
  const dM = matrixScale(M, d);
  const A = matrixSubtract(I, dM);

  const teleportProb = (1.0 - d) / n;
  const b = new Array(n).fill(teleportProb);

  return { A, b, d, N: n };
}

/**
 * Normaliza un vector para que la suma de sus componentes sea exactamente 1
 * @param {number[]} v Vector numérico
 * @returns {number[]} Vector normalizado
 */
export function normalizeVectorSum(v) {
  const sum = v.reduce((acc, val) => acc + val, 0);
  if (Math.abs(sum) < 1e-15) return [...v];
  return v.map(val => val / sum);
}
