/**
 * graphManager.js
 * Controlador de Vis-Network para visualización y manipulación interactiva de grafos
 * Proyecto Integrador - Métodos Numéricos 2026-2
 */

import { buildTransitionMatrix } from '../math/matrix.js';

export class GraphManager {
  /**
   * @param {string|HTMLElement} containerId ID del contenedor o elemento DOM
   * @param {object} callbacks Callbacks para eventos de cambio en el grafo
   */
  constructor(containerId, callbacks = {}) {
    this.container = typeof containerId === 'string' 
      ? document.getElementById(containerId) 
      : containerId;

    this.callbacks = callbacks; // onGraphChange, onSelectionChange
    this.nodes = new vis.DataSet([]);
    this.edges = new vis.DataSet([]);
    this.network = null;
    this.physicsEnabled = true;
    this.latestScores = null;

    this.initNetwork();
  }

  /**
   * Configura e inicializa la instancia de Vis-Network
   */
  initNetwork() {
    const data = {
      nodes: this.nodes,
      edges: this.edges
    };

    const options = {
      autoResize: true,
      height: '100%',
      width: '100%',
      physics: {
        enabled: this.physicsEnabled,
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -70,
          centralGravity: 0.015,
          springLength: 120,
          springConstant: 0.09,
          damping: 0.4
        },
        stabilization: {
          enabled: true,
          iterations: 150,
          updateInterval: 25
        }
      },
      interaction: {
        hover: true,
        multiselect: false,
        navigationButtons: true,
        keyboard: true,
        tooltipDelay: 100
      },
      nodes: {
        shape: 'dot',
        size: 26,
        font: {
          size: 14,
          face: 'Outfit, Inter, system-ui, sans-serif',
          color: '#f8fafc',
          strokeWidth: 3,
          strokeColor: '#0f172a'
        },
        borderWidth: 2,
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.4)',
          size: 8,
          x: 2,
          y: 2
        }
      },
      edges: {
        arrows: {
          to: {
            enabled: true,
            scaleFactor: 0.9,
            type: 'arrow'
          }
        },
        color: {
          color: '#64748b',
          highlight: '#38bdf8',
          hover: '#94a3b8'
        },
        width: 2,
        smooth: {
          enabled: true,
          type: 'curvedCW',
          roundness: 0.2
        },
        shadow: {
          enabled: false
        }
      }
    };

    this.network = new vis.Network(this.container, data, options);

    // Eventos
    this.network.on('selectNode', (params) => {
      if (this.callbacks.onSelectionChange) {
        this.callbacks.onSelectionChange(params.nodes[0] || null);
      }
    });

    this.network.on('deselectNode', () => {
      if (this.callbacks.onSelectionChange) {
        this.callbacks.onSelectionChange(null);
      }
    });

    this.network.on('dragEnd', () => {
      // fijar o permitir estabilización
    });
  }

  /**
   * Carga un preset de grafo
   * @param {object} preset Objeto con estructura { nodes, edges }
   */
  loadPreset(preset) {
    this.nodes.clear();
    this.edges.clear();
    this.latestScores = null;

    const formattedNodes = preset.nodes.map(n => ({
      id: n.id,
      label: n.label,
      originalLabel: n.label,
      color: {
        background: '#3b82f6',
        border: '#1d4ed8',
        highlight: { background: '#60a5fa', border: '#2563eb' }
      },
      size: 26
    }));

    const formattedEdges = preset.edges.map((e, index) => ({
      id: `e_${e.from}_${e.to}_${index}`,
      from: e.from,
      to: e.to
    }));

    this.nodes.add(formattedNodes);
    this.edges.add(formattedEdges);

    this.fitNetwork();

    if (this.callbacks.onGraphChange) {
      this.callbacks.onGraphChange();
    }
  }

  /**
   * Agrega un nuevo nodo a la red
   * @param {string} [customLabel] Nombre opcional para el nodo
   * @returns {number} ID del nuevo nodo
   */
  addNode(customLabel = null) {
    const existingIds = this.nodes.getIds();
    let newId = 1;
    while (existingIds.includes(newId)) {
      newId++;
    }

    const label = customLabel || `P${newId}`;
    this.nodes.add({
      id: newId,
      label,
      originalLabel: label,
      color: {
        background: '#0ea5e9',
        border: '#0284c7',
        highlight: { background: '#38bdf8', border: '#0369a1' }
      },
      size: 26
    });

    if (this.callbacks.onGraphChange) {
      this.callbacks.onGraphChange();
    }

    return newId;
  }

  /**
   * Elimina los elementos seleccionados (nodos o aristas)
   */
  removeSelected() {
    const selection = this.network.getSelection();
    if (selection.nodes.length > 0) {
      this.nodes.remove(selection.nodes);
    }
    if (selection.edges.length > 0) {
      this.edges.remove(selection.edges);
    }

    if (this.callbacks.onGraphChange) {
      this.callbacks.onGraphChange();
    }
  }

  /**
   * Agrega una arista dirigida entre dos nodos
   * @param {number|string} fromId 
   * @param {number|string} toId 
   * @returns {boolean} true si se agregó con éxito
   */
  addEdge(fromId, toId) {
    if (fromId === toId) return false; // Evitar lazos para claridad visual a menos que sea deseado
    
    // Verificar si ya existe arista dirigida idéntica
    const existing = this.edges.get({
      filter: (item) => item.from === fromId && item.to === toId
    });

    if (existing.length > 0) return false;

    this.edges.add({
      id: `e_${fromId}_${toId}_${Date.now()}`,
      from: fromId,
      to: toId
    });

    if (this.callbacks.onGraphChange) {
      this.callbacks.onGraphChange();
    }

    return true;
  }

  /**
   * Elimina todos los nodos y aristas del lienzo
   */
  clearGraph() {
    this.nodes.clear();
    this.edges.clear();
    this.latestScores = null;

    if (this.callbacks.onGraphChange) {
      this.callbacks.onGraphChange();
    }
  }

  /**
   * Activa o desactiva la simulación física
   * @param {boolean} enabled 
   */
  setPhysics(enabled) {
    this.physicsEnabled = enabled;
    this.network.setOptions({ physics: { enabled } });
  }

  /**
   * Ajusta la vista para centrar todos los nodos
   */
  fitNetwork() {
    setTimeout(() => {
      this.network.fit({
        animation: {
          duration: 600,
          easingFunction: 'easeInOutQuad'
        }
      });
    }, 150);
  }

  /**
   * Exporta la representación matricial actual del grafo
   * Mapea los IDs arbitrarios a un rango contiguo 0..N-1
   * @returns {object} Información de topología y matriz de transición M
   */
  exportAdjacencyMatrix() {
    const nodeItems = this.nodes.get();
    const edgeItems = this.edges.get();
    const n = nodeItems.length;

    if (n === 0) {
      return {
        N: 0,
        nodeIds: [],
        nodeLabels: [],
        edges: [],
        M: [],
        outDegrees: [],
        inDegrees: []
      };
    }

    // Ordenar nodos por ID ascendente para coherencia
    nodeItems.sort((a, b) => a.id - b.id);

    // Mapeo id original -> índice 0..N-1
    const idToIndex = new Map();
    const nodeIds = [];
    const nodeLabels = [];

    nodeItems.forEach((node, idx) => {
      idToIndex.set(node.id, idx);
      nodeIds.push(node.id);
      nodeLabels.push(node.originalLabel || node.label || `P${node.id}`);
    });

    // Mapear aristas a índices 0..N-1
    const mappedEdges = [];
    const outDegrees = new Array(n).fill(0);
    const inDegrees = new Array(n).fill(0);

    edgeItems.forEach(edge => {
      const fromIdx = idToIndex.get(edge.from);
      const toIdx = idToIndex.get(edge.to);

      if (fromIdx !== undefined && toIdx !== undefined) {
        mappedEdges.push({ from: fromIdx, to: toIdx });
        outDegrees[fromIdx]++;
        inDegrees[toIdx]++;
      }
    });

    // Construir la matriz de transición M (estocástica)
    const M = buildTransitionMatrix(n, mappedEdges);

    return {
      N: n,
      nodeIds,
      nodeLabels,
      edges: mappedEdges,
      M,
      outDegrees,
      inDegrees
    };
  }

  /**
   * Actualiza el renderizado del grafo visual con base en los puntajes de PageRank
   * Ajusta tamaño de nodos de forma proporcional y colorea en un gradiente térmico
   * 
   * @param {number[]} pagerankScores Vector de puntajes de PageRank ordenado por índice 0..N-1
   */
  updateGraphVisualization(pagerankScores) {
    if (!pagerankScores || pagerankScores.length === 0) return;
    this.latestScores = pagerankScores;

    const nodeItems = this.nodes.get();
    nodeItems.sort((a, b) => a.id - b.id);

    const minScore = Math.min(...pagerankScores);
    const maxScore = Math.max(...pagerankScores);
    const scoreRange = maxScore - minScore || 1;

    // Calcular ranking ordinal
    const indexedScores = pagerankScores.map((score, index) => ({ score, index }));
    indexedScores.sort((a, b) => b.score - a.score);
    const rankMap = new Map();
    indexedScores.forEach((item, rank) => {
      rankMap.set(item.index, rank + 1);
    });

    const updates = [];

    nodeItems.forEach((node, index) => {
      const score = pagerankScores[index] !== undefined ? pagerankScores[index] : 0;
      const percentage = (score * 100).toFixed(2);
      const normalizedNorm = (score - minScore) / scoreRange; // 0.0 a 1.0

      // Radio dinámico: base 22px a máximo 52px
      const size = 22 + normalizedNorm * 30;

      // Color gradiente: De azul/índigo (menor rank) a ámbar/fucsia/oro brillante (mayor rank)
      const colorScheme = this.getColorForIntensity(normalizedNorm);

      const baseLabel = node.originalLabel || `P${node.id}`;
      const rank = rankMap.get(index);

      updates.push({
        id: node.id,
        size: Math.round(size),
        label: `${baseLabel}\n#${rank} (${percentage}%)`,
        title: `<b>${baseLabel} (ID: ${node.id})</b><br>` +
               `Ranking: #${rank} de ${pagerankScores.length}<br>` +
               `PageRank (r): <b>${score.toFixed(6)}</b> (${percentage}%)<br>` +
               `Tamaño calculado: ${Math.round(size)}px`,
        color: colorScheme
      });
    });

    this.nodes.update(updates);
  }

  /**
   * Genera un esquema de color moderno acorde a la intensidad del PageRank
   * @param {number} t Valor normalizado de 0 a 1
   * @returns {object} Configuración de color para Vis-Network
   */
  getColorForIntensity(t) {
    // Gradiente:
    // t ~ 0.0: Cyan / Azul pizarra (#0284c7)
    // t ~ 0.5: Violeta vibrante (#8b5cf6)
    // t ~ 1.0: Ámbar Oro brillante (#f59e0b / #ef4444)
    if (t < 0.35) {
      return {
        background: '#0284c7',
        border: '#38bdf8',
        highlight: { background: '#0ea5e9', border: '#7dd3fc' }
      };
    } else if (t < 0.7) {
      return {
        background: '#7c3aed',
        border: '#a78bfa',
        highlight: { background: '#8b5cf6', border: '#c4b5fd' }
      };
    } else {
      return {
        background: '#ea580c',
        border: '#facc15',
        highlight: { background: '#f97316', border: '#fef08a' }
      };
    }
  }
}
