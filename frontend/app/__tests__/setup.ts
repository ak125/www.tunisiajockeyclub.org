import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock global objects
global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

global.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock Notification API
const mockNotification = {
  permission: 'granted',
  requestPermission: vi.fn().mockResolvedValue('granted'),
  close: vi.fn(),
}

Object.defineProperty(global, 'Notification', {
  value: vi.fn().mockImplementation((title, options) => ({
    title,
    ...options,
    ...mockNotification,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
  writable: true,
})

Object.defineProperty(global.Notification, 'permission', {
  value: 'granted',
  writable: true,
})

Object.defineProperty(global.Notification, 'requestPermission', {
  value: mockNotification.requestPermission,
  writable: true,
})

// Mock WebSocket
const mockWebSocket = {
  send: vi.fn(),
  close: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  readyState: 1, // OPEN
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
}

Object.defineProperty(global, 'WebSocket', {
  value: vi.fn(() => mockWebSocket),
  writable: true,
})

// Mock URL.createObjectURL
Object.defineProperty(global.URL, 'createObjectURL', {
  value: vi.fn(() => 'mock-object-url'),
  writable: true,
})

Object.defineProperty(global.URL, 'revokeObjectURL', {
  value: vi.fn(),
  writable: true,
})

// Mock canvas context for html2canvas
const mockCanvasContext = {
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(() => ({
    data: new Uint8ClampedArray(4),
  })),
  putImageData: vi.fn(),
  createImageData: vi.fn(() => []),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  fill: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  toDataURL: vi.fn(() => 'data:image/png;base64,mock'),
}

HTMLCanvasElement.prototype.getContext = vi.fn(() => mockCanvasContext)

// Mock crypto for UUID generation
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: vi.fn(() => '12345678-1234-1234-1234-123456789abc'),
    getRandomValues: vi.fn((arr) => arr.map(() => Math.floor(Math.random() * 256))),
  },
  writable: true,
})

// Console warning suppression for tests
const originalWarn = console.warn
const originalError = console.error

beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks()
  
  // Reset localStorage and sessionStorage
  localStorageMock.clear()
  sessionStorageMock.clear()
  
  // Suppress specific warnings in tests
  console.warn = vi.fn((message) => {
    if (typeof message === 'string' && (
      message.includes('React Router Future Flag Warning') ||
      message.includes('validateDOMNesting') ||
      message.includes('useLayoutEffect')
    )) {
      return
    }
    originalWarn(message)
  })
  
  console.error = vi.fn((message) => {
    if (typeof message === 'string' && (
      message.includes('Warning:') ||
      message.includes('React Router')
    )) {
      return
    }
    originalError(message)
  })
})

afterEach(() => {
  // Restore console methods
  console.warn = originalWarn
  console.error = originalError
})

// Global test utilities
global.testUtils = {
  createMockUser: (overrides = {}) => ({
    id: '1',
    username: 'test_user',
    firstName: 'Test',
    lastName: 'User',
    role: 'admin',
    isActive: true,
    ...overrides,
  }),
  
  createMockNotification: (overrides = {}) => ({
    id: `test_${Date.now()}`,
    type: 'info',
    title: 'Test Notification',
    message: 'This is a test notification',
    timestamp: new Date().toISOString(),
    read: false,
    priority: 'medium',
    category: 'system',
    ...overrides,
  }),
  
  createMockHorse: (overrides = {}) => ({
    id: '1',
    name: 'Test Horse',
    age: 3,
    status: 'Active',
    owner: 'Test Owner',
    trainer: 'Test Trainer',
    jockey: 'Test Jockey',
    ...overrides,
  }),
  
  wait: (ms = 0) => new Promise(resolve => setTimeout(resolve, ms)),
  
  mockFetch: (response = {}, options = {}) => {
    return vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response)),
      status: 200,
      statusText: 'OK',
      ...options,
    })
  },
  
  mockFileReader: (result = 'mock-file-content') => {
    const mockFileReader = {
      result,
      readAsText: vi.fn(function() {
        setTimeout(() => {
          this.onload({ target: { result } })
        }, 0)
      }),
      readAsDataURL: vi.fn(function() {
        setTimeout(() => {
          this.onload({ target: { result: `data:application/pdf;base64,${result}` } })
        }, 0)
      }),
      onload: vi.fn(),
      onerror: vi.fn(),
      abort: vi.fn(),
    }
    
    global.FileReader = vi.fn(() => mockFileReader)
    return mockFileReader
  }
}

// Extend expect with custom matchers if needed
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      }
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      }
    }
  },
})
