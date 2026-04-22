/**
 * Calculadora de fórmulas com indicadores municipais.
 *
 * - CÓDIGO do indicador (ex: IFAP003) identifica qual fórmula usar
 * - FÓRMULA usa códigos de valor_indicador (ex: GFI2335, GFI2336)
 * - getDadosCodigos busca indicadores; valor_indicador (string) é convertido para número
 * - Resultado é usado em gráficos e listas
 */

export interface DadosIndicador {
  codigo_indicador: string;
  valor_indicador: string | number | null;
  ano?: number;
  [key: string]: unknown;
}

export interface OpcoesCalculo {
  toInt?: boolean;
  precision?: number;
  valorPadrao?: number | null;
}

const REGEX_CODIGO = /\b[A-Z]{2,}[A-Z0-9]*\b/g;

/** Converte valor_indicador (string) para número */
export function parseValorToNumber(valor: string | number | null | undefined): number {
  if (valor === null || valor === undefined) return 0;
  if (typeof valor === "number" && !Number.isNaN(valor)) return valor;
  const str = String(valor).trim();
  if (!str) return 0;
  const num = parseFloat(str.replace(",", "."));
  return Number.isNaN(num) ? 0 : num;
}

/** Extrai códigos da fórmula (ex: GFI2335, DFE0002) */
export function extrairCodigosFormula(formula: string): string[] {
  const matches = formula.match(REGEX_CODIGO);
  return matches ? Array.from(new Set(matches)) : [];
}

function normalizarExpressao(expr: string): string {
  return expr.replace(/\s*x\s*/gi, " * ").trim();
}

function substituirFormulaComValores(
  formula: string,
  dadosMap: Record<string, number>
): string {
  let expr = normalizarExpressao(formula);
  for (const [codigo, valor] of Object.entries(dadosMap)) {
    expr = expr.replace(new RegExp(`\\b${codigo}\\b`, "g"), String(valor));
  }
  return expr;
}

function avaliarExpressao(expr: string): number {
  const sanitized = expr.replace(/[^\d\s\+\-\*\/\(\)\.]/g, "");
  try {
    const fn = new Function(`return (${sanitized})`);
    const result = fn();
    return typeof result === "number" && !Number.isNaN(result) ? result : 0;
  } catch {
    return 0;
  }
}

/** Converte array de indicadores em mapa codigo -> valor (número) */
export function indicadoresParaMapa(
  indicadores: DadosIndicador[],
  ano?: number
): Record<string, number> {
  const map: Record<string, number> = {};
  for (const ind of indicadores) {
    if (ano != null && ind.ano != null && ind.ano !== ano) continue;
    map[ind.codigo_indicador] = parseValorToNumber(ind.valor_indicador);
  }
  return map;
}

/**
 * Calcula o resultado da fórmula.
 *
 * @param formula - Ex: "(GFI2335 / GFI2336) x 100"
 * @param dadosMap - Map codigo -> valor numérico
 */
export function calcularFormula(
  formula: string,
  dadosMap: Record<string, number>,
  opcoes: OpcoesCalculo = {}
): number | null {
  const { toInt = false, precision = 2, valorPadrao = null } = opcoes;

  const codigos = extrairCodigosFormula(formula);
  const faltando = codigos.filter((c) => dadosMap[c] === undefined);
  if (faltando.length > 0) return valorPadrao;

  const expr = substituirFormulaComValores(formula, dadosMap);
  let result = avaliarExpressao(expr);

  if (Number.isNaN(result) || !Number.isFinite(result)) return valorPadrao;

  return toInt ? Math.round(result) : Number(result.toFixed(precision));
}

/**
 * Calcula indicador pelo CÓDIGO, usando config de fórmulas e getDadosCodigos.
 *
 * @param codigoIndicador - CÓDIGO (ex: IFAP003)
 * @param getFormula - Função que retorna a fórmula para o código
 * @param getDadosCodigos - Função que busca indicadores pelos códigos da fórmula
 * @param params - id_municipio, ano, id_eixo, etc.
 */
export async function calcularPorCodigo(
  codigoIndicador: string,
  getFormula: (codigo: string) => string | undefined,
  getDadosCodigos: (
    codigos: string[],
    params: Record<string, unknown>
  ) => Promise<DadosIndicador[]>,
  params: Record<string, unknown>,
  opcoes: OpcoesCalculo = {}
): Promise<number | null> {
  const formula = getFormula(codigoIndicador);
  if (!formula) return opcoes.valorPadrao ?? null;
  
  const codigos = extrairCodigosFormula(formula);
  if (codigos.length === 0) return opcoes.valorPadrao ?? null;

  const indicadores = await getDadosCodigos(codigos, params);
  const dadosMap = indicadoresParaMapa(
    indicadores,
    params.ano as number | undefined
  );

  return calcularFormula(formula, dadosMap, opcoes);
}

/**
 * Cria função getDadosCodigos para API get-por-codigos.
 * Uso: const getDados = criarGetDadosPorApi(api);
 */
export function criarGetDadosPorApi(apiClient: {
  get: (url: string, config?: { params?: Record<string, unknown> }) => Promise<{ data: unknown }>;
}): (
  codigos: string[],
  params: Record<string, unknown>
) => Promise<DadosIndicador[]> {
  return async (codigos, params) => {
    const idMun = params.id_municipio;
    if (!idMun) return [];

    try {
      const query: Record<string, unknown> = {
        codigos,
        id_municipio: idMun,
        ano: params.ano ?? new Date().getFullYear(),
      };
      if (params.id_eixo != null) query.id_eixo = params.id_eixo;
      if (params.id_unidade != null) query.id_unidade = params.id_unidade;

      const res = await apiClient.get("get-por-codigos", { params: query });
      const data = res?.data;
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  };
}
