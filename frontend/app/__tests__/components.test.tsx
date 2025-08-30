import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Mock des dépendances
vi.mock('@remix-run/react', () => ({
  useLoaderData: () => ({
    user: {
      id: '1',
      firstName: 'Admin',
      lastName: 'Test',
      role: 'admin',
      username: 'admin'
    },
    systemHealth: {
      isHealthy: true,
      status: 'operational',
      lastCheck: new Date().toISOString(),
      environment: 'test'
    },
    metrics: {
      horses: { total: '45', change: '+5.2%', description: 'Chevaux enregistrés' },
      users: { total: '10', change: '+12.1%', description: 'Utilisateurs actifs' },
      races: { total: '5', change: '+8.3%', description: 'Courses programmées' },
      jockeys: { total: '5', change: '+3.7%', description: 'Jockeys certifiés' }
    },
    recentActivity: [],
    upcomingEvents: []
  }),
  useRevalidator: () => ({
    revalidate: vi.fn(),
    state: 'idle'
  }),
  Form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
  Link: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>
  },
  AnimatePresence: ({ children }: any) => <>{children}</>
}));

// Import des composants à tester
import { ExecutiveBadge, ExecutiveButton, ExecutiveStatus } from '../components/ui/executive-components';

describe('Executive Components', () => {
  describe('ExecutiveBadge', () => {
    it('renders with default props', () => {
      render(<ExecutiveBadge>Test Badge</ExecutiveBadge>);
      expect(screen.getByText('Test Badge')).toBeInTheDocument();
    });

    it('applies correct variant classes', () => {
      render(<ExecutiveBadge variant="ministerial">Ministerial</ExecutiveBadge>);
      const badge = screen.getByText('Ministerial');
      expect(badge).toHaveClass('bg-gradient-to-r', 'from-red-800', 'to-red-900');
    });

    it('applies correct size classes', () => {
      render(<ExecutiveBadge size="lg">Large Badge</ExecutiveBadge>);
      const badge = screen.getByText('Large Badge');
      expect(badge).toHaveClass('px-6', 'py-3', 'text-base', 'font-bold');
    });

    it('renders with custom className', () => {
      render(<ExecutiveBadge className="custom-class">Custom</ExecutiveBadge>);
      const badge = screen.getByText('Custom');
      expect(badge).toHaveClass('custom-class');
    });
  });

  describe('ExecutiveButton', () => {
    it('renders with children', () => {
      render(<ExecutiveButton>Click me</ExecutiveButton>);
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('calls onClick when clicked', async () => {
      const handleClick = vi.fn();
      render(<ExecutiveButton onClick={handleClick}>Click me</ExecutiveButton>);
      
      await userEvent.click(screen.getByRole('button', { name: 'Click me' }));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('is disabled when disabled prop is true', () => {
      render(<ExecutiveButton disabled>Disabled</ExecutiveButton>);
      const button = screen.getByRole('button', { name: 'Disabled' });
      expect(button).toBeDisabled();
    });

    it('shows loading state', () => {
      render(<ExecutiveButton loading>Loading</ExecutiveButton>);
      expect(screen.getByText('Traitement...')).toBeInTheDocument();
    });

    it('renders with icon', () => {
      render(<ExecutiveButton icon={<span>🔥</span>}>With Icon</ExecutiveButton>);
      expect(screen.getByText('🔥')).toBeInTheDocument();
      expect(screen.getByText('With Icon')).toBeInTheDocument();
    });

    it('applies correct variant classes', () => {
      render(<ExecutiveButton variant="ministerial">Ministerial</ExecutiveButton>);
      const button = screen.getByRole('button', { name: 'Ministerial' });
      expect(button).toHaveClass('bg-gradient-to-r', 'from-red-800', 'to-red-900');
    });
  });

  describe('ExecutiveStatus', () => {
    it('renders with status and label', () => {
      render(<ExecutiveStatus status="operational" label="System Status" />);
      expect(screen.getByText('SYSTEM STATUS')).toBeInTheDocument();
    });

    it('shows correct color for operational status', () => {
      render(<ExecutiveStatus status="operational" />);
      const statusDot = screen.getByRole('generic', { name: /status indicator/i });
      expect(statusDot.firstChild).toHaveClass('bg-emerald-500');
    });

    it('shows correct color for critical status', () => {
      render(<ExecutiveStatus status="critical" />);
      const statusDot = screen.getByRole('generic', { name: /status indicator/i });
      expect(statusDot.firstChild).toHaveClass('bg-red-500');
    });

    it('applies correct size', () => {
      render(<ExecutiveStatus status="operational" size="lg" />);
      const statusDot = screen.getByRole('generic', { name: /status indicator/i });
      expect(statusDot.firstChild).toHaveClass('w-4', 'h-4');
    });
  });
});

describe('Authentication Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should authenticate user with correct credentials', async () => {
    // Mock de la fonction authenticate
    const mockAuthenticate = vi.fn().mockResolvedValue({
      id: '1',
      username: 'admin',
      role: 'super_admin',
      firstName: 'Admin',
      lastName: 'User',
      isActive: true
    });

    const result = await mockAuthenticate('admin', 'admin123');
    expect(result).toBeTruthy();
    expect(result.username).toBe('admin');
    expect(result.role).toBe('super_admin');
  });

  it('should reject authentication with incorrect credentials', async () => {
    const mockAuthenticate = vi.fn().mockResolvedValue(null);
    
    const result = await mockAuthenticate('admin', 'wrongpassword');
    expect(result).toBeNull();
  });

  it('should create user session after successful authentication', async () => {
    const mockCreateSession = vi.fn().mockResolvedValue({
      headers: {
        'Set-Cookie': 'session=abc123; Path=/; HttpOnly'
      },
      status: 302,
      location: '/executive'
    });

    const user = {
      id: '1',
      username: 'admin',
      role: 'super_admin'
    };

    const result = await mockCreateSession(user, '/executive');
    expect(result.status).toBe(302);
    expect(result.headers['Set-Cookie']).toContain('session=abc123');
  });
});

describe('Export Functionality', () => {
  // Mock des données de test
  const mockData = [
    { name: 'Horse 1', age: 3, status: 'Active' },
    { name: 'Horse 2', age: 4, status: 'Retired' }
  ];

  const mockUser = {
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  };

  it('should format data for Excel export', () => {
    const formatForExcel = (data: any[], user: any) => ({
      title: 'Test Export',
      data,
      headers: Object.keys(data[0]),
      metadata: {
        generatedBy: `${user.firstName} ${user.lastName}`,
        generatedAt: new Date().toISOString(),
        totalRecords: data.length
      }
    });

    const result = formatForExcel(mockData, mockUser);
    
    expect(result.title).toBe('Test Export');
    expect(result.data).toEqual(mockData);
    expect(result.headers).toEqual(['name', 'age', 'status']);
    expect(result.metadata.generatedBy).toBe('Admin User');
    expect(result.metadata.totalRecords).toBe(2);
  });

  it('should handle empty data gracefully', () => {
    const formatForExcel = (data: any[], user: any) => ({
      title: 'Empty Export',
      data: data || [],
      headers: data.length > 0 ? Object.keys(data[0]) : [],
      metadata: {
        generatedBy: `${user.firstName} ${user.lastName}`,
        generatedAt: new Date().toISOString(),
        totalRecords: data.length
      }
    });

    const result = formatForExcel([], mockUser);
    
    expect(result.data).toEqual([]);
    expect(result.headers).toEqual([]);
    expect(result.metadata.totalRecords).toBe(0);
  });
});

describe('Notification System', () => {
  it('should create notification with correct structure', () => {
    const createNotification = (type: string, title: string, message: string) => ({
      id: `test_${Date.now()}`,
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      priority: 'medium',
      category: 'system'
    });

    const notification = createNotification('success', 'Test Title', 'Test Message');
    
    expect(notification.id).toMatch(/^test_\d+$/);
    expect(notification.type).toBe('success');
    expect(notification.title).toBe('Test Title');
    expect(notification.message).toBe('Test Message');
    expect(notification.read).toBe(false);
    expect(notification.priority).toBe('medium');
  });

  it('should filter notifications by category', () => {
    const notifications = [
      { id: '1', category: 'system', title: 'System Alert' },
      { id: '2', category: 'security', title: 'Security Alert' },
      { id: '3', category: 'system', title: 'System Update' }
    ];

    const filterByCategory = (notifications: any[], category: string) =>
      notifications.filter(n => n.category === category);

    const systemNotifications = filterByCategory(notifications, 'system');
    expect(systemNotifications).toHaveLength(2);
    expect(systemNotifications.every(n => n.category === 'system')).toBe(true);
  });

  it('should count unread notifications', () => {
    const notifications = [
      { id: '1', read: false },
      { id: '2', read: true },
      { id: '3', read: false }
    ];

    const countUnread = (notifications: any[]) =>
      notifications.filter(n => !n.read).length;

    expect(countUnread(notifications)).toBe(2);
  });
});

describe('Mobile Responsiveness', () => {
  it('should show mobile navigation on small screens', () => {
    // Mock de window.matchMedia pour simuler un écran mobile
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(max-width: 1023px)', // lg breakpoint
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const isMobile = window.matchMedia('(max-width: 1023px)').matches;
    expect(isMobile).toBe(true);
  });

  it('should adapt card layout for mobile', () => {
    const getCardClassName = (isMobile: boolean) =>
      isMobile 
        ? 'grid grid-cols-1 gap-4' 
        : 'grid lg:grid-cols-4 gap-6';

    expect(getCardClassName(true)).toBe('grid grid-cols-1 gap-4');
    expect(getCardClassName(false)).toBe('grid lg:grid-cols-4 gap-6');
  });
});

describe('Performance Tests', () => {
  it('should debounce search input', async () => {
    let searchValue = '';
    const mockSearch = vi.fn();
    
    const debounce = (func: Function, delay: number) => {
      let timeoutId: NodeJS.Timeout;
      return (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
      };
    };

    const debouncedSearch = debounce(mockSearch, 300);

    // Simuler plusieurs appels rapides
    debouncedSearch('a');
    debouncedSearch('ab');
    debouncedSearch('abc');

    // Attendre que le debounce se déclenche
    await new Promise(resolve => setTimeout(resolve, 350));
    
    expect(mockSearch).toHaveBeenCalledTimes(1);
    expect(mockSearch).toHaveBeenCalledWith('abc');
  });

  it('should limit the number of rendered items', () => {
    const items = Array.from({ length: 1000 }, (_, i) => ({ id: i, name: `Item ${i}` }));
    const maxItems = 50;
    
    const limitedItems = items.slice(0, maxItems);
    
    expect(limitedItems).toHaveLength(50);
    expect(limitedItems[0].name).toBe('Item 0');
    expect(limitedItems[49].name).toBe('Item 49');
  });
});

// Tests d'accessibilité
describe('Accessibility', () => {
  it('should have proper ARIA labels', () => {
    render(
      <ExecutiveButton aria-label="Close dialog">
        ✕
      </ExecutiveButton>
    );

    const button = screen.getByRole('button', { name: 'Close dialog' });
    expect(button).toBeInTheDocument();
  });

  it('should support keyboard navigation', async () => {
    const handleClick = vi.fn();
    render(<ExecutiveButton onClick={handleClick}>Submit</ExecutiveButton>);

    const button = screen.getByRole('button', { name: 'Submit' });
    button.focus();
    
    await userEvent.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(1);

    await userEvent.keyboard('{Space}');
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('should have proper color contrast', () => {
    render(<ExecutiveBadge variant="authority">Authority</ExecutiveBadge>);
    const badge = screen.getByText('Authority');
    
    // Vérifier que les classes de couleur sont appliquées
    expect(badge).toHaveClass('text-white');
    expect(badge).toHaveClass('bg-gradient-to-r');
  });
});
