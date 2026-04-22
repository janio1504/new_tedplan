/**
 * Configuração de fórmulas do Glossário SINISA - Módulo Esgotamento Sanitário
 * Fonte: INDICADORES_SINISA_ESGOTAMENTOSANITRIO_2024_V2.pdf
 * Baseado nas fórmulas do Esgoto.tsx e padrões SNIS/SINISA
 *
 * CÓDIGO -> FÓRMULA DE CÁLCULO
 * Os códigos (ES*, AG*, BL*) referem-se a codigo_indicador da tabela indicador_municipio.
 * ES = Esgoto, AG = Água, BL = Balanço.
 */

export const FORMULAS_ESGOTO_SANITARIO: Record<string, string> = {
  // === Indicadores Operacionais (Esgoto + Água) ===
  IN015: "(ES005 / (AG010 - AG019)) x 100",
  IN016: "((ES006 + ES014 + ES015) / (ES005 + ES013)) x 100",
  IN021: "(ES004 / ES009) x 1000",
  IN046: "((ES006 + ES015) / (AG010 - AG019)) x 100",

  // === Indicadores de Atendimento (requerem GE no indicador_municipio) ===
  IN024: "(ES026 / GE06a) x 100",
  IN047: "(ES026 / GE06b) x 100",
  IN056: "(ES001 / GE012a) x 100",

  // === Indicadores Financeiros (Balanço - BL) ===
  IN061: "BL001 / BL005",
  IN062: "(BL001 + BL010) / (BL010 + BL005)",
  IN063: "(BL003 + BL005 + BL008) / BL002",
  IN064: "(BL009 / BL007) x 100",
  IN065: "(BL004 / BL007) x 100",
  IN066: "(BL004 / (BL006 - BL004)) x 100",
  IN067: "(BL003 / (BL003 + BL005)) x 100",
  IN068: "(BL012 / BL007) x 100",
  IN069: "(BL011 / BL007) x 100",

  // === Códigos adicionais SINISA 2024 (ajustar conforme PDF) ===
  IES0001: "(ES005 / (AG010 - AG019)) x 100",
  IES0002: "((ES006 + ES014 + ES015) / (ES005 + ES013)) x 100",
  IES0003: "(ES004 / ES009) x 1000",
  IES0004: "((ES006 + ES015) / (AG010 - AG019)) x 100",
};

export type CodigoFormulaEsgoto = keyof typeof FORMULAS_ESGOTO_SANITARIO;

export function getFormulaEsgoto(codigo: string): string | undefined {
  return FORMULAS_ESGOTO_SANITARIO[codigo];
}

export function isCodigoCalculadoEsgoto(codigo: string): boolean {
  return codigo in FORMULAS_ESGOTO_SANITARIO;
}

/** Lista de códigos calculados por fórmula (Esgotamento Sanitário) */
export const CODIGOS_CALCULADOS_ESGOTO = Object.keys(FORMULAS_ESGOTO_SANITARIO);
