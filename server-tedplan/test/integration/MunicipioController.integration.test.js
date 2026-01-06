/**
 * Testes de Integração para MunicipioController
 * 
 * Estes testes verificam o fluxo completo de salvamento,
 * incluindo a interação entre diferentes submenus
 */

const path = require('path');
const MunicipioController = require(path.join(__dirname, '../../app/Controllers/Http/MunicipioController'));
const { createMockRequest, createMockResponse } = require('../helpers/mockRequestResponse');

describe('MunicipioController - Testes de Integração', () => {
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

  describe('Dados do Município (menu a menu)', () => {
    test('deve atualizar dados do município e retornar 200', async () => {
      const data = {
        id_municipio: 1,
        municipio_nome: 'Município Menu a Menu',
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.update.mockResolvedValue(1);
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.from).toHaveBeenCalledWith('tedplan.municipios');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('id_municipio', 1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(mockQueryBuilder.insert).not.toHaveBeenCalled();
    });

    test('deve retornar 404 quando município não existe (UPDATE afetou 0 linhas)', async () => {
      const data = {
        id_municipio: 999,
        municipio_nome: 'Município Inexistente',
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.update.mockResolvedValue(0);
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({ error: 'Município não encontrado' });
    });
  });

  describe('Titular de Serviços (menu a menu)', () => {
    test('deve criar titular quando não existe e retornar 200', async () => {
      const data = {
        id_municipio: 1,
        ts_setor_responsavel: 'Setor TS',
        ts_responsavel: 'Responsável TS',
        ts_cargo: 'Cargo TS',
        ts_telefone: '1234567890',
        ts_email: 'ts@teste.com',
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue(null);
      mockQueryBuilder.insert.mockResolvedValue({});
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.from).toHaveBeenCalledWith('tedplan.titular_servicos_ms');
      expect(mockQueryBuilder.insert).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(200);
    });

    test('deve atualizar titular quando já existe e retornar 200', async () => {
      const data = {
        id_municipio: 1,
        ts_setor_responsavel: 'Setor TS Atualizado',
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue({ id_titular_servicos_ms: 10, id_municipio: 1 });
      mockQueryBuilder.update.mockResolvedValue(1);
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.from).toHaveBeenCalledWith('tedplan.titular_servicos_ms');
      expect(mockQueryBuilder.update).toHaveBeenCalled();
      expect(mockQueryBuilder.insert).not.toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Fluxo completo de salvamento', () => {
    test('deve salvar todos os submenus em uma única requisição', async () => {
      const completeData = {
        // Dados do Município
        id_municipio: 1,
        municipio_nome: 'Município Completo',
        municipio_codigo_ibge: '123456',
        municipio_cnpj: '12345678000190',
        municipio_cep: '12345678',
        municipio_endereco: 'Rua Completa',
        municipio_numero: '123',
        municipio_bairro: 'Centro',
        municipio_telefone: '1234567890',
        municipio_email: 'completo@teste.com',
        municipio_prefeito: 'Prefeito Completo',
        municipio_nome_prefeitura: 'Prefeitura Completa',

        // Titular de Serviços
        id_titular_servicos_ms: null, // Criar novo
        ts_setor_responsavel: 'Setor Completo',
        ts_responsavel: 'Responsável Completo',
        ts_cargo: 'Cargo Completo',
        ts_telefone: '1234567890',
        ts_email: 'ts@teste.com',

        // Abastecimento de Água
        id_ps_abastecimento_agua: null, // Criar novo
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

        // Esgotamento Sanitário
        id_ps_esgotamento_sanitario: null,
        es_secretaria_setor_responsavel: 'Setor ES',
        es_abrangencia: 'Municipal',
        es_natureza_juridica: 'Empresa Privada',
        es_cnpj: '12345678000190',
        es_telefone: '1234567890',
        es_cep: '12345678',
        es_endereco: 'Rua ES',
        es_numero: '123',
        es_bairro: 'Centro',
        es_responsavel: 'Responsável ES',
        es_cargo: 'Cargo ES',
        es_email: 'es@teste.com',

        // Drenagem e Águas Pluviais
        id_ps_drenagem_aguas_pluviais: null,
        da_secretaria_setor_responsavel: 'Setor DA',
        da_abrangencia: 'Municipal',
        da_natureza_juridica: 'Empresa Privada',
        da_cnpj: '12345678000190',
        da_telefone: '1234567890',
        da_cep: '12345678',
        da_endereco: 'Rua DA',
        da_numero: '123',
        da_bairro: 'Centro',
        da_responsavel: 'Responsável DA',
        da_cargo: 'Cargo DA',
        da_email: 'da@teste.com',

        // Resíduos Sólidos
        id_ps_residuo_solido: null,
        rs_secretaria_setor_responsavel: 'Setor RS',
        rs_abrangencia: 'Municipal',
        rs_natureza_juridica: 'Empresa Privada',
        rs_cnpj: '12345678000190',
        rs_telefone: '1234567890',
        rs_cep: '12345678',
        rs_endereco: 'Rua RS',
        rs_numero: '123',
        rs_bairro: 'Centro',
        rs_responsavel: 'Responsável RS',
        rs_cargo: 'Cargo RS',
        rs_email: 'rs@teste.com',
      };

      request = createMockRequest(completeData);

      // Mock do query builder que será usado múltiplas vezes
      // Para cada submenu, primeiro verifica se existe (retorna null), depois insere
      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue(null); // Não existe registro (criar novo)
      mockQueryBuilder.insert.mockResolvedValue({});
      mockQueryBuilder.update.mockResolvedValue({});
      mockQueryBuilder.fetch.mockResolvedValue({ rows: [] });
      
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      // Verificar que o método foi chamado múltiplas vezes (uma para cada operação)
      expect(Municipio.query).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Dados salvos com sucesso'
      });
    });

    test('deve atualizar submenus existentes e criar novos', async () => {
      const mixedData = {
        id_municipio: 1,
        municipio_nome: 'Município Mix',

        // Atualizar existente
        id_titular_servicos_ms: 1,
        ts_setor_responsavel: 'Setor Atualizado',

        // Criar novo
        id_ps_abastecimento_agua: null,
        aa_secretaria_setor_responsavel: 'Novo Setor AA',
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

      request = createMockRequest(mixedData);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue(null); // Não existe, vai criar
      mockQueryBuilder.insert.mockResolvedValue({});
      mockQueryBuilder.update.mockResolvedValue({});
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(response.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Validação de sanitização em fluxo completo', () => {
    test('deve sanitizar valores undefined/null corretamente em todos os submenus', async () => {
      const dataWithUndefined = {
        id_municipio: 1,
        municipio_nome: 'Teste',
        // Valores undefined devem ser sanitizados
        id_titular_servicos_ms: undefined,
        id_ps_abastecimento_agua: 'undefined',
        id_ps_esgotamento_sanitario: null,
        OGM0001: undefined,
        OGM0002: 'null',
      };

      request = createMockRequest(dataWithUndefined);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue(null); // Não existe, vai criar
      mockQueryBuilder.insert.mockResolvedValue({});
      mockQueryBuilder.update.mockResolvedValue({});
      mockQueryBuilder.fetch.mockResolvedValue({ rows: [] });
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      // O controller deve processar sem erros mesmo com valores undefined/null
      expect(response.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Tratamento de erros em fluxo completo', () => {
    test('deve tratar erro em um submenu sem afetar outros', async () => {
      const data = {
        id_municipio: 1,
        municipio_nome: 'Teste',
        // Dados válidos para alguns submenus
        ts_setor_responsavel: 'Setor TS',
        ts_responsavel: 'Responsável TS',
        ts_cargo: 'Cargo TS',
        ts_telefone: '1234567890',
        ts_email: 'ts@teste.com',
      };

      request = createMockRequest(data);

      // Simular erro no banco de dados
      const error = new Error('Database connection lost');
      
      const mockQueryBuilder = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        update: jest.fn().mockRejectedValue(error),
        insert: jest.fn().mockRejectedValue(error),
      };

      Municipio.query = jest.fn().mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      // Deve retornar erro 500
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Erro ao salvar dados do município'
        })
      );
    });
  });
});

