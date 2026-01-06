/**
 * Mock do Model Municipio para testes
 */
class MockMunicipioQuery {
  constructor() {
    this.queryBuilder = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      fetch: jest.fn(),
      update: jest.fn(),
      insert: jest.fn(),
      first: jest.fn(),
    };
  }

  query() {
    return this.queryBuilder;
  }

  // Métodos auxiliares para configurar mocks
  mockFetch(data) {
    this.queryBuilder.fetch.mockResolvedValue({
      rows: data || [],
      toJSON: () => data || []
    });
    return this;
  }

  mockUpdate(result = {}) {
    this.queryBuilder.update.mockResolvedValue(result);
    return this;
  }

  mockInsert(result = {}) {
    this.queryBuilder.insert.mockResolvedValue(result);
    return this;
  }

  mockFirst(data) {
    this.queryBuilder.first.mockResolvedValue(data);
    return this;
  }

  reset() {
    this.queryBuilder = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      fetch: jest.fn(),
      update: jest.fn(),
      insert: jest.fn(),
      first: jest.fn(),
    };
  }
}

module.exports = MockMunicipioQuery;


