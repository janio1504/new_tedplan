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

  describe('Prestadores de Serviços - Abastecimento de Água (menu a menu)', () => {
    test('deve criar prestador quando não existe e retornar 200', async () => {
      const data = {
        id_municipio: 1,
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
        aa_secretaria_setor_responsavel: 'Setor AA',
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue(null);
      mockQueryBuilder.insert.mockResolvedValue({});
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.from).toHaveBeenCalledWith('tedplan.ps_abastecimento_agua');
      expect(mockQueryBuilder.insert).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(200);
    });

    test('deve atualizar apenas campos enviados quando prestador já existe', async () => {
      const data = {
        id_municipio: 1,
        aa_abrangencia: 'Estadual',
        aa_cnpj: '98765432000100',
        // Não enviar outros campos
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue({ id_ps_abastecimento_agua: 1, id_municipio: 1 });
      mockQueryBuilder.update.mockResolvedValue(1);
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.update).toHaveBeenCalled();
      const updateCall = mockQueryBuilder.update.mock.calls[0][0];
      expect(updateCall).toHaveProperty('ps_abrangencia', 'Estadual');
      expect(updateCall).toHaveProperty('ps_cnpj', '98765432000100');
      expect(response.status).toHaveBeenCalledWith(200);
    });

    test('não deve processar se payload contém apenas id_ps_abastecimento_agua sem campos de dados', async () => {
      const data = {
        id_municipio: 1,
        id_ps_abastecimento_agua: 1,
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.update.mockResolvedValue(1);
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.first).not.toHaveBeenCalled();
      expect(mockQueryBuilder.insert).not.toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Prestadores de Serviços - Esgotamento Sanitário (menu a menu)', () => {
    test('deve processar apenas se houver campos es_* no payload', async () => {
      const data = {
        id_municipio: 1,
        es_abrangencia: 'Municipal',
        es_cnpj: '12345678000190',
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue(null);
      mockQueryBuilder.insert.mockResolvedValue({});
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.from).toHaveBeenCalledWith('tedplan.ps_esgotamento_sanitario');
      expect(mockQueryBuilder.insert).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Prestadores de Serviços - Drenagem e Águas Pluviais (menu a menu)', () => {
    test('deve processar apenas se houver campos da_* no payload', async () => {
      const data = {
        id_municipio: 1,
        da_abrangencia: 'Municipal',
        da_cnpj: '12345678000190',
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue(null);
      mockQueryBuilder.insert.mockResolvedValue({});
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.from).toHaveBeenCalledWith('tedplan.ps_drenagem_aguas_pluviais');
      expect(mockQueryBuilder.insert).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Prestadores de Serviços - Resíduos Sólidos (menu a menu)', () => {
    test('deve processar apenas se houver campos rs_* no payload', async () => {
      const data = {
        id_municipio: 1,
        rs_abrangencia: 'Municipal',
        rs_cnpj: '12345678000190',
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue(null);
      mockQueryBuilder.insert.mockResolvedValue({});
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.from).toHaveBeenCalledWith('tedplan.ps_residuo_solido');
      expect(mockQueryBuilder.insert).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Regulador e Fiscalizador (menu a menu)', () => {
    test('deve criar regulador quando não existe e retornar 200', async () => {
      const data = {
        id_municipio: 1,
        rf_setor_responsavel: 'Setor RF',
        rf_responsavel: 'Responsável RF',
        rf_cargo: 'Cargo RF',
        rf_telefone: '1234567890',
        rf_email: 'rf@teste.com',
        rf_descricao: 'Descrição RF',
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue(null);
      mockQueryBuilder.insert.mockResolvedValue({});
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.from).toHaveBeenCalledWith('tedplan.regulador_fiscalizador_ss');
      expect(mockQueryBuilder.insert).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(200);
    });

    test('deve atualizar apenas campos enviados quando regulador já existe', async () => {
      const data = {
        id_municipio: 1,
        rf_setor_responsavel: 'Setor RF Atualizado',
        rf_email: 'novo@teste.com',
        // Não enviar outros campos
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue({ id_regulador_fiscalizador_ss: 1, id_municipio: 1 });
      mockQueryBuilder.update.mockResolvedValue(1);
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.update).toHaveBeenCalled();
      const updateCall = mockQueryBuilder.update.mock.calls[0][0];
      expect(updateCall).toHaveProperty('setor_responsavel', 'Setor RF Atualizado');
      expect(updateCall).toHaveProperty('email', 'novo@teste.com');
      expect(response.status).toHaveBeenCalledWith(200);
    });

    test('não deve processar se payload contém apenas id_regulador_fiscalizador_ss sem campos de dados', async () => {
      const data = {
        id_municipio: 1,
        id_regulador_fiscalizador_ss: 1,
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.update.mockResolvedValue(1);
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.first).not.toHaveBeenCalled();
      expect(mockQueryBuilder.insert).not.toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Controle Social (menu a menu)', () => {
    test('deve criar controle social quando não existe e retornar 200', async () => {
      const data = {
        id_municipio: 1,
        cs_setor_responsavel: 'Setor CS',
        cs_telefone: '1234567890',
        cs_email: 'cs@teste.com',
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue(null);
      mockQueryBuilder.insert.mockResolvedValue({});
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.from).toHaveBeenCalledWith('tedplan.controle_social_sms');
      expect(mockQueryBuilder.insert).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(200);
    });

    test('deve atualizar apenas campos enviados quando controle social já existe', async () => {
      const data = {
        id_municipio: 1,
        cs_setor_responsavel: 'Setor CS Atualizado',
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue({ id_controle_social_sms: 1, id_municipio: 1 });
      mockQueryBuilder.update.mockResolvedValue(1);
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.update).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Responsável SIMISAB (menu a menu)', () => {
    test('deve criar responsável quando não existe e retornar 200', async () => {
      const data = {
        id_municipio: 1,
        simisab_responsavel: 'Responsável SIMISAB',
        simisab_telefone: '1234567890',
        simisab_email: 'simisab@teste.com',
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue(null);
      mockQueryBuilder.insert.mockResolvedValue({});
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.from).toHaveBeenCalledWith('tedplan.responsavel_simisab');
      expect(mockQueryBuilder.insert).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(200);
    });

    test('deve atualizar apenas campos enviados quando responsável já existe', async () => {
      const data = {
        id_municipio: 1,
        simisab_email: 'novo@teste.com',
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue({ id_responsavel_simisab: 1, id_municipio: 1 });
      mockQueryBuilder.update.mockResolvedValue(1);
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.update).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Conselho Municipal (menu a menu)', () => {
    test('deve criar conselho quando não existe e retornar 200', async () => {
      const data = {
        id_municipio: 1,
        possui_conselho: 'sim',
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue(null);
      mockQueryBuilder.insert.mockResolvedValue({});
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.from).toHaveBeenCalledWith('tedplan.conselho_municipal');
      expect(mockQueryBuilder.insert).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(200);
    });

    test('deve atualizar apenas campos enviados quando conselho já existe', async () => {
      const data = {
        id_municipio: 1,
        possui_conselho: 'nao',
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue({ id_conselho_municipal: 1, id_municipio: 1 });
      mockQueryBuilder.update.mockResolvedValue(1);
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.update).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(200);
    });

    test('deve atualizar quando altera de sim para outros com descrição', async () => {
      const data = {
        id_municipio: 1,
        possui_conselho: 'outros',
        descricao_outros: 'Descrição do conselho',
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue({ 
        id_conselho_municipal: 1, 
        id_municipio: 1,
        possui_conselho: 'sim' 
      });
      mockQueryBuilder.update.mockResolvedValue(1);
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.update).toHaveBeenCalled();
      const updateCall = mockQueryBuilder.update.mock.calls[0][0];
      expect(updateCall).toHaveProperty('possui_conselho', 'outros');
      expect(updateCall).toHaveProperty('descricao_outros', 'Descrição do conselho');
      expect(response.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Dados Geográficos (menu a menu)', () => {
    test('deve criar dados geográficos quando não existe e retornar 200', async () => {
      const data = {
        id_municipio: 1,
        OGM0001: 100,
        OGM0002: 200,
        OGM0003: 300,
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue(null);
      mockQueryBuilder.insert.mockResolvedValue({});
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.from).toHaveBeenCalledWith('tedplan.dados_geograficos');
      expect(mockQueryBuilder.insert).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(200);
    });

    test('deve atualizar apenas campos enviados quando dados geográficos já existem', async () => {
      const data = {
        id_municipio: 1,
        OGM0001: 150,
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue({ id_dados_geograficos: 1, id_municipio: 1 });
      mockQueryBuilder.update.mockResolvedValue(1);
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.update).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Dados Demográficos (menu a menu)', () => {
    test('deve criar dados demográficos quando não existe e retornar 200', async () => {
      const data = {
        id_municipio: 1,
        dd_populacao_urbana: '1000',
        dd_populacao_rural: '500',
        dd_total_moradias: '800',
        OGM4001: 100,
        OGM4002: 50,
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue(null);
      mockQueryBuilder.insert.mockResolvedValue({});
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.from).toHaveBeenCalledWith('tedplan.dados_demograficos');
      expect(mockQueryBuilder.insert).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(200);
    });

    test('deve atualizar apenas campos enviados quando dados demográficos já existem', async () => {
      const data = {
        id_municipio: 1,
        dd_populacao_urbana: '1500',
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue({ id_dados_demograficos: 1, id_municipio: 1 });
      mockQueryBuilder.update.mockResolvedValue(1);
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.update).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(200);
    });

    test('deve tratar campos de texto e numéricos corretamente', async () => {
      const data = {
        id_municipio: 1,
        dd_populacao_urbana: '1000',
        OGM4001: 100,
        OGM4007: 100.50,
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue(null);
      mockQueryBuilder.insert.mockResolvedValue({});
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      const insertCall = mockQueryBuilder.insert.mock.calls[0][0];
      expect(insertCall.populacao_urbana).toBe('1000');
      expect(insertCall.OGM4001).toBe(100);
      expect(insertCall.OGM4007).toBe(100.50);
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

