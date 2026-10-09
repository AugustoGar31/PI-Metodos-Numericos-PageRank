/**
 * presentationManager.js
 * Gestor del Modo Exposición Oral con Enfoque Storytelling y Divulgación
 * Proyecto Integrador - Métodos Numéricos 2026-2
 */

/**
 * Renderiza de forma segura expresiones matemáticas con KaTeX en un elemento DOM
 * @param {HTMLElement} element Contenedor a renderizar
 */
export function renderMathInElementSafely(element) {
  if (window.renderMathInElement && element) {
    try {
      window.renderMathInElement(element, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    } catch (err) {
      console.warn('Advertencia en renderizado de KaTeX:', err);
    }
  }
}

export class PresentationManager {
  /**
   * @param {object} options
   * @param {Function} options.onJumpToLab Callback al solicitar ir al simulador con un preset
   */
  constructor(options = {}) {
    this.onJumpToLab = options.onJumpToLab || (() => {});
    this.currentSlideIndex = 0;
    this.totalSlides = 9;

    this.initDOM();
    this.bindEvents();
    this.goToSlide(0);
  }

  initDOM() {
    this.deckContainer = document.getElementById('presentation-slides-container');
    this.slides = Array.from(document.querySelectorAll('.presentation-slide'));
    this.totalSlides = this.slides.length || 9;

    this.slideNumberBadge = document.getElementById('slide-number-badge');
    this.slideProgressBar = document.getElementById('slide-progress-bar');
    this.slideBlockBadge = document.getElementById('slide-block-badge');
    this.btnPrevSlide = document.getElementById('btn-prev-slide');
    this.btnNextSlide = document.getElementById('btn-next-slide');

    // Botones de salto a Demo en Slide 6 u otras
    this.demoButtons = Array.from(document.querySelectorAll('[data-jump-lab]'));
  }

  bindEvents() {
    if (this.btnPrevSlide) {
      this.btnPrevSlide.addEventListener('click', () => this.prevSlide());
    }
    if (this.btnNextSlide) {
      this.btnNextSlide.addEventListener('click', () => this.nextSlide());
    }

    // Atajos de teclado para la presentación
    window.addEventListener('keydown', (e) => {
      const presSection = document.getElementById('presentation-section');
      if (!presSection || presSection.classList.contains('hidden')) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || (e.key === ' ' && !e.target.matches('button, input, select'))) {
        e.preventDefault();
        this.nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        this.prevSlide();
      } else if (e.key === 'Home') {
        e.preventDefault();
        this.goToSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        this.goToSlide(this.totalSlides - 1);
      }
    });

    // Botones de salto interactivo al laboratorio
    this.demoButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const presetKey = btn.getAttribute('data-jump-lab') || 'catedra4';
        this.onJumpToLab(presetKey);
      });
    });
  }

  /**
   * Cambia a una diapositiva específica y actualiza insignias de Acto Narrativo
   * @param {number} index Índice 0-based
   */
  goToSlide(index) {
    if (index < 0) index = 0;
    if (index >= this.totalSlides) index = this.totalSlides - 1;

    this.currentSlideIndex = index;

    // Actualizar visibilidad de diapositivas
    this.slides.forEach((slide, idx) => {
      if (idx === index) {
        slide.classList.remove('hidden');
        slide.classList.add('flex');
        // Renderizar KaTeX seguro en la diapositiva activa
        renderMathInElementSafely(slide);
      } else {
        slide.classList.add('hidden');
        slide.classList.remove('flex');
      }
    });

    // Actualizar indicador textual y barra de progreso
    if (this.slideNumberBadge) {
      this.slideNumberBadge.textContent = `${index + 1} / ${this.totalSlides}`;
    }

    if (this.slideProgressBar) {
      const percentage = ((index + 1) / this.totalSlides) * 100;
      this.slideProgressBar.style.width = `${percentage}%`;
    }

    // Actualizar insignia de Acto Narrativo (Storytelling)
    if (this.slideBlockBadge) {
      if (index <= 2) {
        // Slides 1, 2, 3 -> Acto 1: El Problema
        this.slideBlockBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5';
        this.slideBlockBadge.innerHTML = '<span>🎬 Acto 1: El Gran Problema de Internet (1996)</span>';
      } else if (index <= 4) {
        // Slides 4, 5 -> Acto 2: La Intuición Numérica
        this.slideBlockBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1.5';
        this.slideBlockBadge.innerHTML = '<span>🧠 Acto 2: La Intuición Numérica y el Agua</span>';
      } else if (index === 5) {
        // Slide 6 -> Acto 3: Demostración en Vivo
        this.slideBlockBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 animate-pulse';
        this.slideBlockBadge.innerHTML = '<span>🎮 Acto 3: ¡Demostración en Vivo en el Laboratorio!</span>';
      } else {
        // Slides 7, 8, 9 -> Acto 4: Batalla Numérica y Conclusiones
        this.slideBlockBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5';
        this.slideBlockBadge.innerHTML = '<span>⚖️ Acto 4: La Batalla Numérica y Conclusiones</span>';
      }
    }

    // Estado de botones anterior/siguiente
    if (this.btnPrevSlide) {
      this.btnPrevSlide.disabled = (index === 0);
      this.btnPrevSlide.style.opacity = (index === 0) ? '0.4' : '1';
    }
    if (this.btnNextSlide) {
      this.btnNextSlide.disabled = (index === this.totalSlides - 1);
      this.btnNextSlide.style.opacity = (index === this.totalSlides - 1) ? '0.4' : '1';
    }
  }

  nextSlide() {
    if (this.currentSlideIndex < this.totalSlides - 1) {
      this.goToSlide(this.currentSlideIndex + 1);
    }
  }

  prevSlide() {
    if (this.currentSlideIndex > 0) {
      this.goToSlide(this.currentSlideIndex - 1);
    }
  }

  /**
   * Refresca el renderizado KaTeX de la diapositiva actual
   */
  refreshMathRendering() {
    const currentSlide = this.slides[this.currentSlideIndex];
    if (currentSlide) {
      renderMathInElementSafely(currentSlide);
    }
  }
}
