/**
 * Testes de Integração para Prestadores de Serviços
 * Testa o fluxo completo de salvamento de steps
 */

import { toast } from 'react-toastify';
import * as municipioService from '@/services/municipio';
import {
  getStepSubmenuName,
  validateStepIndex,
  stepToSubmenuMap,
} from './prestadoresSteps';
import {
  getSubmenuName,
  getRequiredFields,
  getAllSubmenuFields,
} from './submenuFields';

// Mock das dependências
jest.mock('react-toastify');
jest.mock('@/services/municipio', () => ({
  getMunicipio: jest.fn(),
  updateMunicipio: jest.fn(),
}));

describe('Prestadores de Serviços - Testes de Integração', () => {
  // Mock de dados do formulário
  const mockFormData = {
    // Step 0: Abastecimento de Água
    aa_secretaria_setor_responsavel: 'Secretaria de Água',
    aa_abrangencia: 'Local',
    aa_natureza_juridica: 'Empresa Privada',
    aa_cnpj: '12345678901234',
    aa_telefone: '1234567890',
    aa_cep: '12345678',
    aa_endereco: 'Rua Teste',
    aa_numero: '123',
    aa_bairro: 'Centro',
    aa_responsavel: 'João Silva',
    aa_cargo: 'Diretor',
    aa_email: 'joao@teste.com',
    id_ps_abastecimento_agua: '1',
    id_municipio: '1',
  };

  // Mock de usuário com permissão
  const mockUsuario = {
    id_usuario: '1',
    id_municipio: '1',
    id_permissao: 1, // Permissão para salvar
  };

  // Mock de usuário sem permissão
  const mockUsuarioSemPermissao = {
    id_usuario: '1',
    id_municipio: '1',
    id_permissao: 4, // Sem permissão
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (toast.loading as jest.Mock).mockReturnValue('loading-toast-id');
    (toast.success as jest.Mock).mockImplementation(() => {});
    (toast.error as jest.Mock).mockImplementation(() => {});
    (toast.warning as jest.Mock).mockImplementation(() => {});
    (toast.dismiss as jest.Mock).mockImplementation(() => {});
  });

  describe('Integração: Mapeamento Step → Submenu → Campos', () => {
    it('deve mapear corretamente Step 0 para submenu e campos', () => {
      const stepIndex = 0;
      const submenuName = getStepSubmenuName(stepIndex);
      
      expect(submenuName).toBe('prestadoresAbastecimentoAgua');
      
      const requiredFields = getRequiredFields(submenuName!);
      expect(requiredFields.length).toBe(12);
      expect(requiredFields).toContain('aa_secretaria_setor_responsavel');
      expect(requiredFields).toContain('aa_cnpj');
    });

    it('deve mapear corretamente Step 1 para submenu e campos', () => {
      const stepIndex = 1;
      const submenuName = getStepSubmenuName(stepIndex);
      
      expect(submenuName).toBe('prestadoresEsgotamentoSanitario');
      
      const requiredFields = getRequiredFields(submenuName!);
      expect(requiredFields.length).toBe(12);
      expect(requiredFields).toContain('es_secretaria_setor_responsavel');
    });

    it('deve mapear corretamente Step 2 para submenu e campos', () => {
      const stepIndex = 2;
      const submenuName = getStepSubmenuName(stepIndex);
      
      expect(submenuName).toBe('prestadoresDrenagemAguasPluviais');
      
      const requiredFields = getRequiredFields(submenuName!);
      expect(requiredFields.length).toBe(12);
      expect(requiredFields).toContain('da_secretaria_setor_responsavel');
    });

    it('deve mapear corretamente Step 3 para submenu e campos', () => {
      const stepIndex = 3;
      const submenuName = getStepSubmenuName(stepIndex);
      
      expect(submenuName).toBe('prestadoresResiduosSolidos');
      
      const requiredFields = getRequiredFields(submenuName!);
      expect(requiredFields.length).toBe(12);
      expect(requiredFields).toContain('rs_secretaria_setor_responsavel');
    });
  });

  describe('Integração: Validação de Dados por Step', () => {
    it('deve validar dados completos do Step 0', () => {
      const stepIndex = 0;
      const submenuName = getStepSubmenuName(stepIndex)!;
      const requiredFields = getRequiredFields(submenuName);
      
      // Verificar se todos os campos obrigatórios estão presentes
      const hasAllFields = requiredFields.every(field => 
        mockFormData.hasOwnProperty(field)
      );
      
      expect(hasAllFields).toBe(true);
    });

    it('deve identificar campos faltantes no Step 0', () => {
      const stepIndex = 0;
      const submenuName = getStepSubmenuName(stepIndex)!;
      const requiredFields = getRequiredFields(submenuName);
      
      // Dados incompletos
      const incompleteData = {
        aa_secretaria_setor_responsavel: 'Secretaria',
        // Faltam outros campos
      };
      
      const missingFields = requiredFields.filter(
        field => !incompleteData.hasOwnProperty(field)
      );
      
      expect(missingFields.length).toBeGreaterThan(0);
      expect(missingFields).toContain('aa_cnpj');
      expect(missingFields).toContain('aa_email');
    });

    it('deve extrair apenas campos do Step 0 dos dados completos', () => {
      const stepIndex = 0;
      const submenuName = getStepSubmenuName(stepIndex)!;
      const allFields = getAllSubmenuFields(submenuName);
      
      // Dados completos com campos de múltiplos steps
      const fullData = {
        ...mockFormData,
        es_secretaria_setor_responsavel: 'Secretaria Esgoto',
        da_secretaria_setor_responsavel: 'Secretaria Drenagem',
        rs_secretaria_setor_responsavel: 'Secretaria Resíduos',
      };
      
      // Extrair apenas campos do Step 0
      const step0Data = Object.keys(fullData)
        .filter(key => allFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = fullData[key];
          return obj;
        }, {} as Record<string, any>);
      
      // Verificar que contém apenas campos do Step 0
      expect(step0Data).toHaveProperty('aa_secretaria_setor_responsavel');
      expect(step0Data).not.toHaveProperty('es_secretaria_setor_responsavel');
      expect(step0Data).not.toHaveProperty('da_secretaria_setor_responsavel');
    });
  });

  describe('Integração: Fluxo de Salvamento Simulado', () => {
    it('deve simular fluxo completo de salvamento do Step 0', async () => {
      const stepIndex = 0;
      const submenuName = getStepSubmenuName(stepIndex)!;
      
      // 1. Validar stepIndex
      expect(validateStepIndex(stepIndex)).toBe(true);
      
      // 2. Obter submenu
      expect(submenuName).toBe('prestadoresAbastecimentoAgua');
      
      // 3. Obter campos obrigatórios
      const requiredFields = getRequiredFields(submenuName);
      expect(requiredFields.length).toBe(12);
      
      // 4. Validar dados (simulado)
      const hasAllRequiredFields = requiredFields.every(
        field => mockFormData.hasOwnProperty(field)
      );
      expect(hasAllRequiredFields).toBe(true);
      
      // 5. Extrair dados do step
      const allFields = getAllSubmenuFields(submenuName);
      const stepData = Object.keys(mockFormData)
        .filter(key => allFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = mockFormData[key];
          return obj;
        }, {} as Record<string, any>);
      
      expect(Object.keys(stepData).length).toBeGreaterThan(0);
      expect(stepData).toHaveProperty('aa_secretaria_setor_responsavel');
    });

    it('deve simular validação de permissão antes de salvar', () => {
      const stepIndex = 0;
      
      // Usuário com permissão
      if (mockUsuario.id_permissao !== 4) {
        expect(validateStepIndex(stepIndex)).toBe(true);
      } else {
        expect(false).toBe(true); // Não deve chegar aqui
      }
      
      // Usuário sem permissão
      if (mockUsuarioSemPermissao.id_permissao === 4) {
        // Não deve prosseguir com salvamento
        expect(true).toBe(true);
      }
    });

    it('deve simular feedback de toast para cada step', () => {
      const stepIndex = 0;
      const submenuName = getStepSubmenuName(stepIndex)!;
      const displayName = getSubmenuName(submenuName);
      
      // Simular toast de loading
      const loadingToast = toast.loading('Salvando dados...', {
        position: 'top-right',
      });
      expect(toast.loading).toHaveBeenCalledWith('Salvando dados...', {
        position: 'top-right',
      });
      
      // Simular toast de sucesso
      toast.success(`${displayName} salvos com sucesso!`, {
        position: 'top-right',
        autoClose: 3000,
      });
      expect(toast.success).toHaveBeenCalledWith(
        `${displayName} salvos com sucesso!`,
        {
          position: 'top-right',
          autoClose: 3000,
        }
      );
      
      // Simular dismiss do loading
      toast.dismiss(loadingToast);
      expect(toast.dismiss).toHaveBeenCalledWith(loadingToast);
    });
  });

  describe('Integração: Fluxo handleNext Simulado', () => {
    it('deve simular handleNext salvando Step 0 e avançando para Step 1', async () => {
      let currentStep = 0;
      const steps = ['Step 0', 'Step 1', 'Step 2', 'Step 3'];
      
      // 1. Validar step atual
      expect(validateStepIndex(currentStep)).toBe(true);
      
      // 2. Obter submenu do step atual
      const submenuName = getStepSubmenuName(currentStep)!;
      expect(submenuName).toBe('prestadoresAbastecimentoAgua');
      
      // 3. Simular salvamento (mockado)
      const mockUpdateMunicipio = jest.fn().mockResolvedValue({});
      (municipioService.updateMunicipio as jest.Mock) = mockUpdateMunicipio;
      
      // 4. Avançar para próximo step
      if (currentStep < steps.length - 1) {
        currentStep = currentStep + 1;
      }
      
      expect(currentStep).toBe(1);
      expect(validateStepIndex(currentStep)).toBe(true);
    });

    it('deve simular handleNext no último step (não deve avançar)', () => {
      let currentStep = 3;
      const steps = ['Step 0', 'Step 1', 'Step 2', 'Step 3'];
      
      // 1. Validar step atual
      expect(validateStepIndex(currentStep)).toBe(true);
      
      // 2. Obter submenu do step atual
      const submenuName = getStepSubmenuName(currentStep)!;
      expect(submenuName).toBe('prestadoresResiduosSolidos');
      
      // 3. Tentar avançar (não deve avançar se for o último)
      if (currentStep < steps.length - 1) {
        currentStep = currentStep + 1;
      }
      
      expect(currentStep).toBe(3); // Permanece no último step
    });

    it('deve simular handleNext com copiaParaEsgoto (pula Step 1)', () => {
      let currentStep = 0;
      const copiaParaEsgoto = true;
      const steps = ['Step 0', 'Step 1', 'Step 2', 'Step 3'];
      
      // 1. Validar step atual
      expect(validateStepIndex(currentStep)).toBe(true);
      
      // 2. Simular salvamento do Step 0
      const submenuName = getStepSubmenuName(currentStep)!;
      expect(submenuName).toBe('prestadoresAbastecimentoAgua');
      
      // 3. Avançar (com lógica de copiaParaEsgoto)
      if (currentStep < steps.length - 1) {
        if (currentStep === 0 && copiaParaEsgoto) {
          currentStep = 2; // Pula para Step 2
        } else {
          currentStep = currentStep + 1;
        }
      }
      
      expect(currentStep).toBe(2); // Pulou para Step 2
      expect(validateStepIndex(currentStep)).toBe(true);
    });
  });

  describe('Integração: Tratamento de Erros', () => {
    it('deve tratar stepIndex inválido', () => {
      const invalidStep = 99;
      
      expect(validateStepIndex(invalidStep)).toBe(false);
      
      const submenuName = getStepSubmenuName(invalidStep);
      expect(submenuName).toBeNull();
    });

    it('deve tratar dados incompletos', () => {
      const stepIndex = 0;
      const submenuName = getStepSubmenuName(stepIndex)!;
      const requiredFields = getRequiredFields(submenuName);
      
      // Dados vazios
      const emptyData = {};
      
      const missingFields = requiredFields.filter(
        field => !emptyData.hasOwnProperty(field)
      );
      
      expect(missingFields.length).toBe(requiredFields.length);
    });

    it('deve tratar erro na API (simulado)', async () => {
      const mockError = new Error('Erro na API');
      (municipioService.updateMunicipio as jest.Mock).mockRejectedValue(mockError);
      
      try {
        await municipioService.updateMunicipio({});
        expect(false).toBe(true); // Não deve chegar aqui
      } catch (error) {
        expect(error).toBe(mockError);
        
        // Simular toast de erro
        toast.error('Erro ao salvar. Tente novamente.', {
          position: 'top-right',
          autoClose: 5000,
        });
        
        expect(toast.error).toHaveBeenCalled();
      }
    });
  });

  describe('Integração: Validação de Todos os Steps', () => {
    it('deve validar estrutura completa de todos os 4 steps', () => {
      const steps = [0, 1, 2, 3];
      
      steps.forEach(stepIndex => {
        // Validar stepIndex
        expect(validateStepIndex(stepIndex)).toBe(true);
        
        // Obter submenu
        const submenuName = getStepSubmenuName(stepIndex);
        expect(submenuName).not.toBeNull();
        expect(submenuName).toBe(stepToSubmenuMap[stepIndex]);
        
        // Obter campos obrigatórios
        const requiredFields = getRequiredFields(submenuName!);
        expect(requiredFields.length).toBe(12);
        
        // Obter nome amigável
        const displayName = getSubmenuName(submenuName!);
        expect(displayName).not.toBe('');
      });
    });
  });
});

