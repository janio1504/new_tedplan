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

    test('deve atualizar apenas campos enviados no payload (menu-a-menu)', async () => {
      const data = {
        id_municipio: 1,
        aa_abrangencia: 'Municipal',
        aa_cnpj: '12345678000190',
        // Não enviar outros campos
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      const existingRecord = { id_ps_abastecimento_agua: 1, id_municipio: 1 };
      mockQueryBuilder.first.mockResolvedValue(existingRecord);
      mockQueryBuilder.update.mockResolvedValue({});
      
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.update).toHaveBeenCalled();
      // Verificar que apenas os campos enviados foram atualizados
      const updateCall = mockQueryBuilder.update.mock.calls[0][0];
      expect(updateCall).toHaveProperty('ps_abrangencia', 'Municipal');
      expect(updateCall).toHaveProperty('ps_cnpj', '12345678000190');
      expect(updateCall).not.toHaveProperty('ps_telefone');
      expect(updateCall).not.toHaveProperty('ps_endereco');
    });

    test('não deve processar se payload contém apenas id_ps_abastecimento_agua sem campos de dados', async () => {
      const data = {
        id_municipio: 1,
        id_ps_abastecimento_agua: 1,
        // Sem campos aa_*
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.update.mockResolvedValue(1);
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      // Não deve chamar first() para verificar existência (não processa)
      expect(mockQueryBuilder.first).not.toHaveBeenCalled();
      expect(mockQueryBuilder.insert).not.toHaveBeenCalled();
    });
  });

  describe('Salvamento de Prestadores de Serviços - Esgotamento Sanitário (menu-a-menu)', () => {
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

      expect(mockQueryBuilder.first).toHaveBeenCalled();
      expect(mockQueryBuilder.insert).toHaveBeenCalled();
    });

    test('não deve processar se payload contém apenas id_ps_esgotamento_sanitario sem campos de dados', async () => {
      const data = {
        id_municipio: 1,
        id_ps_esgotamento_sanitario: 1,
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.update.mockResolvedValue(1);
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.first).not.toHaveBeenCalled();
    });
  });

  describe('Salvamento de Prestadores de Serviços - Drenagem e Águas Pluviais (menu-a-menu)', () => {
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

      expect(mockQueryBuilder.first).toHaveBeenCalled();
      expect(mockQueryBuilder.insert).toHaveBeenCalled();
    });
  });

  describe('Salvamento de Prestadores de Serviços - Resíduos Sólidos (menu-a-menu)', () => {
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

      expect(mockQueryBuilder.first).toHaveBeenCalled();
      expect(mockQueryBuilder.insert).toHaveBeenCalled();
    });
  });

  describe('Salvamento de Regulador e Fiscalizador (menu-a-menu)', () => {
    test('deve criar regulador quando não existe registro para o município', async () => {
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
    });

    test('deve atualizar regulador existente quando já existe registro para o município', async () => {
      const data = {
        id_municipio: 1,
        rf_setor_responsavel: 'Setor RF Atualizado',
        rf_responsavel: 'Responsável RF Atualizado',
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      const existingRecord = { id_regulador_fiscalizador_ss: 1, id_municipio: 1 };
      mockQueryBuilder.first.mockResolvedValue(existingRecord);
      mockQueryBuilder.update.mockResolvedValue({});
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.update).toHaveBeenCalled();
      expect(mockQueryBuilder.insert).not.toHaveBeenCalled();
    });

    test('deve atualizar apenas campos enviados no payload (menu-a-menu)', async () => {
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
      expect(updateCall).not.toHaveProperty('nome_responsavel');
      expect(updateCall).not.toHaveProperty('cargo');
    });

    test('não deve processar se payload contém apenas id_regulador_fiscalizador_ss sem campos de dados', async () => {
      const data = {
        id_municipio: 1,
        id_regulador_fiscalizador_ss: 1,
        // Sem campos rf_*
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.update.mockResolvedValue(1);
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.first).not.toHaveBeenCalled();
      expect(mockQueryBuilder.insert).not.toHaveBeenCalled();
    });
  });

  describe('Salvamento de Controle Social (menu-a-menu)', () => {
    test('deve criar controle social quando não existe registro para o município', async () => {
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
    });

    test('deve atualizar apenas campos enviados quando controle social já existe', async () => {
      const data = {
        id_municipio: 1,
        cs_setor_responsavel: 'Setor CS Atualizado',
        // Não enviar outros campos
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue({ id_controle_social_sms: 1, id_municipio: 1 });
      mockQueryBuilder.update.mockResolvedValue(1);
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.update).toHaveBeenCalled();
      const updateCall = mockQueryBuilder.update.mock.calls[0][0];
      expect(updateCall).toHaveProperty('setor_responsavel_cs_sms', 'Setor CS Atualizado');
      expect(updateCall).not.toHaveProperty('telefone_cs_sms');
    });

    test('não deve processar se payload contém apenas id_controle_social_sms sem campos de dados', async () => {
      const data = {
        id_municipio: 1,
        id_controle_social_sms: 1,
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.update.mockResolvedValue(1);
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.first).not.toHaveBeenCalled();
    });
  });

  describe('Salvamento de Responsável SIMISAB (menu-a-menu)', () => {
    test('deve criar responsável quando não existe registro para o município', async () => {
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
    });

    test('deve atualizar apenas campos enviados quando responsável já existe', async () => {
      const data = {
        id_municipio: 1,
        simisab_email: 'novo@teste.com',
        // Não enviar outros campos
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue({ id_responsavel_simisab: 1, id_municipio: 1 });
      mockQueryBuilder.update.mockResolvedValue(1);
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.update).toHaveBeenCalled();
      const updateCall = mockQueryBuilder.update.mock.calls[0][0];
      expect(updateCall).toHaveProperty('simisab_email', 'novo@teste.com');
      expect(updateCall).not.toHaveProperty('simisab_nome_responsavel');
    });

    test('não deve processar se payload contém apenas id_responsavel_simisab sem campos de dados', async () => {
      const data = {
        id_municipio: 1,
        id_responsavel_simisab: 1,
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.update.mockResolvedValue(1);
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.first).not.toHaveBeenCalled();
    });
  });

  describe('Salvamento de Conselho Municipal (menu-a-menu)', () => {
    test('deve criar conselho quando não existe registro para o município', async () => {
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
    });

    test('deve atualizar apenas campos enviados quando conselho já existe', async () => {
      const data = {
        id_municipio: 1,
        possui_conselho: 'nao',
        // Não enviar descricao_outros
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue({ id_conselho_municipal: 1, id_municipio: 1 });
      mockQueryBuilder.update.mockResolvedValue(1);
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.update).toHaveBeenCalled();
      const updateCall = mockQueryBuilder.update.mock.calls[0][0];
      expect(updateCall).toHaveProperty('possui_conselho', 'nao');
      expect(updateCall).not.toHaveProperty('descricao_outros');
    });

    test('deve atualizar quando altera de sim para nao', async () => {
      const data = {
        id_municipio: 1,
        possui_conselho: 'nao',
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
      expect(updateCall).toHaveProperty('possui_conselho', 'nao');
    });

    test('não deve processar se payload contém apenas id_conselho_municipal sem campos de dados', async () => {
      const data = {
        id_municipio: 1,
        id_conselho_municipal: 1,
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.update.mockResolvedValue(1);
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.first).not.toHaveBeenCalled();
    });
  });

  describe('Salvamento de Dados Geográficos (menu-a-menu)', () => {
    test('deve criar dados geográficos quando não existe registro para o município', async () => {
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
    });

    test('deve atualizar apenas campos enviados quando dados geográficos já existem', async () => {
      const data = {
        id_municipio: 1,
        OGM0001: 150,
        // Não enviar outros campos
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue({ id_dados_geograficos: 1, id_municipio: 1 });
      mockQueryBuilder.update.mockResolvedValue(1);
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.update).toHaveBeenCalled();
      const updateCall = mockQueryBuilder.update.mock.calls[0][0];
      expect(updateCall).toHaveProperty('ogm0001', 150);
      expect(updateCall).not.toHaveProperty('ogm0002');
    });

    test('não deve processar se payload contém apenas id_dados_geograficos sem campos de dados', async () => {
      const data = {
        id_municipio: 1,
        id_dados_geograficos: 1,
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.update.mockResolvedValue(1);
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.first).not.toHaveBeenCalled();
    });
  });

  describe('Salvamento de Dados Demográficos (menu-a-menu)', () => {
    test('deve criar dados demográficos quando não existe registro para o município', async () => {
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
    });

    test('deve atualizar apenas campos enviados quando dados demográficos já existem', async () => {
      const data = {
        id_municipio: 1,
        dd_populacao_urbana: '1500',
        // Não enviar outros campos
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue({ id_dados_demograficos: 1, id_municipio: 1 });
      mockQueryBuilder.update.mockResolvedValue(1);
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.update).toHaveBeenCalled();
      const updateCall = mockQueryBuilder.update.mock.calls[0][0];
      expect(updateCall).toHaveProperty('populacao_urbana', '1500');
      expect(updateCall).not.toHaveProperty('populacao_rural');
    });

    test('deve tratar campos de texto corretamente (populacao_urbana, populacao_rural, etc)', async () => {
      const data = {
        id_municipio: 1,
        dd_populacao_urbana: '1000',
        dd_populacao_rural: '500',
        dd_populacao_total: '1500',
        dd_total_moradias: '800',
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue(null);
      mockQueryBuilder.insert.mockResolvedValue({});
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      const insertCall = mockQueryBuilder.insert.mock.calls[0][0];
      expect(insertCall.populacao_urbana).toBe('1000');
      expect(insertCall.populacao_rural).toBe('500');
      expect(insertCall.populacao_total).toBe('1500');
      expect(insertCall.total_moradias).toBe('800');
    });

    test('deve tratar campos integer corretamente (OGM4001-OGM4006)', async () => {
      const data = {
        id_municipio: 1,
        OGM4001: 100,
        OGM4002: 50,
        OGM4003: 150,
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue(null);
      mockQueryBuilder.insert.mockResolvedValue({});
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      const insertCall = mockQueryBuilder.insert.mock.calls[0][0];
      expect(insertCall.OGM4001).toBe(100);
      expect(insertCall.OGM4002).toBe(50);
      expect(insertCall.OGM4003).toBe(150);
    });

    test('deve tratar campos decimal corretamente (OGM4007-OGM4009)', async () => {
      const data = {
        id_municipio: 1,
        OGM4007: 100.50,
        OGM4008: 50.25,
        OGM4009: 150.75,
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.first.mockResolvedValue(null);
      mockQueryBuilder.insert.mockResolvedValue({});
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      const insertCall = mockQueryBuilder.insert.mock.calls[0][0];
      expect(insertCall.OGM4007).toBe(100.50);
      expect(insertCall.OGM4008).toBe(50.25);
      expect(insertCall.OGM4009).toBe(150.75);
    });

    test('não deve processar se payload contém apenas id_dados_demograficos sem campos de dados', async () => {
      const data = {
        id_municipio: 1,
        id_dados_demograficos: 1,
      };

      request = createMockRequest(data);

      const mockQueryBuilder = global.createMockQueryBuilder();
      mockQueryBuilder.update.mockResolvedValue(1);
      Municipio.query.mockReturnValue(mockQueryBuilder);

      await controller.store({ request, response });

      expect(mockQueryBuilder.first).not.toHaveBeenCalled();
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

      Municipio.query = jest.fn().mockReturnValue({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        update: jest.fn().mockRejectedValue(error),
      });

      await controller.store({ request, response });

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({
        error: 'Erro ao salvar dados do município',
        details: error.message
      });
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

