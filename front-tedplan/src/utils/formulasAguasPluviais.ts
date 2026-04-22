/**
 * Configuração de fórmulas do Glossário SINISA - Módulo Águas Pluviais
 * Fonte: Glossario_Indicadores_SINISA_AGUAS_PLUVIAIS1.pdf
 *
 * CÓDIGO -> FÓRMULA DE CÁLCULO
 * Os códigos nas fórmulas (ex: GFI2335, GAP0301) referem-se a valor_indicador
 * da tabela indicador_municipio (convertido de string para número).
 */

export const FORMULAS_AGUAS_PLUVIAIS: Record<string, string> = {
  // Geral
  IGE0001: "(GAP0301 / OGM0005) x 100",

  // Administrativo
  IFAP001: "(GFI2336 / DFE0002) x 1000",
  IFAP002: "(GFI2334 / GFI2336) x 100",
  IFAP003: "(GFI2335 / GFI2336) x 100",

  // Financeiro
  IFAP004: "GFI1303 / GAP2101",
  IFAP005: "(GFI1309 / GAP2101) x 100",
  IFAP006: "GFI2317 / GAP2101",
  IFAP007: "(GFI2317 / GFI2300) x 100",
  IFAP008: "GFI2317 / DFE0002",
  IFAP009: "(GFI2317 / GFI1303) x 100",
  IFAP010: "GFI2321 / DFE0002",

  // Operacional/Infraestrutura
  IAP0001: "(GAP0303 / GAP0304) x 100",
  IAP0002: "(GAP0305 / GAP0304) x 100",
  IAP0003: "(GAP1104 / GAP0402) x 100",
  IAP0004: "(GAP0404 / GAP0402) x 100",
  IAP0005: "(GAP0405 / GAP0402) x 100",
  IAP0006: "(GAP0403 / GAP0402) x 100",
  IAP0007: "GAP0306 / GAP0303",
  IAP0008: "GAP0306 / GAP0305",
  IAP0009: "GAP0312 / GAP0305",

  // Gestão de risco
  IGR0001: "(GAP2110 / GAP2103) x 100",
  IGR0002: "[(GAP2212 + GAP2213) / DFE0002] x 100",
  IGR0003: "[(GAP2216 + GAP2217) / DFE0002] x 100000",
  IGR0004: "[(GAP2306 + GAP2307) / DFE0002] x 100000",
  IGR0005:
    "(GAP2212 + GAP2213) / (GAP2202 + GAP2203 + GAP2205 + GAP2206 + GAP2208 + GAP2209)",
  IGR0006:
    "(GAP2211 + GAP2213) / (GAP2201 + GAP2203 + GAP2204 + GAP2206 + GAP2207 + GAP2209)",
  IGR0007:
    "(GAP2216 + GAP2217) / (GAP2202 + GAP2203 + GAP2205 + GAP2206 + GAP2208 + GAP2209)",
  IGR0008:
    "(GAP2215 + GAP2217) / (GAP2201 + GAP2203 + GAP2204 + GAP2206 + GAP2207 + GAP2209)",
  IGR0009: "(GAP2219 / GAP2101) x 100",
};

export type CodigoFormula = keyof typeof FORMULAS_AGUAS_PLUVIAIS;

export function getFormula(codigo: string): string | undefined {
  return FORMULAS_AGUAS_PLUVIAIS[codigo];
}

export function isCodigoCalculado(codigo: string): boolean {
  return codigo in FORMULAS_AGUAS_PLUVIAIS;
}

/** Lista de códigos que são calculados por fórmula (para filtros, etc.) */
export const CODIGOS_CALCULADOS = Object.keys(FORMULAS_AGUAS_PLUVIAIS);
