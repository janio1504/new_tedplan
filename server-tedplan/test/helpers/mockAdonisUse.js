/**
 * Helper para mockar o sistema use() do AdonisJS
 * 
 * O AdonisJS usa use() para carregar módulos, então precisamos
 * mockar isso nos testes
 */

function createMockUse(mocks = {}) {
  return jest.fn((module) => {
    if (mocks[module]) {
      return mocks[module];
    }
    
    // Retornar um mock genérico se não estiver nos mocks
    return {
      query: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
      findOrFail: jest.fn(),
      all: jest.fn(),
    };
  });
}

module.exports = {
  createMockUse,
};


