-- Script para ajustar estrutura das tabelas conforme nova especificação
-- Execute este script no banco de dados tedplan

-- =====================================================
-- 1. AJUSTAR TABELA TIPO_CAMPO_INDICADOR
-- =====================================================

-- Adicionar coluna id_indicador se não existir
ALTER TABLE tedplan.tipo_campo_indicador
ADD COLUMN IF NOT EXISTS id_indicador INTEGER REFERENCES tedplan.indicador(id_indicador) ON DELETE CASCADE;

-- Remover coluna id_campo se existir (não é mais necessária)
ALTER TABLE tedplan.tipo_campo_indicador
DROP COLUMN IF EXISTS id_campo;

-- =====================================================
-- 2. CRIAR TABELA SELECT_OPTIONS
-- =====================================================

-- Criar tabela select_options se não existir
CREATE TABLE IF NOT EXISTS tedplan.select_options (
    id_select_option SERIAL PRIMARY KEY,
    value VARCHAR(255) NOT NULL,
    descricao VARCHAR(500) NOT NULL,
    ordem_option INTEGER NOT NULL DEFAULT 1,
    id_tipo_campo_indicador INTEGER NOT NULL REFERENCES tedplan.tipo_campo_indicador(id_tipo_campo_indicador) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_select_options_tipo_campo
ON tedplan.select_options(id_tipo_campo_indicador);

CREATE INDEX IF NOT EXISTS idx_select_options_ordem
ON tedplan.select_options(ordem_option);

-- =====================================================
-- 3. ATUALIZAR ESTRUTURA TIPO_CAMPO_INDICADOR
-- =====================================================

-- Garantir que as colunas tenham os tipos corretos
ALTER TABLE tedplan.tipo_campo_indicador
ALTER COLUMN type TYPE VARCHAR(50),
ALTER COLUMN name_campo TYPE VARCHAR(255),
ALTER COLUMN enable TYPE BOOLEAN,
ALTER COLUMN default_value TYPE TEXT;

-- Criar índice na coluna id_indicador para performance
CREATE INDEX IF NOT EXISTS idx_tipo_campo_indicador_indicador
ON tedplan.tipo_campo_indicador(id_indicador);

-- =====================================================
-- 4. VERIFICAR E MOSTRAR ESTRUTURA FINAL
-- =====================================================

-- Mostrar estrutura da tabela indicador
\d tedplan.indicador;

-- Mostrar estrutura da tabela tipo_campo_indicador
\d tedplan.tipo_campo_indicador;

-- Mostrar estrutura da tabela select_options
\d tedplan.select_options;

-- Contar registros
SELECT 'indicador' as tabela, COUNT(*) as registros FROM tedplan.indicador
UNION ALL
SELECT 'tipo_campo_indicador' as tabela, COUNT(*) as registros FROM tedplan.tipo_campo_indicador
UNION ALL
SELECT 'select_options' as tabela, COUNT(*) as registros FROM tedplan.select_options;

COMMIT;
