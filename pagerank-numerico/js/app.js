/**
 * app.js
 * Controlador Principal y Orquestador del Sistema PageRank Studio
 * Arquitectura Dual: Simulador Numérico & Exposición Oral (15 Min)
 * Proyecto Integrador - Métodos Numéricos 2026-2
 */

import { buildPageRankLinearSystem, isDiagonallyDominant } from './math/matrix.js';
import { solveGaussSeidel } from './math/gaussSeidel.js';
import { solveLU } from './math/lu.js';
import { PRESETS, generateRandomGraph } from './graph/presets.js';
import { GraphManager } from './graph/graphManager.js';
import { PresentationManager, renderMathInElementSafely } from './presentation/presentationManager.js';

class PageRankApp {
  constructor() {
    this.graphManager = null;
    this.presentationManager = null;
    this.currentView = 'lab'; // 'lab' | 'presentation'

    this.currentPresetKey = 'catedra4';
    this.dampingFactor = 0.85;
    this.tolerance = 1e-5;
    this.maxIterations = 100;
    this.selectedMatrixTab = 'A'; // 'A' | 'M' | 'b'

    this.currentSystem = null;
    this.currentGSResult = null;
    this.currentLUResult = null;

    this.convergenceChart = null;
    this.scoresChart = null;

    this.initDOMReferences();
    this.initGraphManager();
    this.initPresentationManager();
    this.bindEvents();
    
    // Cargar preset inicial y calcular automáticamente
    this.loadPreset('catedra4');

    // Renderizado inicial de KaTeX en la pestaña teórica
    setTimeout(() => {
      renderMathInElementSafely(document.body);
    }, 200);
  }

  /**
   * Obtiene referencias a los elementos del DOM
   */
  initDOMReferences() {
    // Vistas Principales (Arquitectura Dual)
    this.navBtnLab = document.getElementById('nav-btn-lab');
    this.navBtnPresentation = document.getElementById('nav-btn-presentation');
    this.labSection = document.getElementById('lab-section');
    this.presentationSection = document.getElementById('presentation-section');
    this.btnToggleFullscreen = document.getElementById('btn-toggle-fullscreen');

    // Header & Global Controls
    this.presetSelect = document.getElementById('preset-select');
    this.btnCalculate = document.getElementById('btn-calculate');
    this.btnOpenTeam = document.getElementById('btn-open-team');

    // Controls Left
    this.inputDamping = document.getElementById('input-damping');
    this.labelDampingValue = document.getElementById('label-damping-value');
    this.labelTeleportRate = document.getElementById('label-teleport-rate');
    this.selectTolerance = document.getElementById('select-tolerance');
    this.inputMaxIter = document.getElementById('input-max-iter');
    this.labelInitialX0 = document.getElementById('label-initial-x0');

    // Matrix Inspection Tabs
    this.tabMatA = document.getElementById('tab-mat-A');
    this.tabMatM = document.getElementById('tab-mat-M');
    this.tabVecB = document.getElementById('tab-vec-b');
    this.matrixDisplayContainer = document.getElementById('matrix-display-container');
    this.badgeDominanceStatus = document.getElementById('badge-dominance-status');
    this.textDominanceDesc = document.getElementById('text-dominance-desc');

    // Graph Canvas & Toolbar
    this.badgeNetworkStats = document.getElementById('badge-network-stats');
    this.btnAddNode = document.getElementById('btn-add-node');
    this.btnAddEdge = document.getElementById('btn-add-edge');
    this.btnDeleteSelected = document.getElementById('btn-delete-selected');
    this.btnFitNetwork = document.getElementById('btn-fit-network');
    this.togglePhysics = document.getElementById('toggle-physics');
    this.rankingSummaryBar = document.getElementById('ranking-summary-bar');
    this.btnShowExpectedResult = document.getElementById('btn-show-expected-result');
    this.expectedResultPanel = document.getElementById('expected-result-panel');

    // Tabs Bottom
    this.tabBtnGs = document.getElementById('tab-btn-gs');
    this.tabBtnLu = document.getElementById('tab-btn-lu');
    this.tabBtnComparison = document.getElementById('tab-btn-comparison');
    this.tabBtnTheory = document.getElementById('tab-btn-theory');
    this.tabContentGs = document.getElementById('tab-content-gs');
    this.tabContentLu = document.getElementById('tab-content-lu');
    this.tabContentComparison = document.getElementById('tab-content-comparison');
    this.tabContentTheory = document.getElementById('tab-content-theory');

    // Gauss-Seidel Tab Metrics & Table
    this.metricGsIter = document.getElementById('metric-gs-iter');
    this.metricGsStatus = document.getElementById('metric-gs-status');
    this.metricGsError = document.getElementById('metric-gs-error');
    this.metricGsTime = document.getElementById('metric-gs-time');
    this.metricGsResidual = document.getElementById('metric-gs-residual');
    this.tableGaussSeidel = document.getElementById('table-gauss-seidel');
    this.btnExportCsv = document.getElementById('btn-export-csv');

    // LU Tab Metrics & Displays
    this.metricLuTime = document.getElementById('metric-lu-time');
    this.metricLuResidual = document.getElementById('metric-lu-residual');
    this.metricLuSum = document.getElementById('metric-lu-sum');
    this.containerMatrixL = document.getElementById('container-matrix-L');
    this.containerMatrixU = document.getElementById('container-matrix-U');
    this.stepsForwardSub = document.getElementById('steps-forward-sub');
    this.stepsBackSub = document.getElementById('steps-back-sub');

    // Comparison Tab Elements
    this.compGsIter = document.getElementById('comp-gs-iter');
    this.compGsTime = document.getElementById('comp-gs-time');
    this.compLuTime = document.getElementById('comp-lu-time');
    this.compGsResidual = document.getElementById('comp-gs-residual');
    this.compLuResidual = document.getElementById('comp-lu-residual');

    // Modals
    this.modalAddEdge = document.getElementById('modal-add-edge');
    this.selectEdgeFrom = document.getElementById('select-edge-from');
    this.selectEdgeTo = document.getElementById('select-edge-to');
    this.btnCloseModalEdge = document.getElementById('btn-close-modal-edge');
    this.btnCancelModalEdge = document.getElementById('btn-cancel-modal-edge');
    this.btnConfirmAddEdge = document.getElementById('btn-confirm-add-edge');

    this.modalTeam = document.getElementById('modal-team');
    this.btnCloseModalTeam = document.getElementById('btn-close-modal-team');
    this.btnOkTeam = document.getElementById('btn-ok-team');
  }

