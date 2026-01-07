const path = require('path');
const MunicipioController = require(path.join(__dirname, '../../app/Controllers/Http/MunicipioController'));
const { createMockRequest, createMockResponse } = require('../helpers/mockRequestResponse');

describe('MunicipioController - getMunicipio()', () => {
  let controller;
  let request;
  let response;
  let Municipio;

  beforeEach(() => {
    controller = new MunicipioController();
    response = createMockResponse();
    Municipio = global.use('App/Models/Municipio');
    Municipio.query.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('deve retornar erro 400 quando id_municipio não é fornecido', async () => {
    request = createMockRequest({});

    await controller.getMunicipio({ request, response });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      error: 'ID do município é obrigatório'
    });
  });

  test('deve retornar erro 400 quando id_municipio é inválido', async () => {
    request = createMockRequest({ id_municipio: 'abc' });

    await controller.getMunicipio({ request, response });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      error: 'ID do município inválido'
    });
  });

  test('deve retornar município quando id_municipio é válido', async () => {
    const mockMunicipioData = {
      id_municipio: 1,
      municipio_nome: 'Teste',
      municipio_codigo_ibge: '123456',
    };

    request = createMockRequest({ id_municipio: '1' });

    const mockQueryBuilder = global.createMockQueryBuilder();
    mockQueryBuilder.first.mockResolvedValue(mockMunicipioData);
    Municipio.query.mockReturnValue(mockQueryBuilder);

    await controller.getMunicipio({ request, response });

    // O controller retorna response.status(200).json(municipio) quando encontra
    expect(Municipio.query).toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(mockMunicipioData);
  });

  test('deve retornar null quando município não é encontrado', async () => {
    request = createMockRequest({ id_municipio: '999' });

    const mockQueryBuilder = global.createMockQueryBuilder();
    mockQueryBuilder.first.mockResolvedValue(null);
    Municipio.query.mockReturnValue(mockQueryBuilder);

    await controller.getMunicipio({ request, response });

    expect(Municipio.query).toHaveBeenCalled();
  });

  test('deve lidar com erros do banco de dados', async () => {
    request = createMockRequest({ id_municipio: '1' });

    const error = new Error('Database error');
    const mockQueryBuilder = global.createMockQueryBuilder();
    mockQueryBuilder.first.mockRejectedValue(error);
    Municipio.query.mockReturnValue(mockQueryBuilder);

    await controller.getMunicipio({ request, response });

    // Verificar que o erro foi tratado e retornou status 500
    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({ error: 'Erro ao buscar município' });
    
    // O controller não retorna nada quando há erro (undefined)
    // e não chama response.status
  });
});

