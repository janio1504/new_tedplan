/**
 * Funções auxiliares para Prestadores de Serviços
 * Extraídas para facilitar testes unitários
 */

/**
 * Mapeamento de stepIndex para nome do submenu
 */
export const stepToSubmenuMap: Record<number, string> = {
  0: 'prestadoresAbastecimentoAgua',
  1: 'prestadoresEsgotamentoSanitario',
  2: 'prestadoresDrenagemAguasPluviais',
  3: 'prestadoresResiduosSolidos'
};

/**
 * Mapeamento de stepIndex para nome amigável
 */
export const stepDisplayNames: Record<number, string> = {
  0: 'Abastecimento de Água',
  1: 'Esgotamento Sanitário',
  2: 'Drenagem e Águas Pluviais',
  3: 'Limpeza Pública e Resíduos Sólidos'
};

/**
 * Retorna o nome do submenu para um step específico
 */
export const getStepSubmenuName = (stepIndex: number): string | null => {
  return stepToSubmenuMap[stepIndex] || null;
};

/**
 * Valida se um stepIndex é válido
 */
export const validateStepIndex = (stepIndex: number): boolean => {
  return stepIndex >= 0 && stepIndex <= 3 && stepToSubmenuMap[stepIndex] !== undefined;
};

/**
 * Retorna o nome amigável de um step
 */
export const getStepDisplayName = (stepIndex: number): string => {
  return stepDisplayNames[stepIndex] || '';
};

/**
 * Retorna o total de steps disponíveis
 */
export const getTotalSteps = (): number => {
  return Object.keys(stepToSubmenuMap).length;
};



