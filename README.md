# PageRank Studio: Gauss-Seidel vs Factorización LU
**Proyecto Integrador • Taller de Métodos Numéricos (Ciclo 2026-2)**

Sistema web interactivo y educativo para el modelado riguroso del algoritmo **PageRank de Google** como un problema canónico de resolución de sistemas de ecuaciones lineales $A \cdot r = b$, contrastando el método iterativo de **Gauss-Seidel** con el método directo de **Factorización LU (Doolittle)**.

---

## 🚀 Cómo Ejecutar la Aplicación

No se requieren compiladores pesados ni dependencias complejas de backend.

### Opción 1: Servidor Local (Recomendado para ES6 Modules)
En una terminal en la carpeta del proyecto, ejecuta:
```bash
# Con Python 3
python -m http.server 8080

# O con Node.js / npx
npx serve .
```
Luego abre en tu navegador:
👉 **[http://localhost:8080/pagerank-numerico/index.html](http://localhost:8080/pagerank-numerico/index.html)** (o simplemente `http://localhost:8080`)

### Opción 2: VS Code Live Server
Haz clic derecho sobre `pagerank-numerico/index.html` y selecciona **"Open with Live Server"**.

---

## 📐 Formulación Matemática del Modelo

### 1. Matriz de Transición Estocástica ($M$)
Dada una red de $N$ nodos:
- Si un nodo $j$ apunta al nodo $i$ y tiene $L_j$ hipervínculos salientes:
  $$M_{ij} = \frac{1}{L_j}$$
- Si un nodo $j$ no tiene enlaces salientes (*dangling node*):
  $$M_{ij} = \frac{1}{N} \quad \forall i$$
Esto garantiza que cada columna de $M$ sume exactamente $1$ (matriz estocástica por columnas).

### 2. Formulación Canónica del Sistema Lineal
Incorporando el factor de amortiguamiento $d \in (0, 1)$ (típicamente $d = 0.85$):
$$r = d \cdot M \cdot r + \frac{1 - d}{N} \mathbf{1}$$

Reordenando algebraicamente:
$$(I - d \cdot M) r = \frac{1 - d}{N} \mathbf{1}$$

Definiendo:
$$A = I - d \cdot M \qquad \text{y} \qquad b = \frac{1 - d}{N} \mathbf{1}$$

Se obtiene el sistema canónico:
$$A \cdot r = b$$

### 3. Garantía Teórica de Convergencia
- Para cada columna $j$:
  $$\sum_{i \ne j} |a_{ij}| = d \sum_{i \ne j} M_{ij} = d (1 - M_{jj})$$
  $$|a_{jj}| = 1 - d \cdot M_{jj}$$
  $$|a_{jj}| - \sum_{i \ne j} |a_{ij}| = 1 - d > 0$$
- La matriz $A$ es **estrictamente diagonal dominante por columnas** con margen garantizado de al menos $1 - d$.
- El radio espectral de la matriz de iteración de Gauss-Seidel cumple $\rho(T_{GS}) \le d < 1$, asegurando **convergencia incondicional** para cualquier vector inicial $r^{(0)}$.

---

## 🔬 Métodos Numéricos Implementados

### 1. Método Iterativo: Gauss-Seidel
- Despeje de la diagonal:
  $$r_i^{(k+1)} = \frac{b_i - \sum_{j < i} a_{ij} r_j^{(k+1)} - \sum_{j > i} a_{ij} r_j^{(k)}}{a_{ii}}$$
- Errores absolutos individuales:
  $$|E_i| = |r_i^{(k+1)} - r_i^{(k)}|$$
- Criterio de parada:
  $$\max_{i} |E_i| < \text{tol}$$
- Generación de tabla paso a paso idéntica al formato de cursado y exportación a CSV.

### 2. Método Directo: Factorización LU (Doolittle)
- Descomposición $A = L \cdot U$ con $\text{diag}(L) = 1$.
- Sustitución progresiva (hacia adelante): $L \cdot y = b$.
- Sustitución regresiva (hacia atrás): $U \cdot r = y$.
- Evaluación del residuo: $\|A \cdot r - b\|_2$.

---

## 📂 Estructura del Proyecto

```
pagerank-numerico/
├── index.html                   # Interfaz interactiva y layout de 3 paneles
├── css/
│   └── styles.css               # Estilos personalizados, glassmorphism y tablas
└── js/
    ├── math/
    │   ├── matrix.js            # Álgebra lineal, normas, dominancia y formulación
    │   ├── gaussSeidel.js       # Solucionador iterativo con tabla de iteraciones
    │   └── lu.js                # Factorización LU Doolittle y sustituciones
    ├── graph/
    │   ├── presets.js           # Grafos predefinidos (Cátedra 4 nodos, Hub, Spider Trap, etc.)
    │   └── graphManager.js      # Controlador de Vis-Network y escalado térmico
    └── app.js                   # Controlador central, UI listeners y gráficos Chart.js
```

---

## 📊 Caso de Estudio Cátedra (4 Nodos)

Para la red canónica:
- Nodo 1 $\to$ 2, 3
- Nodo 2 $\to$ 4
- Nodo 3 $\to$ 1, 2, 4
- Nodo 4 $\to$ 3

Con factor $d = 0.85$, se obtiene:
- **Página 1:** $r_1 \approx 0.138673$ (13.87%)
- **Página 2:** $r_2 \approx 0.197608$ (19.76%)
- **Página 3:** $r_3 \approx 0.357080$ (35.71%) — **#1 Líder**
- **Página 4:** $r_4 \approx 0.306640$ (30.66%) — **#2**
- **Suma de PageRank:** $\sum r_i = 1.000000$ (exacto)
- **Gauss-Seidel:** Convergencia en ~21-36 iteraciones con residuo $< 10^{-6}$.
- **Factorización LU:** Residuo de máquina $\sim 3.4 \times 10^{-17}$.
