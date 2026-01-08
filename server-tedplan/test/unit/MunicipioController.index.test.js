const path = require('path');
const MunicipioController = require(path.join(__dirname, '../../app/Controllers/Http/MunicipioController'));

describe('MunicipioController - index()', () => {
  let controller;
  let Municipio;

  beforeEach(() => {
    controller = new MunicipioController();
    
    // Obter o mock do Municipio do use() global
    Municipio = global.use('App/Models/Municipio');
    
    // Resetar o mock
    Municipio.query.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('deve retornar lista de municípios com sucesso', async () => {
    const mockData = [
      { id_municipio: 1, nome: 'Município 1' },
      { id_municipio: 2, nome: 'Município 2' },
    ];

    const mockQueryBuilder = global.createMockQueryBuilder();
    mockQueryBuilder.fetch.mockResolvedValue(mockData);
    
    Municipio.query.mockReturnValue(mockQueryBuilder);

    const result = await controller.index();

    expect(result).toEqual(mockData);
    expect(Municipio.query).toHaveBeenCalled();
    expect(mockQueryBuilder.from).toHaveBeenCalledWith('tedplan.municipios');
    expect(mockQueryBuilder.fetch).toHaveBeenCalled();
  });

  test('deve retornar array vazio quando não há municípios', async () => {
    const mockQueryBuilder = global.createMockQueryBuilder();
    mockQueryBuilder.fetch.mockResolvedValue([]);
    
    Municipio.query.mockReturnValue(mockQueryBuilder);

    const result = await controller.index();

    expect(result).toEqual([]);
    expect(Municipio.query).toHaveBeenCalled();
  });

  test('deve lidar com erros do banco de dados', async () => {
    const error = new Error('Database connection error');
    const mockQueryBuilder = global.createMockQueryBuilder();
    mockQueryBuilder.fetch.mockRejectedValue(error);
    
    Municipio.query.mockReturnValue(mockQueryBuilder);

    await expect(controller.index()).rejects.toThrow('Database connection error');
  });
});

