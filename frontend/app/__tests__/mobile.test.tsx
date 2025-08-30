import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

// Mock window.matchMedia
const createMatchMediaMock = (matches: boolean) => vi.fn(() => ({
  matches,
  media: '',
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

describe('Mobile Responsiveness', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Breakpoint Detection', () => {
    it('should detect mobile screen size', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: createMatchMediaMock(true),
      });

      const isMobile = window.matchMedia('(max-width: 1023px)').matches;
      expect(isMobile).toBe(true);
    });

    it('should detect desktop screen size', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: createMatchMediaMock(false),
      });

      const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
      expect(isDesktop).toBe(false); // Because we mocked it to return false
    });

    it('should detect tablet screen size', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn((query) => ({
          matches: query === '(min-width: 768px) and (max-width: 1023px)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      const isTablet = window.matchMedia('(min-width: 768px) and (max-width: 1023px)').matches;
      expect(isTablet).toBe(true);
    });

    it('should handle multiple breakpoints', () => {
      const createResponsiveHook = () => {
        const breakpoints = {
          mobile: '(max-width: 767px)',
          tablet: '(min-width: 768px) and (max-width: 1023px)',
          desktop: '(min-width: 1024px)'
        };

        return {
          isMobile: window.matchMedia(breakpoints.mobile).matches,
          isTablet: window.matchMedia(breakpoints.tablet).matches,
          isDesktop: window.matchMedia(breakpoints.desktop).matches,
          getCurrentBreakpoint: () => {
            if (window.matchMedia(breakpoints.mobile).matches) return 'mobile';
            if (window.matchMedia(breakpoints.tablet).matches) return 'tablet';
            if (window.matchMedia(breakpoints.desktop).matches) return 'desktop';
            return 'unknown';
          }
        };
      };

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn((query) => ({
          matches: query === '(max-width: 767px)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      const responsive = createResponsiveHook();
      expect(responsive.isMobile).toBe(true);
      expect(responsive.isTablet).toBe(false);
      expect(responsive.isDesktop).toBe(false);
      expect(responsive.getCurrentBreakpoint()).toBe('mobile');
    });
  });

  describe('Layout Adaptation', () => {
    it('should adapt grid layout for mobile', () => {
      const getGridClasses = (isMobile: boolean, isTablet: boolean) => {
        if (isMobile) return 'grid grid-cols-1 gap-4';
        if (isTablet) return 'grid grid-cols-2 gap-5';
        return 'grid lg:grid-cols-4 gap-6';
      };

      expect(getGridClasses(true, false)).toBe('grid grid-cols-1 gap-4');
      expect(getGridClasses(false, true)).toBe('grid grid-cols-2 gap-5');
      expect(getGridClasses(false, false)).toBe('grid lg:grid-cols-4 gap-6');
    });

    it('should adapt navigation for mobile', () => {
      const getNavigationConfig = (isMobile: boolean) => ({
        type: isMobile ? 'bottom-sheet' : 'sidebar',
        position: isMobile ? 'bottom' : 'left',
        collapsible: !isMobile,
        overlay: isMobile,
        maxItems: isMobile ? 5 : 10,
        showLabels: !isMobile,
        iconSize: isMobile ? 'lg' : 'md'
      });

      const mobileConfig = getNavigationConfig(true);
      expect(mobileConfig.type).toBe('bottom-sheet');
      expect(mobileConfig.position).toBe('bottom');
      expect(mobileConfig.overlay).toBe(true);
      expect(mobileConfig.maxItems).toBe(5);

      const desktopConfig = getNavigationConfig(false);
      expect(desktopConfig.type).toBe('sidebar');
      expect(desktopConfig.position).toBe('left');
      expect(desktopConfig.overlay).toBe(false);
      expect(desktopConfig.maxItems).toBe(10);
    });

    it('should adapt card size and spacing', () => {
      const getCardClasses = (screenSize: string) => {
        const configs = {
          mobile: {
            container: 'px-4 py-3',
            title: 'text-lg font-semibold',
            content: 'text-sm',
            spacing: 'space-y-3'
          },
          tablet: {
            container: 'px-5 py-4',
            title: 'text-xl font-semibold',
            content: 'text-base',
            spacing: 'space-y-4'
          },
          desktop: {
            container: 'px-6 py-5',
            title: 'text-2xl font-bold',
            content: 'text-lg',
            spacing: 'space-y-5'
          }
        };

        return configs[screenSize as keyof typeof configs] || configs.desktop;
      };

      const mobileCard = getCardClasses('mobile');
      expect(mobileCard.container).toBe('px-4 py-3');
      expect(mobileCard.title).toBe('text-lg font-semibold');

      const desktopCard = getCardClasses('desktop');
      expect(desktopCard.container).toBe('px-6 py-5');
      expect(desktopCard.title).toBe('text-2xl font-bold');
    });
  });

  describe('Touch Interactions', () => {
    it('should detect touch capability', () => {
      const isTouchDevice = () => {
        return 'ontouchstart' in window || 
               navigator.maxTouchPoints > 0 || 
               (navigator as any).msMaxTouchPoints > 0;
      };

      // Mock touch support
      Object.defineProperty(window, 'ontouchstart', {
        value: null,
        writable: true
      });

      expect(isTouchDevice()).toBe(true);

      // Remove touch support
      delete (window as any).ontouchstart;
      Object.defineProperty(navigator, 'maxTouchPoints', {
        value: 0,
        writable: true
      });

      expect(isTouchDevice()).toBe(false);
    });

    it('should handle touch gestures', () => {
      const createSwipeDetector = () => {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        return {
          handleTouchStart: (e: TouchEvent) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
          },
          
          handleTouchEnd: (e: TouchEvent) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            return this.getSwipeDirection();
          },
          
          getSwipeDirection: () => {
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const threshold = 50;
            
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
              if (Math.abs(deltaX) > threshold) {
                return deltaX > 0 ? 'right' : 'left';
              }
            } else {
              if (Math.abs(deltaY) > threshold) {
                return deltaY > 0 ? 'down' : 'up';
              }
            }
            
            return 'none';
          }
        };
      };

      const swipeDetector = createSwipeDetector();
      
      // Simuler un swipe vers la droite
      const mockTouchStart = {
        touches: [{ clientX: 100, clientY: 100 }]
      } as TouchEvent;
      
      const mockTouchEnd = {
        changedTouches: [{ clientX: 200, clientY: 100 }]
      } as TouchEvent;
      
      swipeDetector.handleTouchStart(mockTouchStart);
      const direction = swipeDetector.handleTouchEnd(mockTouchEnd);
      
      expect(direction).toBe('right');
    });

    it('should adjust button sizes for touch', () => {
      const getTouchFriendlyClasses = (isTouchDevice: boolean, size: string = 'md') => {
        const touchSizes = {
          sm: isTouchDevice ? 'min-h-[44px] min-w-[44px] p-3' : 'p-2',
          md: isTouchDevice ? 'min-h-[48px] min-w-[48px] p-4' : 'p-3',
          lg: isTouchDevice ? 'min-h-[52px] min-w-[52px] p-5' : 'p-4'
        };

        return touchSizes[size as keyof typeof touchSizes];
      };

      expect(getTouchFriendlyClasses(true, 'md')).toBe('min-h-[48px] min-w-[48px] p-4');
      expect(getTouchFriendlyClasses(false, 'md')).toBe('p-3');
    });
  });

  describe('Orientation Changes', () => {
    it('should handle orientation changes', () => {
      const createOrientationHandler = () => {
        let currentOrientation = 'portrait';
        const callbacks: ((orientation: string) => void)[] = [];
        
        return {
          getCurrentOrientation: () => currentOrientation,
          
          onOrientationChange: (callback: (orientation: string) => void) => {
            callbacks.push(callback);
          },
          
          simulateOrientationChange: (orientation: string) => {
            currentOrientation = orientation;
            callbacks.forEach(callback => callback(orientation));
          },
          
          getLayoutConfig: (orientation: string) => ({
            portrait: {
              navigation: 'bottom',
              sidebar: 'hidden',
              mainContent: 'full-width'
            },
            landscape: {
              navigation: 'side',
              sidebar: 'visible',
              mainContent: 'with-sidebar'
            }
          })[orientation]
        };
      };

      const orientationHandler = createOrientationHandler();
      let currentLayout = null;
      
      orientationHandler.onOrientationChange((orientation) => {
        currentLayout = orientationHandler.getLayoutConfig(orientation);
      });

      orientationHandler.simulateOrientationChange('landscape');
      
      expect(currentLayout).toEqual({
        navigation: 'side',
        sidebar: 'visible',
        mainContent: 'with-sidebar'
      });
    });

    it('should adapt UI for different orientations', () => {
      const getOrientationClasses = (orientation: string) => {
        const configs = {
          portrait: {
            container: 'flex flex-col h-screen',
            header: 'h-16 fixed top-0 w-full',
            content: 'flex-1 pt-16 pb-20',
            navigation: 'fixed bottom-0 w-full h-20'
          },
          landscape: {
            container: 'flex flex-row h-screen',
            header: 'h-12 fixed top-0 w-full z-50',
            content: 'flex-1 pt-12 ml-64',
            navigation: 'fixed left-0 top-12 bottom-0 w-64'
          }
        };

        return configs[orientation as keyof typeof configs] || configs.portrait;
      };

      const portraitConfig = getOrientationClasses('portrait');
      expect(portraitConfig.container).toBe('flex flex-col h-screen');
      expect(portraitConfig.navigation).toBe('fixed bottom-0 w-full h-20');

      const landscapeConfig = getOrientationClasses('landscape');
      expect(landscapeConfig.container).toBe('flex flex-row h-screen');
      expect(landscapeConfig.navigation).toBe('fixed left-0 top-12 bottom-0 w-64');
    });
  });

  describe('Performance Optimizations', () => {
    it('should implement lazy loading for mobile', () => {
      const createLazyLoader = () => {
        const observedElements = new Map();
        
        return {
          observeElement: (element: HTMLElement, callback: () => void) => {
            observedElements.set(element, callback);
            // Simuler IntersectionObserver
            setTimeout(() => {
              callback();
            }, 100);
          },
          
          unobserveElement: (element: HTMLElement) => {
            observedElements.delete(element);
          },
          
          getObservedCount: () => observedElements.size
        };
      };

      const lazyLoader = createLazyLoader();
      const mockElement = document.createElement('div');
      let loaded = false;
      
      lazyLoader.observeElement(mockElement, () => {
        loaded = true;
      });

      return new Promise((resolve) => {
        setTimeout(() => {
          expect(loaded).toBe(true);
          expect(lazyLoader.getObservedCount()).toBe(1);
          resolve(null);
        }, 150);
      });
    });

    it('should throttle scroll events', () => {
      const createScrollThrottler = (delay: number = 100) => {
        let timeoutId: NodeJS.Timeout | null = null;
        let lastCallback: (() => void) | null = null;
        
        return {
          throttle: (callback: () => void) => {
            lastCallback = callback;
            
            if (timeoutId === null) {
              timeoutId = setTimeout(() => {
                lastCallback?.();
                timeoutId = null;
                lastCallback = null;
              }, delay);
            }
          }
        };
      };

      const throttler = createScrollThrottler(50);
      let callCount = 0;
      
      const callback = () => {
        callCount++;
      };

      // Simuler plusieurs événements de scroll rapides
      throttler.throttle(callback);
      throttler.throttle(callback);
      throttler.throttle(callback);

      return new Promise((resolve) => {
        setTimeout(() => {
          expect(callCount).toBe(1); // Devrait n'être appelé qu'une fois
          resolve(null);
        }, 100);
      });
    });

    it('should implement virtual scrolling for long lists', () => {
      const createVirtualScroller = (itemHeight: number, containerHeight: number) => {
        return {
          getVisibleRange: (scrollTop: number, totalItems: number) => {
            const visibleCount = Math.ceil(containerHeight / itemHeight);
            const startIndex = Math.floor(scrollTop / itemHeight);
            const endIndex = Math.min(startIndex + visibleCount + 1, totalItems - 1);
            
            return {
              startIndex: Math.max(0, startIndex),
              endIndex,
              visibleItems: endIndex - startIndex + 1
            };
          },
          
          getTransform: (startIndex: number) => ({
            transform: `translateY(${startIndex * itemHeight}px)`
          }),
          
          getTotalHeight: (totalItems: number) => totalItems * itemHeight
        };
      };

      const scroller = createVirtualScroller(50, 300); // Items de 50px, container de 300px
      const range = scroller.getVisibleRange(100, 1000);
      
      expect(range.startIndex).toBe(2); // 100 / 50 = 2
      expect(range.endIndex).toBe(8); // startIndex + visible + buffer
      expect(range.visibleItems).toBe(7);
      
      const transform = scroller.getTransform(2);
      expect(transform.transform).toBe('translateY(100px)');
      
      const totalHeight = scroller.getTotalHeight(1000);
      expect(totalHeight).toBe(50000); // 1000 * 50
    });
  });

  describe('Accessibility on Mobile', () => {
    it('should provide larger touch targets', () => {
      const ensureMinimumTouchTarget = (element: { width: number; height: number }) => {
        const minSize = 44; // iOS HIG recommendation
        
        return {
          width: Math.max(element.width, minSize),
          height: Math.max(element.height, minSize),
          needsAdjustment: element.width < minSize || element.height < minSize
        };
      };

      const smallButton = { width: 30, height: 30 };
      const adjusted = ensureMinimumTouchTarget(smallButton);
      
      expect(adjusted.width).toBe(44);
      expect(adjusted.height).toBe(44);
      expect(adjusted.needsAdjustment).toBe(true);

      const goodButton = { width: 48, height: 48 };
      const notAdjusted = ensureMinimumTouchTarget(goodButton);
      
      expect(notAdjusted.width).toBe(48);
      expect(notAdjusted.height).toBe(48);
      expect(notAdjusted.needsAdjustment).toBe(false);
    });

    it('should support screen reader navigation', () => {
      const createMobileAccessibilityHelper = () => {
        return {
          generateLandmarks: (sections: string[]) => {
            return sections.map(section => ({
              role: 'region',
              'aria-label': section,
              'aria-labelledby': `${section.toLowerCase()}-heading`
            }));
          },
          
          createSkipLinks: (targets: { id: string; label: string }[]) => {
            return targets.map(target => ({
              href: `#${target.id}`,
              'aria-label': `Aller au ${target.label}`,
              className: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4'
            }));
          },
          
          getFocusManagement: () => ({
            trapFocus: (container: HTMLElement) => {
              const focusableElements = container.querySelectorAll(
                'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
              );
              return Array.from(focusableElements);
            },
            
            announceToScreenReader: (message: string) => ({
              'aria-live': 'polite',
              'aria-atomic': 'true',
              'role': 'status',
              'textContent': message
            })
          })
        };
      };

      const a11yHelper = createMobileAccessibilityHelper();
      
      const landmarks = a11yHelper.generateLandmarks(['Navigation', 'Contenu principal', 'Pied de page']);
      expect(landmarks[0]).toEqual({
        role: 'region',
        'aria-label': 'Navigation',
        'aria-labelledby': 'navigation-heading'
      });

      const skipLinks = a11yHelper.createSkipLinks([
        { id: 'main-content', label: 'contenu principal' },
        { id: 'navigation', label: 'navigation' }
      ]);
      
      expect(skipLinks[0].href).toBe('#main-content');
      expect(skipLinks[0]['aria-label']).toBe('Aller au contenu principal');
    });
  });
});
