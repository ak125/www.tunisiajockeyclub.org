import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { beforeAll, beforeEach, afterEach, afterAll } from 'vitest';

// Configuration globale des tests
beforeAll(() => {
  // Mock de l'API Window
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // Deprecated
      removeListener: vi.fn(), // Deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock de ResizeObserver
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock de IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock de scrollTo
  Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: vi.fn(),
  });

  // Mock de localStorage
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    },
    writable: true,
  });

  // Mock de sessionStorage
  Object.defineProperty(window, 'sessionStorage', {
    value: {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    },
    writable: true,
  });

  // Mock de fetch API
  global.fetch = vi.fn();

  // Mock de URL.createObjectURL
  global.URL.createObjectURL = vi.fn(() => 'mocked-url');
  global.URL.revokeObjectURL = vi.fn();

  // Mock de console pour éviter les warnings en test
  global.console = {
    ...console,
    warn: vi.fn(),
    error: vi.fn(),
  };

  // Configuration pour les animations
  Object.defineProperty(window, 'requestAnimationFrame', {
    writable: true,
    value: vi.fn(cb => setTimeout(cb, 0)),
  });

  Object.defineProperty(window, 'cancelAnimationFrame', {
    writable: true,
    value: vi.fn(id => clearTimeout(id)),
  });
});

beforeEach(() => {
  // Reset de tous les mocks avant chaque test
  vi.clearAllMocks();

  // Reset des timers si utilisés
  vi.clearAllTimers();
});

afterEach(() => {
  // Nettoyage après chaque test
  cleanup();
});

afterAll(() => {
  // Nettoyage final
  vi.restoreAllMocks();
});

// Utilitaires de test globaux
export const mockUser = {
  id: 1,
  email: 'test@tjc.tn',
  firstName: 'Test',
  lastName: 'User',
  role: 'admin' as const,
};

export const mockSystemHealth = {
  isHealthy: true,
  apiStatus: 'operational' as const,
  databaseStatus: 'operational' as const,
  lastCheck: new Date().toISOString(),
  responseTime: 120,
};

export const mockDashboardData = {
  metrics: {
    totalLicenses: 2847,
    activeLicenses: 2203,
    pendingApplications: 89,
    monthlyRevenue: 145600,
    systemUptime: 99.8,
    activeUsers: 156,
  },
  systemHealth: mockSystemHealth,
  recentActivity: [
    {
      id: 1,
      type: 'license_approved',
      user: 'Mohamed Salhi',
      timestamp: new Date().toISOString(),
      description: 'Licence jockey approuvée',
    },
  ],
  upcomingEvents: [
    {
      id: 1,
      title: 'Course Test',
      date: '2024-12-25',
      location: 'Test Location',
      participants: 24,
    },
  ],
};

// Helper pour simuler les tailles d'écran
export const mockViewport = (width: number, height: number = 768) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  
  // Déclencher l'événement resize
  window.dispatchEvent(new Event('resize'));
};

// Helper pour les tests d'export
export const mockExportAPIs = () => {
  // Mock jsPDF
  vi.mock('jspdf', () => ({
    default: vi.fn().mockImplementation(() => ({
      text: vi.fn(),
      addImage: vi.fn(),
      save: vi.fn(),
      addPage: vi.fn(),
      setFontSize: vi.fn(),
      setTextColor: vi.fn(),
    })),
  }));

  // Mock html2canvas
  vi.mock('html2canvas', () => ({
    default: vi.fn().mockResolvedValue({
      toDataURL: vi.fn().mockReturnValue('data:image/png;base64,mock'),
    }),
  }));

  // Mock XLSX
  vi.mock('xlsx', () => ({
    utils: {
      json_to_sheet: vi.fn(),
      book_new: vi.fn(),
      book_append_sheet: vi.fn(),
    },
    write: vi.fn(),
  }));
};

// Helper pour les tests de notification
export const mockNotificationAPI = () => {
  global.fetch = vi.fn().mockImplementation((url: string) => {
    if (url.includes('/api/notifications')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          notifications: [
            {
              id: 1,
              title: 'Test Notification',
              message: 'Test message',
              type: 'info',
              timestamp: new Date().toISOString(),
              read: false,
            },
          ],
        }),
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    });
  });
};

// Helper pour les tests d'authentification
export const mockAuthAPI = () => {
  global.fetch = vi.fn().mockImplementation((url: string, options: any) => {
    if (url.includes('/login')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          user: mockUser,
        }),
      });
    }
    
    if (url.includes('/logout')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });
    }

    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    });
  });
};

// Configuration d'erreurs personnalisées pour les tests
export class TestError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'TestError';
  }
}

// Timeout personnalisé pour les tests asynchrones
export const waitForAsync = (ms: number = 100) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Matcher personnalisé pour les tests de responsive
expect.extend({
  toBeResponsive(received, breakpoint) {
    const pass = received.classList.contains(`${breakpoint}:block`) || 
                  received.classList.contains(`${breakpoint}:hidden`);
    
    return {
      message: () => `expected element ${pass ? 'not ' : ''}to be responsive at ${breakpoint}`,
      pass,
    };
  },
});
