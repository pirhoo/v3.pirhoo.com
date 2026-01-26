// Mock IntersectionObserver for tests
class IntersectionObserverMock {
  constructor(callback) {
    this.callback = callback
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.IntersectionObserver = IntersectionObserverMock

// Mock ResizeObserver for tests
class ResizeObserverMock {
  constructor(callback) {
    this.callback = callback
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock
