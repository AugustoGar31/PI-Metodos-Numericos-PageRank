# 🎓 GUÍA MAESTRA DE DEFENSA ORAL: PAGERANK Y MÉTODOS NUMÉRICOS
**Cátedra de Taller de Métodos Numéricos • Ciclo Lectivo 2026-2**  
*Documento Estratégico y Guion de Ensayo para Equipo de 3 Integrantes (15 Minutos Totales)*

---

## 📌 ÍNDICE RÁPIDO
1. [Nivelación Conceptual Rápida (Lectura Obligatoria para los 3)](#1-nivelación-conceptual-rápida-lectura-obligatoria-para-los-3)
2. [Estrategia General y Reglas de Oro de los 15 Minutos](#2-estrategia-general-y-reglas-de-oro-de-los-15-minutos)
3. [Reparto Detallado por Integrante (Guion, Ganchos y Pases de Posta)](#3-reparto-detallado-por-integrante)
   - [👤 Integrante 1: El Narrador Disruptivo (Min 00:00 a 05:00)](#-integrante-1-el-narrador-disruptivo-minutos-0000-a-0500)
   - [👤 Integrante 2: El Arquitecto Matemático (Min 05:00 a 10:00)](#-integrante-2-el-arquitecto-matemático-minutos-0500-a-1000)
   - [👤 Integrante 3: El Ejecutor en Vivo y Estratega (Min 10:00 a 15:00)](#-integrante-3-el-ejecutor-en-vivo-y-estratega-minutos-1000-a-1500)
4. [Banco de Preguntas Típicas del Jurado Docente y Cómo Responderlas](#4-banco-de-preguntas-típicas-del-jurado-docente-y-cómo-responderlas)
5. [Check-List Final para el Día de la Defensa](#5-check-list-final-para-el-día-de-la-defensa)

---

## 1. NIVELACIÓN CONCEPTUAL RÁPIDA (Lectura obligatoria para los 3)

Antes de memorizar una sola línea de guion, los 3 integrantes deben compartir el **mismo modelo mental** sobre qué hace este proyecto y por qué es relevante. Si un profesor interrumpe y le pregunta a cualquiera de los tres: *«¿Qué es PageRank?»*, la respuesta debe salir natural, convincente y sin titubear.

### ¿Qué es realmente PageRank en 3 minutos?
1. **Internet no es una biblioteca de libros estáticos; es una red social de recomendaciones:**
   En una biblioteca clásica, el valor de un libro depende de su contenido intrínseco o de su índice temático. En los años 90, los buscadores trataban a la web igual: contaban cuántas veces aparecía una palabra clave. Pero en la web cualquiera puede mentir o llenar una página de basura invisible. 
   Larry Page y Sergey Brin entendieron que **la información verídica no está en el texto de la página, sino en los hipervínculos que apuntan hacia ella**.

2. **La máxima central del algoritmo:**
   > *«Tu importancia en internet no depende de lo que vos decís de vos mismo, sino de quién te recomienda... y fundamentalmente, de la importancia de quien te recomienda.»*

3. **La paradoja circular transformada en ingeniería:**
   - Si para saber mi importancia necesito saber la de quien me enlaza, y para saber la de él necesito saber quién lo enlaza a él... caemos en un círculo vicioso infinito (el huevo y la gallina).
   - ¿Cómo salimos del bucle? **Modelándolo como un sistema de ecuaciones lineales $A\vec{r} = \vec{b}$**.
   - Al incorporar un factor humano de amortiguamiento ($d = 0{,}85$), garantizamos que la matriz $A$ sea **estrictamente diagonal dominante**, permitiendo que un método numérico iterativo como **Gauss-Seidel** encuentre el equilibrio estacionario exacto en pocas rondas sin colapsar jamás.

---

## 2. ESTRATEGIA GENERAL Y REGLAS DE ORO DE LOS 15 MINUTOS

### 🛑 Regla 1: PROHIBIDO LEER LA PANTALLA
Las diapositivas y el simulador son **soporte visual y escenografía** para el tribunal. Si leemos las diapositivas palabra por palabra, transmitimos inseguridad. Nuestra mirada debe estar un 80% dirigida a los ojos de los profesores y compañeros, y un 20% señalando los elementos clave proyectados.

### ⏱️ Regla 2: GESTIÓN RIGUROSA DEL TIEMPO (5 Minutos por Integrante)
- **Bloque 1 (00:00 a 05:00):** Integrante 1 (Contexto histórico, crisis del spam y el hipervínculo como voto).
- **Bloque 2 (05:00 a 10:00):** Integrante 2 (Paradoja circular, analogía del agua, factor $d$ y dominancia diagonal).
- **Bloque 3 (10:00 a 15:00):** Integrante 3 (Duelo LU vs Gauss-Seidel, demostración interactiva en vivo y conclusiones).
*Tip:* Si alguien termina a los 4:30 minutos, perfecto; deja margen para el laboratorio y preguntas. Si llega a 5:10, debe hacer el pase de posta inmediatamente.

### 🤝 Regla 3: PASES DE POSTA FLUIDOS (El Relevo de Carrera)
Nunca debe haber silencios incómodos de *"bueno, ahora le toca a mi compañero..."*. El pase de posta se hace con una **frase puente de enganche** que conecta la conclusión del tema actual con el detonante del siguiente.

### 🧍 Regla 4: LENGUAJE CORPORAL Y ROL DE APOYO ACTIVO
Mientras un compañero expone:
- Los otros dos se paran erguidos a un costado, mirando al expositor o a la pantalla con atención y asintiendo con convicción.
- Uno de los compañeros que no habla puede operar el teclado/mouse suavemente (avanzar diapositiva con flecha derecha `→` o pulsar el botón del simulador cuando el expositor dé la señal).

---

## 3. REPARTO DETALLADO POR INTEGRANTE

---

### 👤 INTEGRANTE 1: EL NARRADOR DISRUPTIVO (Minutos 00:00 a 05:00)

> **Misión:** Romper el hielo, enganchar al jurado con la historia real de la crisis de internet en 1996, y plantar la duda existencial que da origen al algoritmo.

#### a) Diapositivas a cargo
- **Slide 1:** Portada y presentación formal.
- **Slide 2:** 1996: Internet en Caos Total (Yahoo!, Altavista y la trampa del spam).
- **Slide 3:** La Idea Genial de Stanford (El hipervínculo como voto y la bibliometría científica).

#### b) Lo que debe dominar sí o sí (Territorio técnico ante el jurado)
- **Historia y falla de la primera generación de buscadores:** Saber que Yahoo! usaba curaduría manual por personas (un directorio tipo páginas amarillas que no escalaba) y Altavista hacía indexación puramente sintáctica (conteo de frecuencia de términos o *keyword density*).
- **La vulnerabilidad del spam:** Saber explicar el truco de la época: esconder texto con la misma tipografía y color del fondo (`#FFFFFF` sobre `#FFFFFF`), engañando al robot indexador.
- **Definición de grafo web:** La web modelada como un grafo dirigido $G = (V, E)$, donde los vértices $V$ son las páginas web y las aristas orientadas $E$ son los hipervínculos.
- **Dilución de autoridad:** Si una página $j$ tiene un prestigio determinado y apunta a 10 páginas distintas ($L_j = 10$), no le regala toda su autoridad a cada una: su voto se reparte equitativamente en fracciones de $\frac{1}{L_j}$.

#### c) Guion sugerido y "Ganchos" para atrapar la atención

##### 🎬 Slide 1 (Minuto 00:00 - 01:00) — Apertura y Portada
* **Cómo arrancar:** (Voz firme, sonrisa, mirando a los ojos del jurado):
  > *«Buenos días, profesores y compañeros. Hoy les queremos hacer una pregunta que cambió la historia de la tecnología: **¿Cómo dos estudiantes universitarios trabajando en un dormitorio desordenado lograron poner en orden a todo internet?**  
  > Somos el Grupo [Número/Nombre], y para nuestro Proyecto Integrador del Taller de Métodos Numéricos decidimos abordar no un ejercicio de juguete, sino el caso de estudio real más influyente del siglo XXI: **el algoritmo PageRank de Google**, resolviendo la tensión matemática entre un método directo monumental como la Factorización LU y el equilibrio iterativo de Gauss-Seidel.»*

##### 🚨 Slide 2 (Minuto 01:00 - 03:00) — El Caos de 1996 y el Spam
* **Gancho de storytelling:**
  > *«Para entender la genialidad de la solución, primero tenemos que viajar a 1996. Internet estaba al borde del colapso funcional. Los buscadores de esa época, como Yahoo!, contrataban ejércitos de personas para clasificar páginas a mano. Y los motores automáticos como Altavista cometían un error ingenuo: creían ciegamente en lo que la página decía.  
  > Si vos querías vender autos usados y salir primero en todo el planeta, bastaba con escribir al final de tu web la palabra 'autos' 500 veces en texto blanco sobre fondo blanco. El usuario humano no lo veía, pero el buscador sí, y te ponía en el puesto número uno.  
  > Esto llevó a una crisis total: **si no podemos confiar en el texto que escribe el dueño de una página, ¿en qué podemos confiar?**  
  > Y la respuesta transformó la computación: **la web no es una biblioteca de libros aislados; es una inmensa red social donde las páginas dialogan y se recomiendan a través de hipervínculos**.»*

##### 💡 Slide 3 (Minuto 03:00 - 04:45) — La Inspiración Científica y el Dilema del Voto
* **Explicación técnica y analógica:**
  > *«En 1996, dos estudiantes de posgrado en Stanford, Larry Page y Sergey Brin, se hicieron una pregunta académica: ¿cómo sabemos en la ciencia si un paper de Einstein o Newton es revolucionario? No por cuántas páginas tiene, sino por **cuántos otros científicos lo citan en sus investigaciones**.  
  > Llevaron ese principio exacto a internet: **un hipervínculo es un voto de confianza y prestigio**. Si una página te enlaza, te está recomendando.  
  > Pero enseguida chocaron contra un dilema obvio: **¿todos los votos valen lo mismo?**  
  > Por supuesto que no. No es lo mismo un enlace desde el blog personal de mi vecino que un enlace desde la portada de la BBC o la Universidad de Stanford. El voto de una página prestigiosa vale mucho más. Y si esa página prestigiosa reparte 100 enlaces, su poder se diluye proporcionalmente entre ellos.»*

#### d) Frase exacta de pase de posta al Integrante 2 (Minuto 04:45 - 05:00)
> *«Pero justo aquí aparece una trampa matemática aparentemente imposible: para saber cuánto vale el voto de una página, necesito saber cuánto valen quienes la votan a ella... y para saber cuánto valen ellos, ¡necesito saber quién los vota a ellos!  
> Para contarnos cómo los Métodos Numéricos resuelven esta paradoja circular con la elegancia del agua, le paso la palabra a mi compañero [Nombre de Integrante 2].»*

---

### 👤 INTEGRANTE 2: EL ARQUITECTO MATEMÁTICO (Minutos 05:00 a 10:00)

> **Misión:** Explicar la paradoja circular con la analogía física de los vasos comunicantes, introducir el factor humano $d = 0{,}85$ sin saturar de fórmulas áridas, y demostrar con soltura por qué Gauss-Seidel tiene el éxito garantizado.

#### a) Diapositivas a cargo
- **Slide 4:** La Paradoja del Huevo y la Gallina & La Analogía del Agua y los Vasos Comunicantes.
- **Slide 5:** El "Navegante Aburrido" (El Factor $d = 0{,}85$ y la única regla conceptual).
- **Slide 7:** La Batalla Numérica: Dominancia Diagonal Estricta y Convergencia de Gauss-Seidel.

#### b) Lo que debe dominar sí o sí (Territorio técnico ante el jurado)
- **La Paradoja Circular:** Es un problema de punto fijo autoreferencial: $\vec{r} = M \vec{r}$.
- **Spider Trap (Trampa de araña o agujero negro):** Dos o más páginas que solo se enlazan entre sí, absorbiendo toda la probabilidad de la red como un sumidero infinito.
- **Dangling Node (Nodo colgante):** Una página sin enlaces salientes ($L_j = 0$), que hace que la probabilidad se pierda del sistema si no se redistribuye como $\frac{1}{N}$.
- **El factor de amortiguamiento $d = 0{,}85$:** Modela que un navegante sigue enlaces el 85% de las veces y salta a una URL aleatoria el 15% restante.
- **Demostración de Dominancia Diagonal Estricta (¡PREGUNTA CLAVE DE FINAL/DEFENSA!):**
  - La ecuación canónica es $(I - d \cdot M)\vec{r} = \left(\frac{1-d}{N}\right) \mathbf{1} \implies A\vec{r} = \vec{b}$.
  - Elemento diagonal: $a_{ii} = 1 - d M_{ii}$ (usualmente $1$ si no hay autovínculos).
  - Suma de elementos fuera de la diagonal en la columna $j$: como las columnas de la matriz estocástica $M$ suman $1$ ($\sum_{i \neq j} M_{ij} = 1 - M_{jj}$):
    $$\sum_{i \neq j} |a_{ij}| = d \sum_{i \neq j} M_{ij} = d(1 - M_{jj})$$
  - Restando:
    $$|a_{jj}| - \sum_{i \neq j} |a_{ij}| = (1 - d M_{jj}) - d(1 - M_{jj}) = 1 - d$$
  - Como $d = 0{,}85$:
    $$1 - d = 1 - 0{,}85 = 0{,}15 > 0$$
  - **Conclusión técnica:** La matriz $A$ es **estrictamente diagonal dominante**, garantizando que el radio espectral de la matriz de iteración de Gauss-Seidel cumpla $\rho(T_{GS}) \le d < 1$. Por ende, **Gauss-Seidel converge incondicionalmente desde cualquier vector inicial**.

#### c) Guion sugerido y "Ganchos" para atrapar la atención

##### 🔄 Slide 4 (Minuto 05:00 - 06:45) — La Paradoja y el Agua
* **Cómo arrancar:**
  > *«Gracias, [Nombre 1]. Efectivamente, nos encontramos ante la clásica paradoja del huevo y la gallina. ¿Cómo resuelven los ingenieros un problema donde la causa y el efecto están interconectados en bucle? **¡Iterando con Métodos Numéricos!**  
  > Para entenderlo de forma intuitiva, no piensen en matrices abstractas; piensen en **vasos con agua conectados por mangueras**.  
  > Imaginen que cada página de internet es un vaso de vidrio, y cada enlace es una tubería que lleva agua de un vaso hacia otro.  
  > Al principio, en la iteración cero ($k=0$), llenamos todos los vasos con el mismo nivel parejo de agua ($1/N$).  
  > Luego, abrimos las canillas y dejamos que el líquido fluya libremente según hacia dónde apuntan las mangueras. En las primeras rondas el agua se mueve con fuerza; pero a medida que avanzan los ciclos, el flujo se va estabilizando de manera natural hasta que el nivel en cada vaso queda en perfecto reposo.  
  > **¡Ese nivel final de agua en cada vaso es, exactamente, el PageRank de esa página web!**»*

##### 🧑‍💻 Slide 5 (Minuto 06:45 - 08:30) — El Navegante Aburrido y la Ecuación del 85%
* **Explicación del factor humano y KaTeX:**
  > *«Sin embargo, este modelo de fluidos puros tiene una falla crítica: ¿qué pasa si dos páginas se enlazan solo entre ellas y a nadie más? Crean un 'agujero negro' que absorbe toda el agua del sistema, secando al resto de internet. En matemáticas, eso significa división por cero o pérdida de solución única.  
  > Larry y Sergey lo resolvieron modelando la conducta real de una persona frente a la computadora, a la que llamaron **el Navegante Aburrido**:  
  > - El **85% de las veces**, el usuario hace clic en los enlaces que tiene adelante.  
  > - Pero el **15% de las veces**, se cansa de navegar, va a la barra de direcciones del navegador y escribe una URL cualquiera al azar.  
  > Esto da origen a la única ecuación conceptual que gobierna la red:  
  > $$\text{Importancia} = (15\% \text{ Azar Teletransportado}) + (85\% \text{ Votos Recibidos})$$  
  > Ese 15% de agua fresca inyectada en cada ciclo evita que cualquier página quede en cero y rompe cualquier trampa circular.»*

##### ⚖️ Slide 7 (Minuto 08:30 - 09:45) — La Garantía Matemática (Dominancia Diagonal)
* **El toque de rigor para fascinar a la cátedra:**
  > *«Y aquí viene la conexión directa con lo que vimos en el aula de Métodos Numéricos. En clase aprendimos que Gauss-Seidel no es mágico: si una matriz no cumple ciertas propiedades, las iteraciones pueden divergir y tender a infinito.  
  > Pero fíjense en la belleza matemática de este problema: al plantear el sistema canónico $A\vec{r} = \vec{b}$, la diagonal principal vale $1$, mientras que la suma de los elementos restantes de la columna vale exactamente $d = 0{,}85$.  
  > Como $1 > 0{,}85$, la matriz resulta **estrictamente diagonal dominante por un margen asegurado de $0{,}15$**.  
  > Esto demuestra formalmente ante el tribunal que el radio espectral de Gauss-Seidel es estrictamente menor a uno. **No importa qué red diseñemos ni qué vector inicial elijamos: Gauss-Seidel converge siempre y de manera incondicional**.»*

#### d) Frase exacta de pase de posta al Integrante 3 (Minuto 09:45 - 10:00)
> *«Ahora bien: una cosa es demostrar la convergencia en el papel, y otra muy distinta es procesar miles de millones de páginas compitiendo contra un método directo como la Factorización LU.  
> Para librar la batalla computacional y ver nuestro simulador interactivo en plena acción, le cedo la palabra a [Nombre de Integrante 3].»*

---

### 👤 INTEGRANTE 3: EL EJECUTOR EN VIVO Y ESTRATEGA (Minutos 10:00 a 15:00)

> **Misión:** Comparar la complejidad de LU vs Gauss-Seidel con argumentos de ingeniería de software, liderar la demostración en vivo interactuando con el simulador web, presentar los aprendizajes y abrir con autoridad la ronda de preguntas.

#### a) Diapositivas a cargo
- **Slide 6:** La Batalla Numérica: Factorización LU vs Gauss-Seidel (Complejidad y memoria).
- **Slide 8:** ¡A Verlo en Acción! (Salto en vivo al laboratorio interactivo).
- **Slide 9:** Aprendizajes de Ingeniería, Transparencia Académica y Preguntas del Tribunal.

#### b) Lo que debe dominar sí o sí (Territorio técnico ante el jurado)
- **Comparación de Complejidad (Big-O):**
  - **Factorización LU:** Requiere descomponer $A = L \cdot U$. En tiempo es $\mathcal{O}(N^3)$ operaciones de punto flotante, y en memoria RAM requiere almacenar la matriz completa densa $\mathcal{O}(N^2)$.
  - **Gauss-Seidel:** En memoria solo necesita almacenar el vector de soluciones actual y la lista dispersa de aristas ($\mathcal{O}(N + |E|)$). En tiempo requiere $\mathcal{O}(k \cdot |E|)$, donde $k$ es el número de iteraciones (habitualmente menos de 20-30 rondas para $\varepsilon = 10^{-5}$).
- **Por qué LU es inviable para la Big Data real:** Si la web tiene $N = 10^{10}$ páginas, una matriz de $10^{10} \times 10^{10}$ necesitaría $10^{20}$ números flotantes (cientos de exabytes de RAM). ¡No existe hardware en el planeta que soporte eso! Gauss-Seidel, en cambio, calcula elemento por elemento actualizando en el lugar (*in-place*).
- **Criterio de Parada Ingenieril:** El algoritmo se detiene cuando el máximo error absoluto entre iteraciones consecutivas cae por debajo de la tolerancia fijada:
  $$\max_{i} |E_i| = \max_{i} |r_i^{(k+1)} - r_i^{(k)}| < \varepsilon = 10^{-5}$$
- **Manejo del Simulador Web:** Saber alternar con el botón `[ 🚀 Saltar al Laboratorio y Simular ]`, cargar los presets (4 Nodos de Cátedra, Star Hub, Spider Trap) y mostrar la tabla paso a paso de Gauss-Seidel.

#### c) Guion sugerido y "Ganchos" para atrapar la atención

##### 🥊 Slide 6 (Minuto 10:00 - 11:15) — El Duelo: Fuerza Bruta (LU) vs Equilibrio (Gauss-Seidel)
* **Cómo arrancar:**
  > *«Muchas gracias, [Nombre 2]. Cuando nos enfrentamos al sistema $A\vec{r} = \vec{b}$, como ingenieros tenemos dos caminos en la caja de herramientas:  
  > 1. **La Fuerza Bruta Directa con Factorización LU:** Intentar descomponer $A = L \cdot U$ para resolver el sistema de un solo golpe monumental.  
  > Para un grafo chico de 4 o 10 páginas, LU es fabuloso y matemáticamente exacto. Pero tiene un talón de Aquiles letal: su costo espacial de memoria es de orden $\mathcal{O}(N^2)$. Para los miles de millones de páginas de la web real, ninguna supercomputadora del mundo tiene tanta memoria RAM para guardar esa matriz.  
  > 2. **El Equilibrio Natural de Gauss-Seidel:** Es el método ganador indiscutido. Gasta memoria mínima de orden $\mathcal{O}(N)$, aprovecha que casi todas las páginas tienen enlaces dispersos, y actualiza los valores inmediatamente vaso por vaso.  
  > Si un servidor se reinicia o cambia un enlace, Gauss-Seidel no tiene que recalcular todo desde cero como LU: simplemente continúa iterando desde el último estado conocido.»*

##### 🚀 Slide 8 (Minuto 11:15 - 13:15) — ¡Demostración en Vivo en el Laboratorio!
* **Acción en el proyector:** (El expositor hace clic en el botón gigante `[ 🚀 Saltar al Laboratorio y Simular ]` o en el preset de la Slide):
  > *«Pero las palabras sobran cuando podemos ver a los números trabajar. Vamos a saltar en vivo a nuestro laboratorio interactivo desarrollado para esta presentación.*  
  > *(Señala el grafo en Vis-Network):*  
  > *Aquí tenemos el **Caso Canónico de 4 Páginas de la Cátedra**. Fíjense en cómo el nodo P3 y P4 reciben la mayor cantidad de votos cruzados.  
  > Al presionar 'Calcular PageRank', el algoritmo corre Gauss-Seidel en apenas 15 milisegundos con tolerancia $\varepsilon = 10^{-5}$.  
  > Noten dos cosas extraordinarias:*  
  > 1. *El diámetro y color de los nodos se redimensionan en tiempo real: P3 y P4 se transforman en círculos dorados gigantescos porque concentran más del 70% de la autoridad de la red.*  
  > 2. *(Abre la pestaña 'Gauss-Seidel'):* *Aquí está la tabla paso a paso idéntica a la que hacíamos en las clases prácticas, registrando los errores individuales $|E_i|$ y confirmando que la suma total de las probabilidades da exactamente 1.000000.*  
  > *(Opcional: Si el jurado pide probar otro caso):* *Podemos cargar al instante el 'Efecto Influencer (Hub)' o la 'Spider Trap' para comprobar cómo el factor de teletransporte rescata a la red del colapso.»*

##### 🎯 Slide 9 (Minuto 13:15 - 14:45) — Aprendizajes, Ética y Cierre
* **Síntesis reflexiva y cierre formal:**
  > *(Hace clic en 'Exposición Oral' en la barra superior para volver a la diapositiva final):*  
  > *«Para concluir, ¿qué nos deja este proyecto integrador como futuros profesionales?  
  > Primero: que los sistemas de ecuaciones lineales no son abstracciones de pizarrón; son el motor oculto que sostiene la infraestructura digital del planeta.  
  > Segundo: que los métodos iterativos no son aproximaciones de 'segunda categoría' frente a los métodos directos; en la era del Big Data y la Inteligencia Artificial, son la única alternativa computacionalmente viable.  
  > Tercero: el valor del criterio de parada ingenieril, decidiendo hasta qué decimal calcular sin derrochar energía ni cómputo.  
  > Queremos destacar que el código fuente completo se encuentra disponible en nuestro repositorio de GitHub y desplegado en la web para acceso libre.  
  > Quedamos a total disposición del tribunal docente para responder sus preguntas o para construir y simular en vivo cualquier red que los profesores deseen proponer. ¡Muchas gracias!»*

---

## 4. BANCO DE PREGUNTAS TÍPICAS DEL JURADO DOCENTE Y CÓMO RESPONDERLAS

Estas son las 5 preguntas que los docentes de Métodos Numéricos más suelen formular en este tipo de defensas. Léanlas y ensáyenlas entre los tres.

---

### ❓ Pregunta 1: *«¿Qué ocurre matemáticamente si fijamos el factor de amortiguamiento en $d = 1$ o en $d = 0$?»*
* **Quién responde:** Preferentemente **Integrante 2** (o cualquiera).
* **Respuesta de nivel ingenieril:**
  > *«Excelente pregunta, profesor. Los valores extremos rompen el equilibrio buscado:  
  > - **Si $d = 1$:** Eliminamos el teletransporte aleatorio ($1 - d = 0$). El sistema pasa a ser puramente el grafo original $\vec{r} = M\vec{r}$. Si la red tiene trampas cerradas (Spider Traps) o páginas sin salida (Dangling Nodes), la matriz deja de ser estrictamente diagonal dominante ($1 - d = 0$), el sistema puede volverse indeterminado o tener múltiples soluciones, y Gauss-Seidel pierde su garantía de convergencia.  
  > - **Si $d = 0$:** Eliminamos completamente la estructura de enlaces de la web. La ecuación se reduce a $\vec{r} = \frac{1}{N} \mathbf{1}$, lo que significa que todas las páginas tendrían exactamente el mismo PageRank ($1/N$), volviendo inútil al buscador porque no distinguiría qué sitio es mejor.  
  > Por eso el valor empírico de Google de $d = 0{,}85$ es el punto óptimo: retiene el 85% de la topología real de enlaces y añade el 15% necesario para asegurar convergencia estricta.»*

---

### ❓ Pregunta 2: *«¿Cómo definieron el vector de arranque inicial $\vec{r}^{(0)}$ en Gauss-Seidel y afecta en algo al resultado final?»*
* **Quién responde:** Preferentemente **Integrante 2** o **Integrante 3**.
* **Respuesta de nivel ingenieril:**
  > *«Definimos el vector inicial de manera equiprobable uniforme: $r_i^{(0)} = \frac{1}{N}$ para cada una de las $N$ páginas, de modo que la suma inicial sea $\sum r_i^{(0)} = 1$.  
  > Sin embargo, gracias al teorema de dominancia diagonal y al Teorema de Perron-Frobenius para matrices estocásticas irreducibles, **el vector inicial no altera en absoluto la solución final**.  
  > Si hubiésemos arrancado con un vector lleno de ceros o de unos, Gauss-Seidel convergería exactamente al mismo vector solución. La única diferencia radica en la cantidad de iteraciones: arrancar cerca del promedio ($\frac{1}{N}$) ahorra iteraciones y acelera el tiempo de convergencia.»*

---

### ❓ Pregunta 3: *«¿Qué representa exactamente el error en la tabla de iteraciones y cómo controlaron el criterio de parada?»*
* **Quién responde:** Preferentemente **Integrante 3**.
* **Respuesta de nivel ingenieril:**
  > *«En cada iteración $k$, calculamos para cada página el error absoluto individual:  
  > $$|E_i| = |r_i^{(k+1)} - r_i^{(k)}|$$  
  > Nuestro criterio de parada utiliza la norma infinito del vector de errores, es decir, el peor error de toda la red:  
  > $$\max_{1 \le i \le N} |E_i| < \varepsilon$$  
  > Fijamos una tolerancia por defecto de $\varepsilon = 10^{-5}$ (configurable en el panel a $10^{-3}$ o $10^{-7}$). Cuando ninguna página de internet cambia su valor en más de 0,00001 entre una ronda y la siguiente, consideramos que el sistema alcanzó el equilibrio estacionario y detenemos el bucle.»*

---

### ❓ Pregunta 4: *«¿Por qué una matriz estrictamente diagonal dominante garantiza que no haya división por cero ni divergencia en Gauss-Seidel?»*
* **Quién responde:** Preferentemente **Integrante 2**.
* **Respuesta de nivel ingenieril:**
  > *«Porque en el despeje de Gauss-Seidel para la componente $i$, siempre dividimos por el elemento de la diagonal principal $a_{ii}$:  
  > $$r_i^{(k+1)} = \frac{1}{a_{ii}} \left( b_i - \sum_{j < i} a_{ij} r_j^{(k+1)} - \sum_{j > i} a_{ij} r_j^{(k)} \right)$$  
  > En nuestro sistema, $a_{ii} = 1 - d M_{ii}$. Como las páginas rara vez se autoenlazan a sí mismas, $M_{ii} = 0$, con lo cual $a_{ii} = 1$. Nunca puede ser cero ni anularse.  
  > Además, el Teorema de Collatz y el Teorema de Gershgorin demuestran que la dominancia diagonal estricta confina los autovalores de la matriz de iteración dentro del círculo unitario complejo, forzando que su radio espectral cumpla $\rho(T_{GS}) < 1$. Esto es condición suficiente para asegurar convergencia asintótica universal.»*

---

### ❓ Pregunta 5: *«Si en el simulador agregamos una página que no apunta a nadie (dangling node), ¿por qué la suma de probabilidades no se destruye?»*
* **Quién responde:** Preferentemente **Integrante 1** o **Integrante 3**.
* **Respuesta de nivel ingenieril:**
  > *«Porque el modelo matemático implementado en nuestro código (`matrix.js`) detecta automáticamente los nodos sumidero con grado de salida cero ($L_j = 0$).  
  > Si una página no tiene enlaces salientes, su columna en la matriz de adyacencia estaría llena de ceros, lo que provocaría que en cada ronda se 'evapore' agua del sistema y la suma total fuera menor a 1.  
  > Para resolverlo, el algoritmo sustituye esa columna vacía por un vector uniforme de $\frac{1}{N}$. Esto equivale a decir que si un usuario llega a una página sin enlaces, se teletransporta automáticamente a cualquier otra página de internet con igual probabilidad, preservando la propiedad estocástica $\sum r_i = 1.000000$.»*

---

## 5. CHECK-LIST FINAL PARA EL DÍA DE LA DEFENSA

- [ ] **Servidor Levantado Previamente:** Tener corriendo en segundo plano `python -m http.server 8080` (o el despliegue en GitHub Pages listo en una pestaña de respaldo).
- [ ] **Navegador en Pantalla Completa:** Presionar la tecla `F11` o el botón de proyector en la navbar para eliminar barras de marcadores y distracciones.
- [ ] **Puntero o Mouse Ágil:** Probar que el botón `[ 🚀 Saltar al Laboratorio y Simular ]` funcione con fluidez y que se pueda volver haciendo clic en `Exposición Oral` en el menú superior.
- [ ] **Volumen de Voz y Postura:** Pecho erguido, tono seguro y voz proyectada hacia la última fila del aula.
- [ ] **Confianza Plena:** Conocen la historia, entienden la física del agua y dominan la matemática de matrices. ¡Éxitos en la defensa!
