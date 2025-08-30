import React from 'react';

/**
 * Animation System - Tunisia Jockey Club
 * Système d'animations avancées avec support des préférences d'accessibilité
 */

export type AnimationType = 
  | 'fadeIn' | 'fadeOut' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight'
  | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight'
  | 'scaleIn' | 'scaleOut' | 'bounce' | 'shake' | 'pulse' | 'heartbeat'
  | 'rotateIn' | 'rotateOut' | 'flipX' | 'flipY' | 'wobble' | 'swing'
  | 'zoomIn' | 'zoomOut' | 'rollIn' | 'rollOut'
  | 'lightSpeedIn' | 'lightSpeedOut';

export type AnimationEasing = 
  | 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out'
  | 'cubic-bezier-smooth' | 'cubic-bezier-bounce' | 'cubic-bezier-elastic';

export interface AnimationConfig {
  duration: number;
  delay: number;
  easing: AnimationEasing;
  iterations: number | 'infinite';
  direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode: 'none' | 'forwards' | 'backwards' | 'both';
  respectReducedMotion: boolean;
}

export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  duration: 300,
  delay: 0,
  easing: 'ease-out',
  iterations: 1,
  direction: 'normal',
  fillMode: 'both',
  respectReducedMotion: true,
};

export const EASING_FUNCTIONS = {
  linear: 'linear',
  ease: 'ease',
  'ease-in': 'ease-in',
  'ease-out': 'ease-out',
  'ease-in-out': 'ease-in-out',
  'cubic-bezier-smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  'cubic-bezier-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  'cubic-bezier-elastic': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
};

