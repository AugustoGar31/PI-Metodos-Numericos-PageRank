# PageRank: Modelado Numérico en Ingeniería (Gauss-Seidel vs Factorización LU)
**Proyecto Integrador • Taller de Métodos Numéricos (Ciclo 2026-2)**

Sistema web interactivo y pedagógico bajo **arquitectura dual**:
1. 🔬 **Modo Laboratorio**: Simulador interactivo completo para modelar el algoritmo **PageRank de Google** como un problema canónico de resolución de sistemas de ecuaciones lineales $A \cdot \vec{r} = \vec{b}$, contrastando el método iterativo de **Gauss-Seidel** con el método directo de **Factorización LU (Doolittle)** sobre grafos de páginas web en tiempo real.
2. 📽️ **Modo Exposición Oral (15 Minutos)**: Presentación interactiva de 9 diapositivas cinematográficas diseñada específicamente para la defensa oral del proyecto ante el jurado docente, con renderizado matemático vectorial de alta fidelidad mediante **KaTeX**.

---

## 🚀 Cómo Ejecutar la Aplicación

No se requieren compiladores pesados ni dependencias de backend.

### Servidor Local (Recomendado para ES6 Modules)
En una terminal en la carpeta del proyecto, ejecuta:
```bash
# Con Python 3
python -m http.server 8080

# O con Node.js / npx
npx serve .
```
Luego abre en tu navegador:
👉 **[http://localhost:8080/pagerank-numerico/index.html](http://localhost:8080/pagerank-numerico/index.html)** (o simplemente `http://localhost:8080`)

---

## 🏛️ Arquitectura Dual del Sistema

### 1. 🔬 Modo Laboratorio Numérico
- **Manipulación de Grafos**: Interfaz interactiva mediante Vis-Network para agregar/eliminar páginas y enlaces dirigidos.
- **Escalado Dinámico**: El radio de cada nodo y su color en gradiente térmico (Cyan $\to$ Violeta $\to$ Oro) reflejan en tiempo real su puntaje de PageRank.
- **Inspección Matricial**: Visualizador interactivo de la matriz estocástica $M$, la matriz del sistema $A = I - d \cdot M$ y el vector $\vec{b} = \frac{1-d}{N} \mathbf{1}$.
- **Gauss-Seidel Paso a Paso**: Tabla de iteraciones idéntica al formato de cursado con componentes $r_i$ y errores absolutos individuales $|E_i| = |r_i^{(k+1)} - r_i^{(k)}|$, junto a botón de exportación en **CSV**.
- **Factorización LU (Doolittle)**: Descomposición $A = L \cdot U$ con $\text{diag}(L) = 1$, sustitución hacia adelante $L \vec{y} = \vec{b}$ y sustitución hacia atrás $U \vec{r} = \vec{y}$.
- **Comparador y Gráficos Chart.js**: Comparación de complejidad, residuo cuadrático $\|A\vec{r} - \vec{b}\|_2$, tiempo en milisegundos y curvas de convergencia logarítmica $\log_{10}(|E|)$.

### 2. 📽️ Modo Exposición Oral (Enfoque Storytelling y Divulgación)
- **9 Diapositivas Estructuradas en 4 Actos Narrativos**:
  - **🎬 Acto 1: El Problema (Min 0 a 4 - Diapositivas 1-3)**:
    - *Slide 1 (Portada y Presentación)*: "La Arquitectura Matemática de la Web: Modelado y Resolución Numérica de PageRank". Cátedra F (Taller de Métodos Numéricos) e Integrantes: Augusto Garcia, Mateo Garcia, Joaquin Marmol.
    - *Slide 2 (Internet en 1996)*: El caos de Yahoo! y Altavista, la trampa del spam en texto blanco, y el cambio de paradigma hacia la red social de hipervínculos.
    - *Slide 3 (La Idea Genial)*: Inspiración en la bibliometría académica y citas científicas. El hipervínculo como voto democrático de confianza y el dilema de ponderación de votos.
  - **🧠 Acto 2: La Intuición Numérica (Min 4 a 8 - Diapositivas 4-5)**:
    - *Slide 4 (La Paradoja del Huevo y la Gallina)*: Trampa circular resuelta con Métodos Numéricos. **La Analogía del Agua y los Vasos Comunicantes** (nivel inicial parejo, canillas abiertas y equilibrio estacionario).
    - *Slide 5 (El "Navegante Aburrido")*: Evitando agujeros negros (*Spider Traps*) con el factor $d = 0{,}85$. La única fórmula conceptual: $\text{Importancia} = (15\% \text{ Azar}) + (85\% \text{ Votos Recibidos})$.
  - **🎮 Acto 3: Demostración en Vivo (Min 8 a 12 - Diapositiva 6)**:
    - Presentación interactiva de casos de estudio (4 Nodos, Efecto Hub, Trampa Rota) y botón gigante `[ 🚀 Saltar al Laboratorio y Simular ]` para alternar fluidamente al simulador numérico y volver con un clic.
  - **⚖️ Acto 4: La Batalla Numérica y Cierre (Min 12 a 15 - Diapositivas 7-9)**:
    - *Slide 7 (La Batalla)*: ¿Fuerza bruta matricial ($\text{LU}$ en $\mathcal{O}(N^2)$ memoria RAM imposible en la web masiva) o equilibrio natural de fluidos ($\text{Gauss-Seidel}$ en $\mathcal{O}(N)$ autocorrección escalable a nivel planetario)?
    - *Slide 8 (Aprendizajes de Ingeniería)*: De la realidad al sistema $A\vec{r}=\vec{b}$, valor de los métodos iterativos en Big Data, control con criterio de parada $E_a < \varepsilon$ y nota de transparencia académica.
    - *Slide 9 (Preguntas del Tribunal)*: Espacio abierto para evaluar dudas, probar grafos arbitrarios propuestos por el jurado docente, con enlaces directos al Repositorio de GitHub y despliegue online en GitHub Pages.
- **Renderizado Matemático KaTeX**: Expresiones nítidas, limpias y sin sobrecarga innecesaria en pantalla.
- **Control por Teclado y Pantalla Completa**: Navegación ágil con flechas `← / →`, barra espaciadora y modo proyector.

> 📖 **Guía de Exposición y Ensayo para el Equipo:**  
> Consulta [`GUIA_EXPOSICION_ORAL.md`](./GUIA_EXPOSICION_ORAL.md) para el reparto exacto de los 15 minutos en 3 integrantes, guiones con storytelling, ganchos de atención, pases de posta y el banco de respuestas a preguntas del jurado docente.

---

## 📐 Formulación Matemática del Modelo

### 1. Matriz de Transición Estocástica ($M$)
Dada una red de $N$ nodos:
$$M_{ij} = \begin{cases} \dfrac{1}{L_j} & \text{si existe enlace } j \to i \\ \dfrac{1}{N} & \text{si } L_j = 0 \text{ (dangling node)} \end{cases}$$

### 2. Formulación Canónica del Sistema Lineal
Incorporando el factor de amortiguamiento $d = 0{,}85$:
$$\vec{r} = d \cdot M \vec{r} + \left(\frac{1 - d}{N}\right) \mathbf{1} \iff (I - d \cdot M) \vec{r} = \left(\frac{1 - d}{N}\right) \mathbf{1}$$

Definiendo:
$$A = I - d \cdot M \qquad \text{y} \qquad \vec{b} = \left(\frac{1 - d}{N}\right) \mathbf{1}$$

Se obtiene:
$$A \cdot \vec{r} = \vec{b}$$

### 3. Garantía Teórica de Convergencia
Como las columnas de $M$ suman 1:
$$|a_{jj}| - \sum_{i \ne j} |a_{ij}| = (1 - d M_{jj}) - d(1 - M_{jj}) = 1 - d > 0$$
La matriz $A$ es **estrictamente diagonal dominante por columnas** con margen garantizado de al menos $1 - d = 0{,}15 > 0$, y el radio espectral de Gauss-Seidel cumple $\rho(T_{GS}) \le d < 1$. Por lo tanto, Gauss-Seidel tiene **convergencia incondicional garantizada** para cualquier vector inicial $\vec{r}^{(0)}$.

---

## 📂 Estructura de Archivos

```
pagerank-numerico/
├── index.html                   # Interfaz dual: Simulador y Exposición Oral
├── css/
│   └── styles.css               # Estilos modernos, KaTeX, diapositivas y cronómetro
└── js/
    ├── math/
    │   ├── matrix.js            # Álgebra lineal, normas, dominancia y formulación
    │   ├── gaussSeidel.js       # Solucionador iterativo con tabla e historial |Ei|
    │   └── lu.js                # Factorización LU Doolittle y sustituciones
    ├── graph/
    │   ├── presets.js           # Grafos predefinidos (Cátedra 4 nodos, Hub, Spider Trap, etc.)
    │   └── graphManager.js      # Controlador de Vis-Network y escalado térmico
    ├── presentation/
    │   └── presentationManager.js # Gestor de diapositivas, cronómetro 15 min y KaTeX
    └── app.js                   # Controlador global, orquestador de vistas y gráficos
```
