/**
 * Testes unitários para validação de campos por step
 * Testa se cada step tem os campos corretos mapeados
 */

import {
  submenuFields,
  getSubmenuName,
  getRequiredFields,
  getAllSubmenuFields,
} from './submenuFields';

describe('SubmenuFields - Prestadores de Serviços', () => {
  describe('prestadoresAbastecimentoAgua (Step 0)', () => {
    const submenu = submenuFields.prestadoresAbastecimentoAgua;

    it('deve existir o submenu', () => {
      expect(submenu).toBeDefined();
    });

    it('deve ter 12 campos obrigatórios', () => {
      expect(submenu.required.length).toBe(12);
    });

    it('deve ter todos os campos com prefixo aa_', () => {
      submenu.required.forEach(field => {
        expect(field).toMatch(/^aa_/);
      });
    });

    it('deve ter os campos obrigatórios corretos', () => {
      const expectedFields = [
        'aa_secretaria_setor_responsavel',
        'aa_abrangencia',
        'aa_natureza_juridica',
        'aa_cnpj',
        'aa_telefone',
        'aa_cep',
        'aa_endereco',
        'aa_numero',
        'aa_bairro',
        'aa_responsavel',
        'aa_cargo',
        'aa_email'
      ];
      expect(submenu.required).toEqual(expect.arrayContaining(expectedFields));
    });

    it('deve ter id_ps_abastecimento_agua como opcional', () => {
      expect(submenu.optional).toContain('id_ps_abastecimento_agua');
    });
  });

  describe('prestadoresEsgotamentoSanitario (Step 1)', () => {
    const submenu = submenuFields.prestadoresEsgotamentoSanitario;

    it('deve existir o submenu', () => {
      expect(submenu).toBeDefined();
    });

    it('deve ter 12 campos obrigatórios', () => {
      expect(submenu.required.length).toBe(12);
    });

    it('deve ter todos os campos com prefixo es_', () => {
      submenu.required.forEach(field => {
        expect(field).toMatch(/^es_/);
      });
    });

    it('deve ter id_ps_esgotamento_sanitario como opcional', () => {
      expect(submenu.optional).toContain('id_ps_esgotamento_sanitario');
    });
  });

  describe('prestadoresDrenagemAguasPluviais (Step 2)', () => {
    const submenu = submenuFields.prestadoresDrenagemAguasPluviais;

    it('deve existir o submenu', () => {
      expect(submenu).toBeDefined();
    });

    it('deve ter 12 campos obrigatórios', () => {
      expect(submenu.required.length).toBe(12);
    });

    it('deve ter todos os campos com prefixo da_', () => {
      submenu.required.forEach(field => {
        expect(field).toMatch(/^da_/);
      });
    });

    it('deve ter id_ps_drenagem_aguas_pluviais como opcional', () => {
      expect(submenu.optional).toContain('id_ps_drenagem_aguas_pluviais');
    });
  });

  describe('prestadoresResiduosSolidos (Step 3)', () => {
    const submenu = submenuFields.prestadoresResiduosSolidos;

    it('deve existir o submenu', () => {
      expect(submenu).toBeDefined();
    });

    it('deve ter 12 campos obrigatórios', () => {
      expect(submenu.required.length).toBe(12);
    });

    it('deve ter todos os campos com prefixo rs_', () => {
      submenu.required.forEach(field => {
        expect(field).toMatch(/^rs_/);
      });
    });

    it('deve ter id_ps_residuo_solido como opcional', () => {
      expect(submenu.optional).toContain('id_ps_residuo_solido');
    });
  });

  describe('getSubmenuName', () => {
    it('deve retornar nomes corretos para cada step', () => {
      expect(getSubmenuName('prestadoresAbastecimentoAgua')).toBe('Abastecimento de Água');
      expect(getSubmenuName('prestadoresEsgotamentoSanitario')).toBe('Esgotamento Sanitário');
      expect(getSubmenuName('prestadoresDrenagemAguasPluviais')).toBe('Drenagem e Águas Pluviais');
      expect(getSubmenuName('prestadoresResiduosSolidos')).toBe('Limpeza Pública e Resíduos Sólidos');
    });
  });

  describe('getRequiredFields', () => {
    it('deve retornar campos obrigatórios para Step 0', () => {
      const fields = getRequiredFields('prestadoresAbastecimentoAgua');
      expect(fields.length).toBe(12);
      expect(fields).toContain('aa_secretaria_setor_responsavel');
      expect(fields).toContain('aa_cnpj');
      expect(fields).toContain('aa_email');
    });

    it('deve retornar campos obrigatórios para Step 1', () => {
      const fields = getRequiredFields('prestadoresEsgotamentoSanitario');
      expect(fields.length).toBe(12);
      expect(fields).toContain('es_secretaria_setor_responsavel');
      expect(fields).toContain('es_cnpj');
    });

    it('deve retornar array vazio para submenu inexistente', () => {
      const fields = getRequiredFields('submenuInexistente');
      expect(fields).toEqual([]);
    });
  });

  describe('getAllSubmenuFields', () => {
    it('deve retornar todos os campos (required + optional) para Step 0', () => {
      const fields = getAllSubmenuFields('prestadoresAbastecimentoAgua');
      expect(fields.length).toBe(13); // 12 required + 1 optional
      expect(fields).toContain('aa_secretaria_setor_responsavel');
      expect(fields).toContain('id_ps_abastecimento_agua');
    });
  });
});



