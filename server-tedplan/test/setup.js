// Setup global para testes
global.console = {
  ...console,
  // Silenciar logs durante testes (opcional)
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Criar um query builder mock padrão
function createMockQueryBuilder() {
  return {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    fetch: jest.fn().mockResolvedValue([]),
    update: jest.fn().mockResolvedValue({}),
    insert: jest.fn().mockResolvedValue({}),
    first: jest.fn().mockResolvedValue(null),
  };
}

// Mock do Model do AdonisJS
class MockModel {
  static query() {
    return createMockQueryBuilder();
  }
}

// Mock padrão do Municipio que será sobrescrito nos testes
const defaultMunicipioMock = {
  query: jest.fn(() => createMockQueryBuilder()),
};

// Mock do use() do AdonisJS
global.use = jest.fn((module) => {
  // Retornar um mock genérico para qualquer módulo
  if (module === 'App/Models/Municipio') {
    return defaultMunicipioMock;
  }
  
  if (module === 'Model') {
    return MockModel;
  }
  
  // Mock genérico para outros módulos
  return {
    query: jest.fn(() => createMockQueryBuilder()),
    create: jest.fn(),
    find: jest.fn(),
    findOrFail: jest.fn(),
    all: jest.fn(),
  };
});

// Exportar para uso nos testes
global.createMockQueryBuilder = createMockQueryBuilder;
global.defaultMunicipioMock = defaultMunicipioMock;

