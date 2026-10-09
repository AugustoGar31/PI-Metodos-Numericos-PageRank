/**
 * presets.js
 * Grafos predefinidos y generador aleatorio para PageRank
 * Proyecto Integrador - Métodos Numéricos 2026-2
 */

export const PRESETS = {
  catedra4: {
    id: 'catedra4',
    name: 'Caso de Estudio Cátedra (4 Nodos)',
    badge: 'Recomendado',
    description: 'Red canónica de 4 páginas web analizada en clase. Nodo 1 apunta a 2 y 3; Nodo 2 apunta a 4; Nodo 3 apunta a 1, 2 y 4; Nodo 4 apunta a 3. Ideal para contrastar Gauss-Seidel contra LU.',
    recommendedD: 0.85,
    nodes: [
      { id: 1, label: 'P1' },
      { id: 2, label: 'P2' },
      { id: 3, label: 'P3' },
      { id: 4, label: 'P4' }
    ],
    edges: [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 3, to: 1 },
      { from: 3, to: 2 },
      { from: 3, to: 4 },
      { from: 4, to: 3 }
    ]
  },

  starHub: {
    id: 'starHub',
    name: 'Red Centralizada (Hub / Estrella)',
    badge: 'Autoridad',
    description: 'Arquitectura en estrella con 6 nodos donde múltiples sitios periféricos apuntan al Nodo Central (Hub P1), demostrando cómo la concentración de enlaces entrantes maximiza el PageRank.',
    recommendedD: 0.85,
    nodes: [
      { id: 1, label: 'Hub P1' },
      { id: 2, label: 'P2' },
      { id: 3, label: 'P3' },
      { id: 4, label: 'P4' },
      { id: 5, label: 'P5' },
      { id: 6, label: 'P6' }
    ],
    edges: [
      { from: 2, to: 1 },
      { from: 3, to: 1 },
      { from: 4, to: 1 },
      { from: 5, to: 1 },
      { from: 6, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 }
    ]
  },

  spiderTrap: {
    id: 'spiderTrap',
    name: 'Trampa de Enlaces (Spider Trap)',
    badge: 'Fenómeno Teórico',
    description: 'Demuestra el fenómeno del sumidero: los nodos P3 y P4 se apuntan mutuamente sin enlaces al exterior. Sin el factor de amortiguamiento (d < 1), absorberían el 100% del rango. El factor d teletransporta probabilidad y rescata la red.',
    recommendedD: 0.85,
    nodes: [
      { id: 1, label: 'P1' },
      { id: 2, label: 'P2' },
      { id: 3, label: 'P3 (Trampa)' },
      { id: 4, label: 'P4 (Trampa)' }
    ],
    edges: [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 3 }
    ]
  },

  danglingNode: {
    id: 'danglingNode',
    name: 'Callejón Sin Salida (Dangling Nodes)',
    badge: 'Columna Estocástica',
    description: 'El Nodo P4 no tiene enlaces salientes (dangling node). El modelo corrige esto distribuyendo equiprobablemente 1/N a toda la red para preservar la estocasticidad de la matriz M.',
    recommendedD: 0.85,
    nodes: [
      { id: 1, label: 'P1' },
      { id: 2, label: 'P2' },
      { id: 3, label: 'P3' },
      { id: 4, label: 'P4 (Dangling)' }
    ],
    edges: [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 1, to: 3 }
    ]
  },

  linearPipeline: {
    id: 'linearPipeline',
    name: 'Cadena Lineal (Pipeline Secuencial)',
    badge: 'Flujo Dirigido',
    description: 'Cadena dirigida secuencial P1 -> P2 -> P3 -> P4 -> P5 -> P1. Muestra una distribución cuasi-equitativa modulada por el factor de amortiguamiento.',
    recommendedD: 0.85,
    nodes: [
      { id: 1, label: 'P1' },
      { id: 2, label: 'P2' },
      { id: 3, label: 'P3' },
      { id: 4, label: 'P4' },
      { id: 5, label: 'P5' }
    ],
    edges: [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
      { from: 5, to: 1 }
    ]
  }
};

/**
 * Genera una red aleatoria dirigida con N nodos y una probabilidad p de enlace
 * @param {number} numNodes Cantidad de nodos (ej. 5 a 12)
 * @param {number} linkProbability Probabilidad de conexión entre pares (0.1 a 0.8)
 * @returns {object} Objeto preset con nodes y edges
 */
export function generateRandomGraph(numNodes = 6, linkProbability = 0.35) {
  const n = Math.max(3, Math.min(15, numNodes));
  const p = Math.max(0.1, Math.min(0.9, linkProbability));

  const nodes = [];
  for (let i = 1; i <= n; i++) {
    nodes.push({ id: i, label: `P${i}` });
  }

  const edges = [];
  for (let i = 1; i <= n; i++) {
    let hasOut = false;
    for (let j = 1; j <= n; j++) {
      if (i !== j && Math.random() < p) {
        edges.push({ from: i, to: j });
        hasOut = true;
      }
    }
    // Asegurar al menos 1 enlace de salida para la mayoría si es posible
    if (!hasOut && Math.random() < 0.75) {
      const target = (i % n) + 1;
      edges.push({ from: i, to: target });
    }
  }

  return {
    id: 'random_' + Date.now(),
    name: `Red Aleatoria (${n} Nodos, p=${(p * 100).toFixed(0)}%)`,
    badge: 'Generado',
    description: `Grafo sintético generado con ${n} páginas y ${edges.length} enlaces dirigidos estocásticos.`,
    recommendedD: 0.85,
    nodes,
    edges
  };
}