export const ANIMATION_KEYFRAMES = {
  // Fade animations
  fadeIn: `
    @keyframes tjc-fadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
  `,
  fadeOut: `
    @keyframes tjc-fadeOut {
      0% { opacity: 1; }
      100% { opacity: 0; }
    }
  `,
  fadeInUp: `
    @keyframes tjc-fadeInUp {
      0% { opacity: 0; transform: translateY(30px); }
      100% { opacity: 1; transform: translateY(0); }
    }
  `,
  fadeInDown: `
    @keyframes tjc-fadeInDown {
      0% { opacity: 0; transform: translateY(-30px); }
      100% { opacity: 1; transform: translateY(0); }
    }
  `,
  fadeInLeft: `
    @keyframes tjc-fadeInLeft {
      0% { opacity: 0; transform: translateX(-30px); }
      100% { opacity: 1; transform: translateX(0); }
    }
  `,
  fadeInRight: `
    @keyframes tjc-fadeInRight {
      0% { opacity: 0; transform: translateX(30px); }
      100% { opacity: 1; transform: translateX(0); }
    }
  `,

  // Slide animations
  slideUp: `
    @keyframes tjc-slideUp {
      0% { transform: translateY(100%); }
      100% { transform: translateY(0); }
    }
  `,
  slideDown: `
    @keyframes tjc-slideDown {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(0); }
    }
  `,
  slideLeft: `
    @keyframes tjc-slideLeft {
      0% { transform: translateX(100%); }
      100% { transform: translateX(0); }
    }
  `,
  slideRight: `
    @keyframes tjc-slideRight {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(0); }
    }
  `,

  // Scale animations
  scaleIn: `
    @keyframes tjc-scaleIn {
      0% { opacity: 0; transform: scale(0.3); }
      50% { opacity: 1; }
      100% { transform: scale(1); }
    }
  `,
  scaleOut: `
    @keyframes tjc-scaleOut {
      0% { transform: scale(1); }
      50% { opacity: 1; }
      100% { opacity: 0; transform: scale(0.3); }
    }
  `,

  // Bounce and effects
  bounce: `
    @keyframes tjc-bounce {
      0%, 20%, 53%, 80%, 100% { transform: translate3d(0, 0, 0); }
      40%, 43% { transform: translate3d(0, -30px, 0); }
      70% { transform: translate3d(0, -15px, 0); }
      90% { transform: translate3d(0, -4px, 0); }
    }
  `,
  shake: `
    @keyframes tjc-shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
      20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
  `,
  pulse: `
    @keyframes tjc-pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `,
  heartbeat: `
    @keyframes tjc-heartbeat {
      0% { transform: scale(1); }
      14% { transform: scale(1.3); }
      28% { transform: scale(1); }
      42% { transform: scale(1.3); }
      70% { transform: scale(1); }
    }
  `,

  // Rotation animations
  rotateIn: `
    @keyframes tjc-rotateIn {
      0% { opacity: 0; transform: rotate(-200deg); }
      100% { opacity: 1; transform: rotate(0); }
    }
  `,
  rotateOut: `
    @keyframes tjc-rotateOut {
      0% { opacity: 1; transform: rotate(0); }
      100% { opacity: 0; transform: rotate(200deg); }
    }
  `,
  wobble: `
    @keyframes tjc-wobble {
      0% { transform: translateX(0%); }
      15% { transform: translateX(-25%) rotate(-5deg); }
      30% { transform: translateX(20%) rotate(3deg); }
      45% { transform: translateX(-15%) rotate(-3deg); }
      60% { transform: translateX(10%) rotate(2deg); }
      75% { transform: translateX(-5%) rotate(-1deg); }
      100% { transform: translateX(0%); }
    }
  `,
  swing: `
    @keyframes tjc-swing {
      20% { transform: rotate(15deg); }
      40% { transform: rotate(-10deg); }
      60% { transform: rotate(5deg); }
      80% { transform: rotate(-5deg); }
      100% { transform: rotate(0deg); }
    }
  `,

  // Flip animations
  flipX: `
    @keyframes tjc-flipX {
      0% { transform: perspective(400px) rotateX(90deg); opacity: 0; }
      40% { transform: perspective(400px) rotateX(-20deg); }
      60% { transform: perspective(400px) rotateX(10deg); opacity: 1; }
      80% { transform: perspective(400px) rotateX(-5deg); }
      100% { transform: perspective(400px) rotateX(0deg); opacity: 1; }
    }
  `,
  flipY: `
    @keyframes tjc-flipY {
      0% { transform: perspective(400px) rotateY(90deg); opacity: 0; }
      40% { transform: perspective(400px) rotateY(-20deg); }
      60% { transform: perspective(400px) rotateY(10deg); opacity: 1; }
      80% { transform: perspective(400px) rotateY(-5deg); }
      100% { transform: perspective(400px) rotateY(0deg); opacity: 1; }
    }
  `,

  // Zoom animations
  zoomIn: `
    @keyframes tjc-zoomIn {
      0% { opacity: 0; transform: scale3d(0.3, 0.3, 0.3); }
      50% { opacity: 1; }
    }
  `,
  zoomOut: `
    @keyframes tjc-zoomOut {
      0% { opacity: 1; }
      50% { opacity: 0; transform: scale3d(0.3, 0.3, 0.3); }
      100% { opacity: 0; }
    }
  `,

  // Special effects
  lightSpeedIn: `
    @keyframes tjc-lightSpeedIn {
      0% {
        opacity: 0;
        transform: translate3d(100%, 0, 0) skewX(-30deg);
      }
      60% {
        opacity: 1;
        transform: skewX(20deg);
      }
      80% {
        transform: skewX(-5deg);
      }
      100% {
        transform: translate3d(0, 0, 0);
      }
    }
  `,
  lightSpeedOut: `
    @keyframes tjc-lightSpeedOut {
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0;
        transform: translate3d(100%, 0, 0) skewX(30deg);
      }
    }
  `,
};

class AnimationManager {
  private styleElement: HTMLStyleElement | null = null;
  private isReducedMotion = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init(): void {
    this.detectReducedMotionPreference();
    this.injectKeyframes();
    this.setupReducedMotionListener();
  }

  private detectReducedMotionPreference(): void {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.isReducedMotion = mediaQuery.matches;
  }

