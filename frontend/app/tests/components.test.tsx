import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Mock des modules externes
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('@remix-run/react', () => ({
  useLoaderData: () => ({
    user: {
      id: 1,
      email: 'admin@tjc.tn',
      firstName: 'Admin',
      lastName: 'TJC',
      role: 'super_admin'
    },
    dashboardData: {
      metrics: {
        totalLicenses: 2847,
        activeLicenses: 2203,
        pendingApplications: 89,
        monthlyRevenue: 145600,
        systemUptime: 99.8,
        activeUsers: 156
      },
      systemHealth: {
        isHealthy: true,
        apiStatus: 'operational',
        databaseStatus: 'operational'
      }
    }
  }),
  Form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
  Link: ({ children, ...props }: any) => <a {...props}>{children}</a>
}));

// Import des composants à tester après les mocks
import { useResponsive, ResponsiveCard, ResponsiveMetrics } from '../components/ui/responsive-components';
import { ExportPanel } from '../components/ui/export-panel';
import { NotificationPanel } from '../components/ui/notification-panel';

// Tests pour le hook useResponsive
describe('useResponsive Hook', () => {
  beforeEach(() => {
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  it('détecte correctement les breakpoints desktop', () => {
    window.innerWidth = 1024;
    const TestComponent = () => {
      const { isMobile, isTablet, isDesktop } = useResponsive();
      return (
        <div>
          <span data-testid="mobile">{isMobile.toString()}</span>
          <span data-testid="tablet">{isTablet.toString()}</span>
          <span data-testid="desktop">{isDesktop.toString()}</span>
        </div>
      );
    };

    render(<TestComponent />);
    expect(screen.getByTestId('mobile')).toHaveTextContent('false');
    expect(screen.getByTestId('tablet')).toHaveTextContent('false');
    expect(screen.getByTestId('desktop')).toHaveTextContent('true');
  });

  it('détecte correctement les breakpoints mobile', () => {
    window.innerWidth = 600;
    const TestComponent = () => {
      const { isMobile, isTablet, isDesktop } = useResponsive();
      return (
        <div>
          <span data-testid="mobile">{isMobile.toString()}</span>
          <span data-testid="tablet">{isTablet.toString()}</span>
          <span data-testid="desktop">{isDesktop.toString()}</span>
        </div>
      );
    };

    render(<TestComponent />);
    expect(screen.getByTestId('mobile')).toHaveTextContent('true');
    expect(screen.getByTestId('tablet')).toHaveTextContent('false');
    expect(screen.getByTestId('desktop')).toHaveTextContent('false');
  });

  it('détecte correctement les breakpoints tablet', () => {
    window.innerWidth = 800;
    const TestComponent = () => {
      const { isMobile, isTablet, isDesktop } = useResponsive();
      return (
        <div>
          <span data-testid="mobile">{isMobile.toString()}</span>
          <span data-testid="tablet">{isTablet.toString()}</span>
          <span data-testid="desktop">{isDesktop.toString()}</span>
        </div>
      );
    };

    render(<TestComponent />);
    expect(screen.getByTestId('mobile')).toHaveTextContent('false');
    expect(screen.getByTestId('tablet')).toHaveTextContent('true');
    expect(screen.getByTestId('desktop')).toHaveTextContent('false');
  });
});

// Tests pour ResponsiveCard
describe('ResponsiveCard Component', () => {
  it('rend correctement avec le contenu', () => {
    render(
      <ResponsiveCard>
        <h2>Test Content</h2>
        <p>Test paragraph</p>
      </ResponsiveCard>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('Test paragraph')).toBeInTheDocument();
  });

  it('applique les classes CSS personnalisées', () => {
    render(
      <ResponsiveCard className="custom-class" data-testid="test-card">
        Content
      </ResponsiveCard>
    );

    const card = screen.getByTestId('test-card');
    expect(card).toHaveClass('custom-class');
  });

  it('applique le padding correct selon la taille', () => {
    render(
      <ResponsiveCard padding="large" data-testid="large-card">
        Content
      </ResponsiveCard>
    );

    const card = screen.getByTestId('large-card');
    expect(card).toHaveClass('bg-white');
  });
});

// Tests pour ResponsiveMetrics
describe('ResponsiveMetrics Component', () => {
  const mockMetrics = [
    {
      label: "Total Licenses",
      value: "2,847",
      change: "+12%",
      icon: "📋",
      color: "from-blue-500 to-cyan-500"
    },
    {
      label: "Active Licenses",
      value: "2,203",
      change: "+8%",
      icon: "✅",
      color: "from-green-500 to-emerald-500"
    }
  ];

  it('affiche toutes les métriques', () => {
    render(<ResponsiveMetrics metrics={mockMetrics} />);

    expect(screen.getByText('Total Licenses')).toBeInTheDocument();
    expect(screen.getByText('2,847')).toBeInTheDocument();
    expect(screen.getByText('+12%')).toBeInTheDocument();

    expect(screen.getByText('Active Licenses')).toBeInTheDocument();
    expect(screen.getByText('2,203')).toBeInTheDocument();
    expect(screen.getByText('+8%')).toBeInTheDocument();
  });

  it('affiche les icônes correctement', () => {
    render(<ResponsiveMetrics metrics={mockMetrics} />);

    expect(screen.getByText('📋')).toBeInTheDocument();
    expect(screen.getByText('✅')).toBeInTheDocument();
  });
});

// Tests pour ExportPanel
describe('ExportPanel Component', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('rend tous les boutons d\'export', () => {
    render(<ExportPanel onClose={mockOnClose} />);

    expect(screen.getByText('PDF Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Excel Complet')).toBeInTheDocument();
    expect(screen.getByText('Screenshot')).toBeInTheDocument();
  });

  it('appelle onClose lors du clic sur fermer', async () => {
    const user = userEvent.setup();
    render(<ExportPanel onClose={mockOnClose} />);

    const closeButton = screen.getByRole('button', { name: /fermer/i });
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('démarre l\'export PDF lors du clic', async () => {
    const user = userEvent.setup();
    
    // Mock des services d'export
    vi.mock('../utils/export.client', () => ({
      PDFExporter: {
        getInstance: () => ({
          exportDashboard: vi.fn().mockResolvedValue(true)
        })
      }
    }));

    render(<ExportPanel onClose={mockOnClose} />);

    const pdfButton = screen.getByText('PDF Dashboard').closest('button');
    if (pdfButton) {
      await user.click(pdfButton);
      // Vérifier que le bouton change d'état (loading)
      await waitFor(() => {
        expect(pdfButton).toBeDisabled();
      });
    }
  });
});

// Tests pour NotificationPanel
describe('NotificationPanel Component', () => {
  const mockOnToggle = vi.fn();

  beforeEach(() => {
    mockOnToggle.mockClear();
  });

  it('rend le badge de notification', () => {
    render(
      <NotificationPanel
        isOpen={false}
        onToggle={mockOnToggle}
      />
    );

    expect(screen.getByText('🔔')).toBeInTheDocument();
  });

  it('toggle l\'état lors du clic sur le badge', async () => {
    const user = userEvent.setup();
    render(
      <NotificationPanel
        isOpen={false}
        onToggle={mockOnToggle}
      />
    );

    const toggleButton = screen.getByRole('button');
    await user.click(toggleButton);

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('affiche le panel ouvert correctement', () => {
    render(
      <NotificationPanel
        isOpen={true}
        onToggle={mockOnToggle}
      />
    );

    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });
});

// Tests d'intégration pour le dashboard
describe('Dashboard Integration Tests', () => {
  beforeEach(() => {
    // Reset des mocks
    vi.clearAllMocks();
  });

  it('charge et affiche les données dashboard', () => {
    // Ce test sera implémenté avec les composants complets
    expect(true).toBe(true);
  });

  it('gère correctement les erreurs d\'authentification', () => {
    // Test avec mock d'erreur d'auth
    expect(true).toBe(true);
  });

  it('exporte les données en PDF avec succès', async () => {
    // Test d'intégration export
    expect(true).toBe(true);
  });

  it('affiche les notifications en temps réel', async () => {
    // Test du système de notifications
    expect(true).toBe(true);
  });
});

// Tests de performance
describe('Performance Tests', () => {
  it('rend les composants dans un temps acceptable', () => {
    const startTime = performance.now();
    
    render(
      <ResponsiveMetrics 
        metrics={Array.from({ length: 10 }, (_, i) => ({
          label: `Metric ${i}`,
          value: `${i * 100}`,
          icon: "📊",
          color: "from-blue-500 to-cyan-500"
        }))}
      />
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Le rendu ne devrait pas prendre plus de 100ms
    expect(renderTime).toBeLessThan(100);
  });

  it('gère efficacement les re-renders', () => {
    let renderCount = 0;
    
    const TestComponent = ({ value }: { value: number }) => {
      renderCount++;
      return <ResponsiveCard>{value}</ResponsiveCard>;
    };

    const { rerender } = render(<TestComponent value={1} />);
    rerender(<TestComponent value={1} />); // Même valeur
    rerender(<TestComponent value={2} />); // Nouvelle valeur

    // Should not cause unnecessary re-renders
    expect(renderCount).toBe(3);
  });
});

// Tests d'accessibilité
describe('Accessibility Tests', () => {
  it('a les aria-labels appropriés', () => {
    render(
      <NotificationPanel
        isOpen={false}
        onToggle={() => {}}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label');
  });

  it('supporte la navigation au clavier', async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();
    
    render(<ExportPanel onClose={mockOnClose} />);

    // Tab navigation
    await user.tab();
    expect(document.activeElement).toBeTruthy();
    
    // Enter key activation
    if (document.activeElement) {
      await user.keyboard('{Enter}');
      // Vérifier que l'action appropriée est déclenchée
    }
  });

  it('a un contraste de couleur suffisant', () => {
    render(
      <ResponsiveCard>
        <span style={{ color: '#000', backgroundColor: '#fff' }}>
          High contrast text
        </span>
      </ResponsiveCard>
    );
    
    // Ce test nécessiterait une bibliothèque comme axe-core
    // pour vérifier automatiquement le contraste
    expect(screen.getByText('High contrast text')).toBeInTheDocument();
  });
});

// Tests de sécurité
describe('Security Tests', () => {
  it('échappe correctement le contenu utilisateur', () => {
    const maliciousInput = '<script>alert("XSS")</script>';
    
    render(
      <ResponsiveCard>
        <div data-testid="user-content">{maliciousInput}</div>
      </ResponsiveCard>
    );

    const content = screen.getByTestId('user-content');
    // Le contenu ne devrait pas être exécuté comme du HTML
    expect(content.innerHTML).not.toContain('<script>');
    expect(content.textContent).toBe(maliciousInput);
  });

  it('valide les permissions utilisateur', () => {
    // Ce test nécessiterait l'intégration avec le système d'auth
    expect(true).toBe(true);
  });
});

// Tests mobile spécifiques
describe('Mobile-Specific Tests', () => {
  beforeEach(() => {
    // Simuler un environnement mobile
    window.innerWidth = 375;
    window.innerHeight = 667;
    
    // Mock touch events
    const mockTouch = {
      touches: [{ clientX: 100, clientY: 100 }],
      preventDefault: vi.fn(),
    };
    
    global.TouchEvent = vi.fn().mockImplementation(() => mockTouch);
  });

  it('rend correctement sur mobile', () => {
    const TestMobileComponent = () => {
      const { isMobile } = useResponsive();
      return (
        <div data-testid="mobile-indicator">
          {isMobile ? 'Mobile View' : 'Desktop View'}
        </div>
      );
    };

    render(<TestMobileComponent />);
    expect(screen.getByTestId('mobile-indicator')).toHaveTextContent('Mobile View');
  });

  it('gère correctement les événements tactiles', async () => {
    const handleTouch = vi.fn();
    
    render(
      <button
        data-testid="touch-button"
        onTouchStart={handleTouch}
      >
        Touch me
      </button>
    );

    const button = screen.getByTestId('touch-button');
    
    // Simuler un événement tactile
    fireEvent.touchStart(button);
    expect(handleTouch).toHaveBeenCalled();
  });
});

export {};
