/**
 * Helpers para criar mocks de request e response do AdonisJS
 */
function createMockRequest(data = {}) {
  return {
    all: jest.fn().mockReturnValue(data),
    only: jest.fn().mockReturnValue(data),
    input: jest.fn((key, defaultValue) => data[key] || defaultValue),
    params: data.params || {},
    body: data.body || {},
    query: data.query || {},
  };
}

function createMockResponse() {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    header: jest.fn().mockReturnThis(),
  };

  // Helper para verificar se foi chamado com status e json
  res.statusJson = (statusCode, data) => {
    expect(res.status).toHaveBeenCalledWith(statusCode);
    expect(res.json).toHaveBeenCalledWith(data);
  };

  return res;
}

module.exports = {
  createMockRequest,
  createMockResponse,
};


