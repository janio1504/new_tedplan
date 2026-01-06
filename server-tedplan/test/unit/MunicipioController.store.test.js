const path = require('path');
const MunicipioController = require(path.join(__dirname, '../../app/Controllers/Http/MunicipioController'));
const { createMockRequest, createMockResponse } = require('../helpers/mockRequestResponse');
const { sanitizeInteger, sanitizeDecimal } = require('../helpers/sanitizeHelpers');

describe('MunicipioController - store()', () => {
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

  describe('Validação de id_municipio', () => {
    test('deve retornar erro 400 quando id_municipio não é fornecido', async () => {
      request = createMockRequest({});

      await controller.store({ request, response });

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({
        error: 'ID do município é obrigatório e deve ser um número válido'
      });
    });

    test('deve retornar erro 400 quando id_municipio é undefined', async () => {
      request = createMockRequest({ id_municipio: undefined });

      await controller.store({ request, response });

      expect(response.status).toHaveBeenCalledWith(400);
    });

    test('deve retornar erro 400 quando id_municipio é null', async () => {
      request = createMockRequest({ id_municipio: null });

      await controller.store({ request, response });

      expect(response.status).toHaveBeenCalledWith(400);
    });

    test('deve retornar erro 400 quando id_municipio é string vazia', async () => {
      request = createMockRequest({ id_municipio: '' });

      await controller.store({ request, response });

      expect(response.status).toHaveBeenCalledWith(400);
    });
  });

  describe('Atualização de dados do município', () => {
    test('deve atualizar dados básicos do município com sucesso', async () => {
      const municipioData = {
        id_municipio: 1,
        municipio_nome: 'Município Teste',
        municipio_codigo_ibge: '123456',
        municipio_cnpj: '12345678000190',
        municipio_cep: '12345678',
        municipio_endereco: 'Rua Teste',
        municipio_numero: '123',
        municipio_bairro: 'Centro',
        municipio_telefone: '1234567890',
        municipio_email: 'teste@teste.com',
        municipio_prefeito: 'Prefeito Teste',
        municipio_nome_prefeitura: 'Prefeitura Teste',
      };

      request = createMockRequest(municipioData);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.update.mockResolvedValue(1);
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(Municipio.query).toHaveBeenCalled();
      expect(mockQueryBuilder.from).toHaveBeenCalledWith('tedplan.municipios');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('id_municipio', 1);
      expect(response.status).toHaveBeenCalledWith(200);
    });

    test('deve retornar 404 quando município não existe (UPDATE afetou 0 linhas)', async () => {
      const municipioData = {
        id_municipio: 999,
        municipio_nome: 'Município Inexistente',
      };

      request = createMockRequest(municipioData);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.update.mockResolvedValue(0);
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({ error: 'Município não encontrado' });
    });

    test('deve permitir atualizar municípios diferentes (ids diferentes) sem duplicar', async () => {
      const response1 = createMockResponse();
      const response2 = createMockResponse();

      const mockQueryBuilder1 = global.createMockQueryBuilder();
      mockQueryBuilder1.update.mockResolvedValue(1);
      const mockQueryBuilder2 = global.createMockQueryBuilder();
      mockQueryBuilder2.update.mockResolvedValue(1);

      // Cada chamada do store (menu a menu) deve disparar apenas 1 query em municipios
      Municipio.query
        .mockReturnValueOnce(mockQueryBuilder1)
        .mockReturnValueOnce(mockQueryBuilder2);

      await controller.store({
        request: createMockRequest({ id_municipio: 1, municipio_nome: 'Município A' }),
        response: response1
      });

      await controller.store({
        request: createMockRequest({ id_municipio: 2, municipio_nome: 'Município B' }),
        response: response2
      });

      expect(mockQueryBuilder1.where).toHaveBeenCalledWith('id_municipio', 1);
      expect(mockQueryBuilder2.where).toHaveBeenCalledWith('id_municipio', 2);
      expect(response1.status).toHaveBeenCalledWith(200);
      expect(response2.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Sanitização de valores', () => {
    test('deve sanitizar id_municipio corretamente', () => {
      expect(sanitizeInteger(1)).toBe(1);
      expect(sanitizeInteger('1')).toBe(1);
      expect(sanitizeInteger(undefined)).toBeNull();
      expect(sanitizeInteger(null)).toBeNull();
      expect(sanitizeInteger('')).toBeNull();
      expect(sanitizeInteger('undefined')).toBeNull();
      expect(sanitizeInteger('null')).toBeNull();
    });

    test('deve sanitizar valores decimal corretamente', () => {
      expect(sanitizeDecimal(1.5)).toBe(1.5);
      expect(sanitizeDecimal('1.5')).toBe(1.5);
      expect(sanitizeDecimal(undefined)).toBeNull();
      expect(sanitizeDecimal(null)).toBeNull();
      expect(sanitizeDecimal('')).toBeNull();
    });
  });

  describe('Salvamento de Titular de Serviços', () => {
    test('deve criar novo titular quando NÃO existe titular para o município', async () => {
      const data = {
        id_municipio: 1,
        ts_setor_responsavel: 'Setor Teste',
        ts_responsavel: 'Responsável Teste',
        ts_cargo: 'Cargo Teste',
        ts_telefone: '1234567890',
        ts_email: 'teste@teste.com',
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue(null); // não existe -> inserir
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(Municipio.query).toHaveBeenCalled();
      expect(mockQueryBuilder.from).toHaveBeenCalledWith('tedplan.titular_servicos_ms');
      expect(mockQueryBuilder.insert).toHaveBeenCalled();
    });

    test('deve atualizar titular quando JÁ existe titular para o município (evitar duplicidade)', async () => {
      const data = {
        id_municipio: 1,
        ts_setor_responsavel: 'Setor Atualizado',
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue({ id_titular_servicos_ms: 10, id_municipio: 1 });
      mockQueryBuilder.update.mockResolvedValue(1);
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(Municipio.query).toHaveBeenCalled();
      expect(mockQueryBuilder.from).toHaveBeenCalledWith('tedplan.titular_servicos_ms');
      expect(mockQueryBuilder.update).toHaveBeenCalled();
      expect(mockQueryBuilder.insert).not.toHaveBeenCalled();
    });
  });

  describe('Salvamento de Prestadores de Serviços - Abastecimento de Água', () => {
    test('deve criar novo prestador quando não existe registro para o município', async () => {
      const data = {
        id_municipio: 1,
        aa_secretaria_setor_responsavel: 'Setor AA',
        aa_abrangencia: 'Municipal',
        aa_natureza_juridica: 'Empresa Privada',
        aa_cnpj: '12345678000190',
        aa_telefone: '1234567890',
        aa_cep: '12345678',
        aa_endereco: 'Rua AA',
        aa_numero: '123',
        aa_bairro: 'Centro',
        aa_responsavel: 'Responsável AA',
        aa_cargo: 'Cargo AA',
        aa_email: 'aa@teste.com',
      };

      request = createMockRequest(data);

      // Mock: primeiro verifica se existe (retorna null), depois insere
      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue(null); // Não existe registro
      mockQueryBuilder.insert.mockResolvedValue({});
      
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(Municipio.query).toHaveBeenCalled();
      expect(mockQueryBuilder.insert).toHaveBeenCalled();
    });

    test('deve atualizar prestador existente quando já existe registro para o município', async () => {
      const data = {
        id_municipio: 1,
        aa_secretaria_setor_responsavel: 'Setor AA Atualizado',
        aa_abrangencia: 'Municipal',
        aa_natureza_juridica: 'Empresa Privada',
        aa_cnpj: '12345678000190',
        aa_telefone: '1234567890',
        aa_cep: '12345678',
        aa_endereco: 'Rua AA',
        aa_numero: '123',
        aa_bairro: 'Centro',
        aa_responsavel: 'Responsável AA',
        aa_cargo: 'Cargo AA',
        aa_email: 'aa@teste.com',
      };

      request = createMockRequest(data);

      // Mock: primeiro verifica se existe (retorna registro), depois atualiza
      const mockQueryBuilder = global.createMockQueryBuilder();
      const existingRecord = { id_ps_abastecimento_agua: 1, id_municipio: 1 };
      mockQueryBuilder.first.mockResolvedValue(existingRecord); // Existe registro
      mockQueryBuilder.update.mockResolvedValue({});
      
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(Municipio.query).toHaveBeenCalled();
      // Verificar que update foi chamado (significa que encontrou registro existente)
      expect(mockQueryBuilder.update).toHaveBeenCalled();
    });
  });

  describe('Tratamento de erros', () => {
    test('deve retornar erro 500 quando ocorre erro no banco de dados', async () => {
      const data = {
        id_municipio: 1,
        municipio_nome: 'Teste',
      };

      request = createMockRequest(data);

      const error = new Error('Database error');
      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.update.mockRejectedValue(error);
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({
        error: 'Erro ao salvar dados do município',
        details: 'Database error'
      });
    });

    test('deve logar detalhes do erro quando ocorre exceção', async () => {
      const data = {
        id_municipio: 1,
        municipio_nome: 'Teste',
      };

      request = createMockRequest(data);

      const error = new Error('Test error');
      error.code = 'TEST_ERROR';
      error.detail = 'Test detail';
      error.hint = 'Test hint';
      error.where = 'Test where';

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      Municipio.query = jest.fn().mockReturnValue({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        update: jest.fn().mockRejectedValue(error),
      });

      await controller.store({ request, response });

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Sucesso no salvamento', () => {
    test('deve retornar 200 quando todos os dados são salvos com sucesso', async () => {
      const data = {
        id_municipio: 1,
        municipio_nome: 'Município Teste',
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.update.mockResolvedValue(1);
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Dados salvos com sucesso'
      });
    });
  });
});