  /**
   * Inicializa el GraphManager de Vis-Network
   */
  initGraphManager() {
    this.graphManager = new GraphManager('network-container', {
      onGraphChange: () => {
        this.updateNetworkStats();
        this.updateMatrixSystem();
      },
      onSelectionChange: (selectedNodeId) => {
        // Callback para selecciones interactivas
      }
    });
  }

  /**
   * Inicializa el Gestor de la Presentación de 15 Minutos
   */
  initPresentationManager() {
    this.presentationManager = new PresentationManager({
      onJumpToLab: (presetKey) => {
        this.switchView('lab');
        if (presetKey) {
          if (this.presetSelect) {
            this.presetSelect.value = presetKey;
          }
          this.loadPreset(presetKey);
        }
      }
    });
  }

  /**
   * Asocia listeners de eventos a los controles de la UI
   */
  bindEvents() {
    // Selector de Vista Dual (Simulador vs Presentación)
    if (this.navBtnLab) {
      this.navBtnLab.addEventListener('click', () => this.switchView('lab'));
    }
    if (this.navBtnPresentation) {
      this.navBtnPresentation.addEventListener('click', () => this.switchView('presentation'));
    }

    // Toggle Pantalla Completa
    if (this.btnToggleFullscreen) {
      this.btnToggleFullscreen.addEventListener('click', () => this.toggleFullscreen());
    }

    // Preset Selector
    this.presetSelect.addEventListener('change', (e) => {
      this.loadPreset(e.target.value);
    });

    // Calculate Button
    this.btnCalculate.addEventListener('click', () => {
      if (this.currentView !== 'lab') {
        this.switchView('lab');
      }
      this.calculatePageRank();
    });

    // Damping Slider
    this.inputDamping.addEventListener('input', (e) => {
      this.dampingFactor = parseFloat(e.target.value);
      this.labelDampingValue.textContent = this.dampingFactor.toFixed(2);
      const teleportPercent = ((1 - this.dampingFactor) * 100).toFixed(0);
      this.labelTeleportRate.textContent = `Teletransporte: ${teleportPercent}%`;
      this.updateMatrixSystem();
    });

    // Tolerance Selector
    this.selectTolerance.addEventListener('change', (e) => {
      this.tolerance = parseFloat(e.target.value);
    });

    // Max Iterations
    this.inputMaxIter.addEventListener('change', (e) => {
      this.maxIterations = parseInt(e.target.value, 10) || 100;
    });

    // Matrix Inspection Tabs Switch
    this.tabMatA.addEventListener('click', () => this.switchMatrixTab('A'));
    this.tabMatM.addEventListener('click', () => this.switchMatrixTab('M'));
    this.tabVecB.addEventListener('click', () => this.switchMatrixTab('b'));

    // Canvas Toolbar Actions
    this.btnAddNode.addEventListener('click', () => {
      this.graphManager.addNode();
    });

    this.btnAddEdge.addEventListener('click', () => {
      this.openAddEdgeModal();
    });

    this.btnDeleteSelected.addEventListener('click', () => {
      this.graphManager.removeSelected();
    });

    this.btnFitNetwork.addEventListener('click', () => {
      this.graphManager.fitNetwork();
    });

    this.togglePhysics.addEventListener('change', (e) => {
      this.graphManager.setPhysics(e.target.checked);
    });

    this.btnShowExpectedResult.addEventListener('click', () => {
      this.showExpectedResult();
    });

    // Bottom Result Tabs
    this.tabBtnGs.addEventListener('click', () => this.switchResultTab('gs'));
    this.tabBtnLu.addEventListener('click', () => this.switchResultTab('lu'));
    this.tabBtnComparison.addEventListener('click', () => this.switchResultTab('comparison'));
    this.tabBtnTheory.addEventListener('click', () => this.switchResultTab('theory'));

    // Export CSV
    this.btnExportCsv.addEventListener('click', () => {
      this.exportIterationsToCSV();
    });

    // Modal Add Edge
    this.btnCloseModalEdge.addEventListener('click', () => this.closeAddEdgeModal());
    this.btnCancelModalEdge.addEventListener('click', () => this.closeAddEdgeModal());
    this.btnConfirmAddEdge.addEventListener('click', () => this.confirmAddEdge());

    // Modal Team
    this.btnOpenTeam.addEventListener('click', () => {
      this.modalTeam.classList.remove('hidden');
      this.modalTeam.classList.add('flex');
    });

    this.btnCloseModalTeam.addEventListener('click', () => {
      this.modalTeam.classList.add('hidden');
      this.modalTeam.classList.remove('flex');
    });

    this.btnOkTeam.addEventListener('click', () => {
      this.modalTeam.classList.add('hidden');
      this.modalTeam.classList.remove('flex');
    });

    // Atajo de teclado: Espacio o Enter con Ctrl para recalcular
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (this.currentView !== 'lab') this.switchView('lab');
        this.calculatePageRank();
      }
    });
  }

  /**
   * Conmuta entre la vista del Laboratorio Numérico y la Exposición Oral
   * @param {'lab'|'presentation'} view 
   */
  switchView(view) {
    this.currentView = view;

    if (view === 'lab') {
      this.labSection.classList.remove('hidden');
      this.presentationSection.classList.add('hidden');
      this.presentationSection.classList.remove('flex');

      this.navBtnLab.className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all text-sky-400 bg-sky-500/20 shadow-sm border border-sky-500/30';
      this.navBtnPresentation.className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all text-slate-400 hover:text-slate-200 border-transparent';

      // Reajustar dimensiones de la red
      setTimeout(() => {
        this.graphManager.fitNetwork();
        if (this.convergenceChart) this.convergenceChart.resize();
        if (this.scoresChart) this.scoresChart.resize();
      }, 100);
    } else {
      this.labSection.classList.add('hidden');
      this.presentationSection.classList.remove('hidden');
      this.presentationSection.classList.add('flex');

      this.navBtnPresentation.className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all text-amber-400 bg-amber-500/20 shadow-sm border border-amber-500/30';
      this.navBtnLab.className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all text-slate-400 hover:text-slate-200 border-transparent';

      // Refrescar KaTeX en la diapositiva actual
      setTimeout(() => {
        if (this.presentationManager) {
          this.presentationManager.refreshMathRendering();
        }
      }, 50);
    }
  }

  /**
   * Alterna el modo pantalla completa para proyectar en el aula
   */
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('Error al activar pantalla completa:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  /**
   * Carga un preset por su identificador
   * @param {string} presetKey 
   */
  loadPreset(presetKey) {
    this.currentPresetKey = presetKey;
    const preset = PRESETS[presetKey];
    if (!preset) return;

    if (preset.recommendedD) {
      this.dampingFactor = preset.recommendedD;
      this.inputDamping.value = this.dampingFactor;
      this.labelDampingValue.textContent = this.dampingFactor.toFixed(2);
      this.labelTeleportRate.textContent = `Teletransporte: ${((1 - this.dampingFactor) * 100).toFixed(0)}%`;
    }

    this.graphManager.loadPreset(preset);
    this.updateNetworkStats();
    this.calculatePageRank();
  }

  /**
   * Actualiza el contador de nodos y aristas en la interfaz
   */
  updateNetworkStats() {
    const topology = this.graphManager.exportAdjacencyMatrix();
    this.badgeNetworkStats.textContent = `${topology.N} Páginas • ${topology.edges.length} Enlaces`;
    const initialProb = topology.N > 0 ? (1.0 / topology.N).toFixed(6) : '0.000000';
    this.labelInitialX0.textContent = `rᵢ⁽⁰⁾ = ${initialProb}`;
  }

  /**
   * Actualiza y sincroniza el sistema matricial A y b
   */
  updateMatrixSystem() {
    const topology = this.graphManager.exportAdjacencyMatrix();
    if (topology.N === 0) {
      this.currentSystem = null;
      this.matrixDisplayContainer.innerHTML = '<span class="text-slate-500">Agrega nodos a la red</span>';
      return;
    }

    const { A, b } = buildPageRankLinearSystem(topology.M, this.dampingFactor);
    const dominance = isDiagonallyDominant(A);

    this.currentSystem = {
      N: topology.N,
      nodeIds: topology.nodeIds,
      nodeLabels: topology.nodeLabels,
      M: topology.M,
      A,
      b,
      d: this.dampingFactor,
      dominance
    };

    // Actualizar indicador de dominancia
    if (dominance.isRowDominant) {
      this.badgeDominanceStatus.className = 'p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2';
      this.textDominanceDesc.textContent = 'La matriz A es estrictamente diagonal dominante por filas. Convergencia incondicional garantizada para Gauss-Seidel.';
    } else if (dominance.isColDominant) {
      this.badgeDominanceStatus.className = 'p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2';
      this.textDominanceDesc.textContent = `La matriz A es estrictamente diagonal dominante por columnas (margen 1-d = ${(1 - this.dampingFactor).toFixed(2)}). Radio espectral ρ(T_GS) ≤ d < 1 garantiza convergencia incondicional.`;
    } else {
      this.badgeDominanceStatus.className = 'p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2';
      this.textDominanceDesc.textContent = `Radio espectral garantizado ρ(T_GS) ≤ ${this.dampingFactor.toFixed(2)} < 1. El algoritmo iterativo convergerá para cualquier vector inicial x0.`;
    }

    this.renderMatrixTable();
  }

  /**
   * Cambia la pestaña de visualización matricial (A, M, b)
   * @param {'A'|'M'|'b'} tab 
   */
  switchMatrixTab(tab) {
    this.selectedMatrixTab = tab;
    [this.tabMatA, this.tabMatM, this.tabVecB].forEach(btn => {
      btn.className = 'px-2 py-0.5 rounded text-slate-400 hover:text-slate-200 transition-all';
    });

    if (tab === 'A') {
      this.tabMatA.className = 'px-2 py-0.5 rounded text-sky-400 bg-sky-500/20 font-semibold transition-all';
    } else if (tab === 'M') {
      this.tabMatM.className = 'px-2 py-0.5 rounded text-indigo-400 bg-indigo-500/20 font-semibold transition-all';
    } else if (tab === 'b') {
      this.tabVecB.className = 'px-2 py-0.5 rounded text-emerald-400 bg-emerald-500/20 font-semibold transition-all';
    }

    this.renderMatrixTable();
  }

  /**
   * Renderiza la tabla HTML de la matriz seleccionada
   */
  renderMatrixTable() {
    if (!this.currentSystem) return;

    const { A, M, b, nodeLabels, N } = this.currentSystem;

    if (this.selectedMatrixTab === 'b') {
      let html = '<table class="border-collapse text-[11px] font-mono mx-auto">';
      html += '<thead><tr class="text-slate-400 border-b border-slate-800"><th class="px-2 py-1">Nodo</th><th class="px-2 py-1">Término Independiente bᵢ</th></tr></thead><tbody>';
      for (let i = 0; i < N; i++) {
        html += `<tr class="border-b border-slate-900/60 hover:bg-slate-900/40">
          <td class="px-2 py-1 text-slate-300 font-semibold">${nodeLabels[i]}</td>
          <td class="px-2 py-1 text-emerald-400 text-right">${b[i].toFixed(6)}</td>
        </tr>`;
      }
      html += '</tbody></table>';
      this.matrixDisplayContainer.innerHTML = html;
      return;
    }

    const matrixToDisplay = this.selectedMatrixTab === 'A' ? A : M;
    let html = '<div class="overflow-x-auto"><table class="border-collapse text-[11px] font-mono">';
    
    html += '<thead><tr class="text-slate-400 border-b border-slate-800"><th class="px-2 py-1 text-slate-500">i \\ j</th>';
    for (let j = 0; j < N; j++) {
      html += `<th class="px-2 py-1 text-center font-semibold text-slate-300">${nodeLabels[j]}</th>`;
    }
    html += '</tr></thead><tbody>';

    for (let i = 0; i < N; i++) {
      html += `<tr class="border-b border-slate-900/60 hover:bg-slate-900/40">`;
      html += `<td class="px-2 py-1 font-semibold text-slate-300">${nodeLabels[i]}</td>`;
      for (let j = 0; j < N; j++) {
        const val = matrixToDisplay[i][j];
        const isDiag = (i === j);
        const cellClass = isDiag 
          ? (this.selectedMatrixTab === 'A' ? 'text-sky-400 font-bold bg-sky-950/30' : 'text-indigo-400 font-bold') 
          : (Math.abs(val) > 1e-12 ? 'text-slate-300' : 'text-slate-600');
        html += `<td class="px-2 py-1 text-right ${cellClass}">${val.toFixed(4)}</td>`;
      }
      html += `</tr>`;
    }

    html += '</tbody></table></div>';
    this.matrixDisplayContainer.innerHTML = html;
  }

  /**
   * Ejecuta el cálculo completo de PageRank contrastando Gauss-Seidel y LU
   */
  calculatePageRank() {
    this.updateMatrixSystem();
    if (!this.currentSystem) return;

    const { A, b, N, nodeLabels } = this.currentSystem;

    if (N < 2) {
      alert('La red debe contener al menos 2 nodos para calcular PageRank.');
      return;
    }

    // 1. Resolver mediante Gauss-Seidel
    const gsResult = solveGaussSeidel(A, b, {
      tol: this.tolerance,
      maxIter: this.maxIterations
    });
    this.currentGSResult = gsResult;

    // 2. Resolver mediante Factorización LU
    const luResult = solveLU(A, b);
    this.currentLUResult = luResult;

    // 3. Actualizar Visualización del Grafo
    this.graphManager.updateGraphVisualization(luResult.solution);

    // 4. Renderizar resultados en las pestañas
    this.renderGaussSeidelResults(gsResult, nodeLabels);
    this.renderLUResults(luResult, nodeLabels);
    this.renderComparisonTable(gsResult, luResult, nodeLabels);
    this.renderCharts(gsResult, luResult, nodeLabels);
    this.renderRankingSummaryBar(luResult.solution, nodeLabels);
    this.renderExpectedResult(luResult.solution, nodeLabels);
  }

  /**
   * Renderiza métricas y tabla paso a paso de Gauss-Seidel
   */
  renderGaussSeidelResults(result, nodeLabels) {
    this.metricGsIter.textContent = result.iterations;
    this.metricGsStatus.textContent = result.converged 
      ? `Convergencia exitosa (ε < ${this.tolerance})` 
      : `Límite alcanzado (${result.iterations} iters)`;
    this.metricGsStatus.className = result.converged 
      ? 'text-[10px] text-emerald-400 font-medium mt-0.5' 
      : 'text-[10px] text-amber-400 font-medium mt-0.5';

    const lastHistoryItem = result.history[result.history.length - 1];
    const maxFinalError = lastHistoryItem.maxError !== null 
      ? lastHistoryItem.maxError.toExponential(4) 
      : '0.0';
    this.metricGsError.textContent = maxFinalError;
    this.metricGsTime.textContent = `${result.executionTimeMs.toFixed(3)} ms`;
    this.metricGsResidual.textContent = result.residualNorm.toExponential(4);

    const n = nodeLabels.length;
    let tableHtml = '<thead><tr><th class="px-3 py-2">Iter (k)</th>';
    for (let i = 0; i < n; i++) {
      tableHtml += `<th class="px-2 py-2 text-sky-400">r_${nodeLabels[i]}</th>`;
      tableHtml += `<th class="px-2 py-2 text-amber-400">|E_${nodeLabels[i]}|</th>`;
    }
    tableHtml += '<th class="px-3 py-2 text-emerald-400">Error Máx</th></tr></thead><tbody>';

    result.history.forEach((step, index) => {
      const isConvergedRow = index === result.history.length - 1 && result.converged;
      const rowClass = isConvergedRow ? 'converged-row font-semibold' : '';

      tableHtml += `<tr class="${rowClass}">`;
      tableHtml += `<td class="px-3 py-1.5 font-bold text-slate-300">${step.iter}</td>`;

      for (let i = 0; i < n; i++) {
        const val = step.values[i].toFixed(6);
        tableHtml += `<td class="px-2 py-1.5 text-slate-200">${val}</td>`;

        if (step.errors && step.errors[i] !== undefined) {
          const err = step.errors[i].toExponential(3);
          tableHtml += `<td class="px-2 py-1.5 error-col">${err}</td>`;
        } else {
          tableHtml += `<td class="px-2 py-1.5 text-slate-600 font-mono">--</td>`;
        }
      }

      const maxErrStr = step.maxError !== null ? step.maxError.toExponential(3) : '--';
      tableHtml += `<td class="px-3 py-1.5 font-bold text-emerald-400">${maxErrStr}</td>`;
      tableHtml += '</tr>';
    });

    tableHtml += '</tbody>';
    this.tableGaussSeidel.innerHTML = tableHtml;
  }

  /**
   * Renderiza matrices y pasos de la Factorización LU
   */
  renderLUResults(result, nodeLabels) {
    this.metricLuTime.textContent = `${result.executionTimeMs.toFixed(3)} ms`;
    this.metricLuResidual.textContent = result.residualNorm.toExponential(4);

    const sumVal = result.solution.reduce((a, b) => a + b, 0);
    this.metricLuSum.textContent = sumVal.toFixed(6);

    this.containerMatrixL.innerHTML = this.formatSquareMatrixHTML(result.L, nodeLabels, 'L');
    this.containerMatrixU.innerHTML = this.formatSquareMatrixHTML(result.U, nodeLabels, 'U');

    let fwdHtml = '';
    result.steps.forward.forEach(step => {
      fwdHtml += `<div class="bg-slate-900/60 p-1.5 rounded border border-slate-800/80 text-sky-300">${step}</div>`;
    });
    this.stepsForwardSub.innerHTML = fwdHtml || '<span class="text-slate-500">Sin pasos</span>';

    let backHtml = '';
    result.steps.backward.forEach(step => {
      backHtml += `<div class="bg-slate-900/60 p-1.5 rounded border border-slate-800/80 text-indigo-300">${step}</div>`;
    });
    this.stepsBackSub.innerHTML = backHtml || '<span class="text-slate-500">Sin pasos</span>';
  }

  /**
   * Formatea una matriz cuadrada L o U para su visualización
   */
  formatSquareMatrixHTML(mat, labels, type) {
    const n = mat.length;
    let html = '<div class="overflow-x-auto"><table class="border-collapse text-[11px] font-mono">';
    html += '<thead><tr class="text-slate-400 border-b border-slate-800"><th class="px-2 py-1"></th>';
    for (let j = 0; j < n; j++) {
      html += `<th class="px-2 py-1 text-center font-semibold text-slate-300">${labels[j]}</th>`;
    }
    html += '</tr></thead><tbody>';

    for (let i = 0; i < n; i++) {
      html += `<tr class="border-b border-slate-900/60">`;
      html += `<td class="px-2 py-1 font-semibold text-slate-400">${labels[i]}</td>`;
      for (let j = 0; j < n; j++) {
        const val = mat[i][j];
        const isDiag = (i === j);
        const cellClass = isDiag 
          ? (type === 'L' ? 'text-sky-400 font-bold bg-sky-950/20' : 'text-indigo-400 font-bold bg-indigo-950/20')
          : (Math.abs(val) > 1e-12 ? 'text-slate-200' : 'text-slate-600');
        html += `<td class="px-2 py-1 text-right ${cellClass}">${val.toFixed(4)}</td>`;
      }
      html += `</tr>`;
    }

    html += '</tbody></table></div>';
    return html;
  }

  /**
   * Actualiza los valores de la tabla comparativa lado a lado
   */
  renderComparisonTable(gsResult, luResult, nodeLabels) {
    this.compGsIter.textContent = `${gsResult.iterations} iteraciones`;
    this.compGsTime.textContent = `${gsResult.executionTimeMs.toFixed(3)} ms`;
    this.compLuTime.textContent = `${luResult.executionTimeMs.toFixed(3)} ms`;
    this.compGsResidual.textContent = gsResult.residualNorm.toExponential(4);
    this.compLuResidual.textContent = luResult.residualNorm.toExponential(4);
  }

  /**
   * Renderiza los gráficos interactivos de Chart.js
   */
  renderCharts(gsResult, luResult, nodeLabels) {
    // 1. Gráfico de Convergencia
    const ctxConv = document.getElementById('chart-convergence').getContext('2d');
    if (this.convergenceChart) {
      this.convergenceChart.destroy();
    }

    const iterLabels = [];
    const logErrors = [];

    gsResult.history.forEach(step => {
      if (step.iter > 0 && step.maxError !== null) {
        iterLabels.push(`k=${step.iter}`);
        const logVal = Math.log10(Math.max(step.maxError, 1e-16));
        logErrors.push(logVal);
      }
    });

    this.convergenceChart = new Chart(ctxConv, {
      type: 'line',
      data: {
        labels: iterLabels,
        datasets: [{
          label: 'Log₁₀(Error Máximo Individual)',
          data: logErrors,
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56, 189, 248, 0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 3,
          pointHoverRadius: 6,
          pointBackgroundColor: '#38bdf8',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#94a3b8', font: { family: 'Outfit', size: 11 } }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const logVal = context.parsed.y;
                const origVal = Math.pow(10, logVal).toExponential(4);
                return ` Error: ${origVal} (Log₁₀: ${logVal.toFixed(2)})`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: '#1e293b' },
            ticks: { color: '#64748b', font: { family: 'Fira Code', size: 10 } }
          },
          y: {
            grid: { color: '#1e293b' },
            ticks: { color: '#64748b', font: { family: 'Fira Code', size: 10 } },
            title: {
              display: true,
              text: 'Log₁₀(|E|)',
              color: '#94a3b8'
            }
          }
        }
      }
    });

    // 2. Gráfico de Distribución Comparativa de PageRank
    const ctxScores = document.getElementById('chart-scores-distribution').getContext('2d');
    if (this.scoresChart) {
      this.scoresChart.destroy();
    }

    const gsScores = gsResult.solution.map(v => v * 100);
    const luScores = luResult.solution.map(v => v * 100);

    this.scoresChart = new Chart(ctxScores, {
      type: 'bar',
      data: {
        labels: nodeLabels,
        datasets: [
          {
            label: 'Gauss-Seidel (%)',
            data: gsScores,
            backgroundColor: 'rgba(56, 189, 248, 0.75)',
            borderColor: '#38bdf8',
            borderWidth: 1,
            borderRadius: 4
          },
          {
            label: 'Factorización LU (%)',
            data: luScores,
            backgroundColor: 'rgba(99, 102, 241, 0.75)',
            borderColor: '#6366f1',
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#94a3b8', font: { family: 'Outfit', size: 11 } }
          },
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.dataset.label}: ${context.parsed.y.toFixed(4)}%`
            }
          }
        },
        scales: {
          x: {
            grid: { color: '#1e293b' },
            ticks: { color: '#cbd5e1', font: { family: 'Outfit', size: 11, weight: 'bold' } }
          },
          y: {
            grid: { color: '#1e293b' },
            ticks: { color: '#64748b', font: { family: 'Fira Code', size: 10 } },
            title: {
              display: true,
              text: 'PageRank (%)',
              color: '#94a3b8'
            }
          }
        }
      }
    });
  }

  /**
   * Renderiza la barra rápida de ranking debajo del lienzo del grafo
   */
  renderRankingSummaryBar(scores, labels) {
    const indexed = scores.map((val, idx) => ({ score: val, label: labels[idx] }));
    indexed.sort((a, b) => b.score - a.score);

    let html = '';
    indexed.slice(0, 4).forEach((item, rank) => {
      const percentage = (item.score * 100).toFixed(2);
      const badgeColor = rank === 0 
        ? 'border-amber-500/40 bg-amber-500/10 text-amber-300' 
        : 'border-slate-800 bg-slate-900/80 text-slate-300';
      
      html += `
        <div class="p-2 rounded-xl border ${badgeColor} flex items-center justify-between text-xs font-mono">
          <div class="flex items-center gap-1.5">
            <span class="font-bold text-sky-400">#${rank + 1}</span>
            <span class="font-sans font-semibold">${item.label}</span>
          </div>
          <span class="font-bold">${percentage}%</span>
        </div>
      `;
    });

    this.rankingSummaryBar.innerHTML = html;
  }

  /**
   * Prepara la interpretación del resultado actual para mostrarla bajo demanda.
   */
  renderExpectedResult(scores, labels) {
    const indexed = scores
      .map((score, index) => ({ score, label: labels[index] }))
      .sort((a, b) => b.score - a.score);
    const leader = indexed[0];
    const runnerUp = indexed[1];
    const preset = PRESETS[this.currentPresetKey];
    const description = preset ? preset.description : 'Esta red fue creada o modificada en el laboratorio.';

    let explanation = `En este caso, <strong class="text-emerald-300">${leader.label}</strong> queda primero con ${(leader.score * 100).toFixed(2)}% del PageRank`;
    if (runnerUp) {
      explanation += `, seguido por <strong class="text-sky-300">${runnerUp.label}</strong> con ${(runnerUp.score * 100).toFixed(2)}%`;
    }
    explanation += '. ';

    if (this.currentPresetKey === 'starHub') {
      explanation += 'Es el resultado esperado: el hub recibe enlaces desde varias páginas y concentra autoridad.';
    } else if (this.currentPresetKey === 'spiderTrap') {
      explanation += 'La trampa conserva influencia, pero el teletransporte evita que absorba toda la probabilidad.';
    } else if (this.currentPresetKey === 'danglingNode') {
      explanation += 'El nodo sin salidas no rompe el modelo: sus enlaces faltantes se redistribuyen uniformemente.';
    } else if (this.currentPresetKey === 'linearPipeline') {
      explanation += 'La estructura cíclica reparte la autoridad de forma relativamente equilibrada entre los nodos.';
    } else {
      explanation += 'La posición surge del equilibrio entre cuántos enlaces recibe cada página y la autoridad de quienes la enlazan.';
    }

    this.expectedResultPanel.innerHTML = `
      <strong class="text-white">Qué debería observarse:</strong> ${explanation}
      <span class="block mt-1 text-slate-400">${description}</span>
    `;
  }

  showExpectedResult() {
    if (!this.currentLUResult || !this.currentSystem) {
      alert('Primero ejecutá el cálculo de PageRank para interpretar el resultado.');
      return;
    }

    this.expectedResultPanel.classList.toggle('hidden');
    if (!this.expectedResultPanel.classList.contains('hidden')) {
      this.expectedResultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /**
   * Cambia las pestañas de resultados inferiores
   * @param {'gs'|'lu'|'comparison'|'theory'} tab 
   */
  switchResultTab(tab) {
    const tabs = [
      { id: 'gs', btn: this.tabBtnGs, content: this.tabContentGs },
      { id: 'lu', btn: this.tabBtnLu, content: this.tabContentLu },
      { id: 'comparison', btn: this.tabBtnComparison, content: this.tabContentComparison },
      { id: 'theory', btn: this.tabBtnTheory, content: this.tabContentTheory }
    ];

    tabs.forEach(t => {
      if (t.id === tab) {
        t.btn.classList.add('active', 'border-sky-400', 'text-sky-400');
        t.btn.classList.remove('border-transparent', 'text-slate-400');
        t.content.classList.remove('hidden');
      } else {
        t.btn.classList.remove('active', 'border-sky-400', 'text-sky-400');
        t.btn.classList.add('border-transparent', 'text-slate-400');
        t.content.classList.add('hidden');
      }
    });

    if (tab === 'comparison' && this.convergenceChart && this.scoresChart) {
      setTimeout(() => {
        this.convergenceChart.resize();
        this.scoresChart.resize();
      }, 50);
    } else if (tab === 'theory') {
      setTimeout(() => {
        renderMathInElementSafely(this.tabContentTheory);
      }, 50);
    }
  }

  /**
   * Abre el modal para crear un enlace entre páginas
   */
  openAddEdgeModal() {
    const topology = this.graphManager.exportAdjacencyMatrix();
    if (topology.N < 2) {
      alert('Se necesitan al menos 2 páginas para crear un hipervínculo.');
      return;
    }

    let optionsFrom = '';
    let optionsTo = '';
    topology.nodeIds.forEach((id, idx) => {
      const label = topology.nodeLabels[idx];
      optionsFrom += `<option value="${id}">${label} (ID: ${id})</option>`;
      optionsTo += `<option value="${id}">${label} (ID: ${id})</option>`;
    });

    this.selectEdgeFrom.innerHTML = optionsFrom;
    this.selectEdgeTo.innerHTML = optionsTo;

    if (this.selectEdgeTo.options.length > 1) {
      this.selectEdgeTo.selectedIndex = 1;
    }

    this.modalAddEdge.classList.remove('hidden');
    this.modalAddEdge.classList.add('flex');
  }

  /**
   * Cierra el modal de agregar enlace
   */
  closeAddEdgeModal() {
    this.modalAddEdge.classList.add('hidden');
    this.modalAddEdge.classList.remove('flex');
  }

  /**
   * Confirma la creación del nuevo enlace en el grafo
   */
  confirmAddEdge() {
    const fromId = parseInt(this.selectEdgeFrom.value, 10);
    const toId = parseInt(this.selectEdgeTo.value, 10);

    if (fromId === toId) {
      alert('Selecciona dos páginas distintas para el enlace.');
      return;
    }

    const added = this.graphManager.addEdge(fromId, toId);
    if (!added) {
      alert('Ese enlace ya existe en la red.');
      return;
    }

    this.closeAddEdgeModal();
    this.updateNetworkStats();
    this.calculatePageRank();
  }

  /**
   * Exporta la tabla completa de iteraciones de Gauss-Seidel a archivo CSV
   */
  exportIterationsToCSV() {
    if (!this.currentGSResult || !this.currentSystem) {
      alert('Primero ejecuta un cálculo para exportar los datos.');
      return;
    }

    const { nodeLabels, N } = this.currentSystem;
    const history = this.currentGSResult.history;

    let csvContent = 'data:text/csv;charset=utf-8,';
    
    const headers = ['Iteracion'];
    for (let i = 0; i < N; i++) {
      headers.push(`X_${nodeLabels[i]}`);
      headers.push(`Error_${nodeLabels[i]}`);
    }
    headers.push('Error_Maximo');
    csvContent += headers.join(',') + '\r\n';

    history.forEach(step => {
      const row = [step.iter];
      for (let i = 0; i < N; i++) {
        row.push(step.values[i].toFixed(8));
        if (step.errors && step.errors[i] !== undefined) {
          row.push(step.errors[i].toExponential(6));
        } else {
          row.push('');
        }
      }
      row.push(step.maxError !== null ? step.maxError.toExponential(6) : '');
      csvContent += row.join(',') + '\r\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pagerank_gauss_seidel_iteraciones_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.pageRankApp = new PageRankApp();
});
