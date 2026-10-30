# Proyecto Integrador — Algoritmo PageRank con Métodos Numéricos

**Universidad Católica de Córdoba • Facultad de Ingeniería**  
**Materia:** Taller de Métodos Numéricos (2.° Año — Ingeniería en Informática, Ciclo 2026-2)

**Integrantes del grupo:**
- Augusto García Lalliya (2509312)
- Mateo García (2527199)
- Joaquín Mármol (2514908)

---

## 📌 ¿De qué trata este proyecto?

En este trabajo analizamos y resolvemos cómo funciona el algoritmo **PageRank** (el que usó originalmente Google para ordenar páginas web por importancia) llevándolo a un sistema de ecuaciones lineales de la forma **$A \cdot r = b$**.

La idea principal es entender cómo los enlaces entre páginas funcionan como "votos de confianza" y comparar dos métodos que vimos en la materia para resolver el sistema:
1. **Factorización LU de Doolittle (Método Directo):** descompone la matriz en dos triangulares ($L$ y $U$) para encontrar la solución exacta en una cantidad fija de pasos.
2. **Método de Gauss-Seidel (Método Iterativo):** arranca con un vector inicial y va aproximando el resultado vuelta tras vuelta hasta que el error sea menor a la tolerancia fijada ($\varepsilon$).

Además del desarrollo en papel, armamos una **aplicación web interactiva** para simular redes en vivo, ver las tablas de cálculo y usarla como soporte durante nuestra **presentación oral de 10 minutos**.

---

## 💻 ¿Qué incluye la aplicación web?

La página está dividida en dos modos que se pueden alternar con un clic arriba a la derecha:

### 1. 🔬 Modo Laboratorio (Simulador Numérico)
Es el espacio para probar el modelo y ver todas las cuentas:
- **Editor de grafos en vivo:** podés agregar o borrar páginas y flechas a mano, o cargar casos ya armados (*Caso de estudio de 4 nodos*, *Red Estrella/Hub*, *Spider Trap* o *Red Aleatoria*). Al calcular, los nodos se agrandan según el ranking que obtuvieron.
- **Matrices paso a paso:** muestra cómo queda armada la matriz de transición $M$, la matriz del sistema $A = I - d \cdot M$ y el vector independiente $b$.
- **Tabla de Gauss-Seidel:** muestra iteración por iteración cómo van cambiando los valores de cada nodo ($r_i$) y cómo baja el error aproximado $|E_i|$ hasta converger (también permite descargar la tabla en CSV).
- **Resolución por LU:** muestra las matrices $L$ y $U$, la sustitución hacia adelante ($L \cdot y = b$) y la sustitución hacia atrás ($U \cdot r = y$).
- **Comparación y gráficos:** compara el tiempo de cálculo y la memoria que usa cada método, junto con el gráfico de caída del error en cada iteración.

### 2. 📽️ Modo Exposición Oral (Presentación de 10 minutos)
Para no usar un PowerPoint aparte, integramos las diapositivas dentro de la misma web pensadas para una **defensa oral de 10 minutos**:
- **Parte 1 — El problema y la idea de Google (~3 min):** cómo buscaban las páginas en 1996, el problema del spam de palabras clave y cómo llevar los enlaces de una red a la matriz de transición $M$.
- **Parte 2 — El modelo matemático y la convergencia (~3 min):** el problema de las trampas de enlaces (*Spider Traps*), el factor del navegante aleatorio ($d = 0,85$), cómo se despeja el sistema $A \cdot r = b$ y por qué la dominancia diagonal asegura que Gauss-Seidel siempre converja.
- **Parte 3 — Prueba en vivo y LU vs. Gauss-Seidel (~4 min):** botón directo para saltar al simulador, probar el caso de 4 nodos en vivo, comparar ambos métodos y cerrar con las conclusiones sobre por qué en redes gigantes conviene usar métodos iterativos.

---

## 🧮 Resumen rápido de las fórmulas

1. **Matriz de transición ($M$):** cada columna $j$ reparte su peso en partes iguales entre sus enlaces salientes ($1 / L_j$). Si una página no tiene enlaces de salida (*nodo sin salida*), se reparte $1 / N$ a toda la red.
2. **Factor de amortiguamiento ($d = 0,85$):** representa que el usuario sigue enlaces el 85 % de las veces y el 15 % restante salta al azar a cualquier página de la red.
3. **Sistema lineal ($A \cdot r = b$):**
   $$(I - d \cdot M) \cdot r = \frac{1 - d}{N} \cdot \mathbf{1}$$
   Donde $A = I - d \cdot M$ es la matriz de coeficientes, $r$ es el vector de rankings que buscamos y $b$ es el vector constante de salto aleatorio.

---

## 🚀 Cómo abrir el proyecto en tu computadora

No hace falta instalar nada pesado. Como el código está separado en módulos de JavaScript, lo ideal es abrirlo con un servidor local simple desde la carpeta del proyecto:

```bash
# Opción 1: Si tenés Python instalado
python -m http.server 8080

# Opción 2: Si tenés Node.js instalado
npx serve .
```

Después entrás desde el navegador a:  
👉 **[http://localhost:8080/pagerank-numerico/index.html](http://localhost:8080/pagerank-numerico/index.html)**

*(También podés abrirlo con la extensión **Live Server** de VS Code haciendo clic derecho en `pagerank-numerico/index.html` → "Open with Live Server").*

---

## 📂 Organización de las carpetas

```text
pagerank-numerico/
├── index.html                     # Página principal (Laboratorio + Presentación)
├── css/
│   └── styles.css                 # Estilos de la interfaz y las diapositivas
└── js/
    ├── math/
    │   ├── matrix.js              # Armado de las matrices M, A y vector b
    │   ├── gaussSeidel.js         # Algoritmo de Gauss-Seidel y tabla de errores
    │   └── lu.js                  # Algoritmo de Factorización LU (Doolittle)
    ├── graph/
    │   ├── presets.js             # Redes de prueba (4 nodos, Hub, Spider Trap)
    │   └── graphManager.js        # Dibujo interactivo del grafo con Vis-Network
    ├── presentation/
    │   └── presentationManager.js # Manejo de diapositivas y cronómetro de exposición
    └── app.js                     # Conecta los botones, tablas y gráficos en pantalla
```
