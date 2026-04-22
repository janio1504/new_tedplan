/**
 * Configuração de fórmulas do Glossário SINISA - Módulo Resíduos Sólidos
 * Fonte: Glossario_Indicadores_SINISA_RESIDUOS
 * Baseado nas fórmulas do ResiduosSolidos.tsx e padrões SNIS/SINISA
 *
 * CÓDIGO -> FÓRMULA DE CÁLCULO
 * TB = Tabela Resíduos/Coleta, FN = Financeiro, CO = Coleta, CS = Coleta Seletiva,
 * POPURB = População urbana, POPTOT = População total (indicador_municipio ou OGM)
 */

export const FORMULAS_RESIDUOS_SOLIDOS: Record<string, string> = {
  // Taxa de empregados
  IN001: "((TB013 + TB014) / POPURB) x 1000",
  IN002: "(TB013 + TB014) / FN220",
  IN007: "(TB013 / (TB013 + TB014)) x 100",
  IN008: "(TB014 / (TB013 + TB014)) x 100",
  IN010: "((TB011 + TB012) / (TB013 + TB014)) x 100",
  IN019: "((TB001 + TB002) / POPURB) x 1000",

  // Financeiro
  IN003: "(FN220 / FN223) x 100",
  IN004: "(FN219 / FN220) x 100",
  IN005: "(FN222 / FN220) x 100",
  IN006: "FN220 / POPURB",
  IN011: "FN222 / POPURB",
  IN024: "((FN222 + FN207) / (FN218 + FN219)) x 100",

  // Cobertura
  IN014: "(CO165 / POPURB) x 100",
  IN015: "(CO164 / POPTOT) x 100",
  IN016: "(CO050 / POPURB) x 100",
  IN030: "(CS050 / POPURB) x 100",

  // Operacional / Massa
  IN017: "((CO117 + CS048 + CO142) / (CO116 + CO117 + CS048 + CO142)) x 100",
  IN018: "((CO117 + CO116) / (TB001 + TB002)) x (1000 / 313)",
  IN021: "((CO116 + CO117 + CS048 + CO142) / POPURB) x (1000 / 365)",
  IN022: "((CO116 + CO117 + CS048 + CO142) / POPURB) x (1000 / 365)",
  IN023: "(FN206 + FN207) / (CO116 + CO117 + CS048)",
  IN025: "((TB001 + TB002) / (TB013 + TB014)) x 100",
  IN028: "((CO112 + CO113 + CO141) / (CO108 + CO109 + CS048 + CO140)) x 100",
  IN031: "(CS009 / (CO116 + CO117 + CS048 + CO142)) x 100",

  // Recuperação / Outros
  IN027: "((CO112 + CO113 + CO141) / (CO108 + CO109 + CS048 + CO140)) x 100",
};

export type CodigoFormulaResiduos = keyof typeof FORMULAS_RESIDUOS_SOLIDOS;

export function getFormulaResiduos(codigo: string): string | undefined {
  return FORMULAS_RESIDUOS_SOLIDOS[codigo];
}

export function isCodigoCalculadoResiduos(codigo: string): boolean {
  return codigo in FORMULAS_RESIDUOS_SOLIDOS;
}

/** Lista de códigos calculados por fórmula (Resíduos Sólidos) */
export const CODIGOS_CALCULADOS_RESIDUOS = Object.keys(FORMULAS_RESIDUOS_SOLIDOS);