  private setupReducedMotionListener(): void {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', (e) => {
      this.isReducedMotion = e.matches;
      document.documentElement.classList.toggle('reduced-motion', e.matches);
    });
  }

  private injectKeyframes(): void {
    if (typeof document === 'undefined') return;

    this.styleElement = document.createElement('style');
    this.styleElement.id = 'tjc-animations';
    
    const keyframesCSS = Object.values(ANIMATION_KEYFRAMES).join('\n');
    this.styleElement.textContent = `
      ${keyframesCSS}
      
      /* Reduced motion overrides */
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
      
      .reduced-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `;
    
    document.head.appendChild(this.styleElement);
  }

  /**
   * Applique une animation à un élément
   */
  animate(
    element: HTMLElement,
    animation: AnimationType,
    config: Partial<AnimationConfig> = {}
  ): Promise<void> {
    const finalConfig = { ...DEFAULT_ANIMATION_CONFIG, ...config };

    return new Promise((resolve) => {
      if (this.isReducedMotion && finalConfig.respectReducedMotion) {
        resolve();
        return;
      }

      const animationName = `tjc-${animation}`;
      const duration = `${finalConfig.duration}ms`;
      const delay = `${finalConfig.delay}ms`;
      const easing = EASING_FUNCTIONS[finalConfig.easing];
      const iterations = finalConfig.iterations;
      const direction = finalConfig.direction;
      const fillMode = finalConfig.fillMode;

      element.style.animation = `${animationName} ${duration} ${easing} ${delay} ${iterations} ${direction} ${fillMode}`;

      const handleAnimationEnd = () => {
        element.removeEventListener('animationend', handleAnimationEnd);
        element.style.animation = '';
        resolve();
      };

      element.addEventListener('animationend', handleAnimationEnd);
    });
  }

  /**
   * Séquence d'animations
   */
  async sequence(
    element: HTMLElement,
    animations: Array<{
      animation: AnimationType;
      config?: Partial<AnimationConfig>;
    }>
  ): Promise<void> {
    for (const { animation, config } of animations) {
      await this.animate(element, animation, config);
    }
  }

  /**
   * Animation avec callback de progression
   */
  animateWithProgress(
    element: HTMLElement,
    animation: AnimationType,
    config: Partial<AnimationConfig> = {},
    onProgress?: (progress: number) => void
  ): Promise<void> {
    const finalConfig = { ...DEFAULT_ANIMATION_CONFIG, ...config };

    return new Promise((resolve) => {
      if (this.isReducedMotion && finalConfig.respectReducedMotion) {
        onProgress?.(1);
        resolve();
        return;
      }

      const startTime = performance.now();
      const duration = finalConfig.duration;

      const updateProgress = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        onProgress?.(progress);

        if (progress < 1) {
          requestAnimationFrame(updateProgress);
        }
      };

      requestAnimationFrame(updateProgress);

      this.animate(element, animation, config).then(resolve);
    });
  }

  /**
   * Obtient l'état de reduced motion
   */
  getReducedMotionState(): boolean {
    return this.isReducedMotion;
  }
}

// Instance globale
export const animationManager = new AnimationManager();

// Utilitaires pour les composants React
export const useAnimation = () => {
  const animate = (
    element: HTMLElement | React.RefObject<HTMLElement>,
    animation: AnimationType,
    config: Partial<AnimationConfig> = {}
  ) => {
    const target = 'current' in element ? element.current : element;
    if (target) {
      return animationManager.animate(target, animation, config);
    }
    return Promise.resolve();
  };

  return {
    animate,
    getReducedMotionState: () => animationManager.getReducedMotionState(),
  };
};

// Hook pour les animations d'apparition
export const useEntranceAnimation = (
  animation: AnimationType = 'fadeInUp',
  config?: Partial<AnimationConfig>
) => {
  const ref = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      animationManager.animate(ref.current, animation, config);
    }
  }, [animation, config]);

  return ref;
};
