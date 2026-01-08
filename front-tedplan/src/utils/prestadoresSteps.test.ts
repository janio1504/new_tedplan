/**
 * Testes unitários para as funções de Prestadores de Serviços
 * Testa o mapeamento de steps e validação de cada step
 */

import {
  stepToSubmenuMap,
  getStepSubmenuName,
  validateStepIndex,
  getStepDisplayName,
  getTotalSteps,
} from './prestadoresSteps';

describe('Prestadores de Serviços - Mapeamento de Steps', () => {
  describe('stepToSubmenuMap', () => {
    it('deve mapear corretamente todos os 4 steps', () => {
      expect(stepToSubmenuMap[0]).toBe('prestadoresAbastecimentoAgua');
      expect(stepToSubmenuMap[1]).toBe('prestadoresEsgotamentoSanitario');
      expect(stepToSubmenuMap[2]).toBe('prestadoresDrenagemAguasPluviais');
      expect(stepToSubmenuMap[3]).toBe('prestadoresResiduosSolidos');
    });

    it('deve ter exatamente 4 steps mapeados', () => {
      expect(Object.keys(stepToSubmenuMap).length).toBe(4);
    });

    it('não deve ter steps além de 0-3', () => {
      expect(stepToSubmenuMap[4]).toBeUndefined();
      expect(stepToSubmenuMap[-1]).toBeUndefined();
    });
  });

  describe('getStepSubmenuName', () => {
    it('deve retornar o nome do submenu para step válido', () => {
      expect(getStepSubmenuName(0)).toBe('prestadoresAbastecimentoAgua');
      expect(getStepSubmenuName(1)).toBe('prestadoresEsgotamentoSanitario');
      expect(getStepSubmenuName(2)).toBe('prestadoresDrenagemAguasPluviais');
      expect(getStepSubmenuName(3)).toBe('prestadoresResiduosSolidos');
    });

    it('deve retornar null para step inválido', () => {
      expect(getStepSubmenuName(4)).toBeNull();
      expect(getStepSubmenuName(-1)).toBeNull();
      expect(getStepSubmenuName(99)).toBeNull();
    });
  });

  describe('validateStepIndex', () => {
    it('deve validar steps válidos (0-3)', () => {
      expect(validateStepIndex(0)).toBe(true);
      expect(validateStepIndex(1)).toBe(true);
      expect(validateStepIndex(2)).toBe(true);
      expect(validateStepIndex(3)).toBe(true);
    });

    it('deve rejeitar steps inválidos', () => {
      expect(validateStepIndex(4)).toBe(false);
      expect(validateStepIndex(-1)).toBe(false);
      expect(validateStepIndex(99)).toBe(false);
    });
  });

  describe('getStepDisplayName', () => {
    it('deve retornar o nome amigável de cada step', () => {
      expect(getStepDisplayName(0)).toBe('Abastecimento de Água');
      expect(getStepDisplayName(1)).toBe('Esgotamento Sanitário');
      expect(getStepDisplayName(2)).toBe('Drenagem e Águas Pluviais');
      expect(getStepDisplayName(3)).toBe('Limpeza Pública e Resíduos Sólidos');
    });

    it('deve retornar string vazia para step inválido', () => {
      expect(getStepDisplayName(4)).toBe('');
      expect(getStepDisplayName(-1)).toBe('');
    });
  });

  describe('getTotalSteps', () => {
    it('deve retornar o total de 4 steps', () => {
      expect(getTotalSteps()).toBe(4);
    });
  });
});
