// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    loading: jest.fn(() => 'loading-toast-id'),
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    dismiss: jest.fn(),
  },
}))

// Mock do serviço de município será feito nos testes individuais

// Mock next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }
  },
}))

