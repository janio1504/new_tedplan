-- Script para corrigir registros duplicados e adicionar constraints UNIQUE
-- Execute este script no banco de dados PostgreSQL

-- 1. Limpar registros duplicados, mantendo apenas o mais recente (ou o primeiro se não houver created_at)
DO $$
DECLARE
    municipio_id INTEGER;
    record_count INTEGER;
    record_to_keep INTEGER;
BEGIN
    -- Para ps_abastecimento_agua
    FOR municipio_id IN 
        SELECT id_municipio 
        FROM tedplan.ps_abastecimento_agua 
        GROUP BY id_municipio 
        HAVING COUNT(*) > 1
    LOOP
        -- Encontrar o ID do registro mais recente
        SELECT id_ps_abastecimento_agua INTO record_to_keep
        FROM tedplan.ps_abastecimento_agua
        WHERE id_municipio = municipio_id
        ORDER BY id_ps_abastecimento_agua DESC
        LIMIT 1;
        
        -- Deletar todos os outros
        DELETE FROM tedplan.ps_abastecimento_agua
        WHERE id_municipio = municipio_id
        AND id_ps_abastecimento_agua != record_to_keep;
        
        GET DIAGNOSTICS record_count = ROW_COUNT;
        RAISE NOTICE 'Removidos % registros duplicados de ps_abastecimento_agua para município %', record_count, municipio_id;
    END LOOP;

    -- Para ps_esgotamento_sanitario
    FOR municipio_id IN 
        SELECT id_municipio 
        FROM tedplan.ps_esgotamento_sanitario 
        GROUP BY id_municipio 
        HAVING COUNT(*) > 1
    LOOP
        SELECT id_ps_esgotamento_sanitario INTO record_to_keep
        FROM tedplan.ps_esgotamento_sanitario
        WHERE id_municipio = municipio_id
        ORDER BY id_ps_esgotamento_sanitario DESC
        LIMIT 1;
        
        DELETE FROM tedplan.ps_esgotamento_sanitario
        WHERE id_municipio = municipio_id
        AND id_ps_esgotamento_sanitario != record_to_keep;
        
        GET DIAGNOSTICS record_count = ROW_COUNT;
        RAISE NOTICE 'Removidos % registros duplicados de ps_esgotamento_sanitario para município %', record_count, municipio_id;
    END LOOP;

    -- Para ps_drenagem_aguas_pluviais
    FOR municipio_id IN 
        SELECT id_municipio 
        FROM tedplan.ps_drenagem_aguas_pluviais 
        GROUP BY id_municipio 
        HAVING COUNT(*) > 1
    LOOP
        SELECT id_ps_drenagem_aguas_pluviais INTO record_to_keep
        FROM tedplan.ps_drenagem_aguas_pluviais
        WHERE id_municipio = municipio_id
        ORDER BY id_ps_drenagem_aguas_pluviais DESC
        LIMIT 1;
        
        DELETE FROM tedplan.ps_drenagem_aguas_pluviais
        WHERE id_municipio = municipio_id
        AND id_ps_drenagem_aguas_pluviais != record_to_keep;
        
        GET DIAGNOSTICS record_count = ROW_COUNT;
        RAISE NOTICE 'Removidos % registros duplicados de ps_drenagem_aguas_pluviais para município %', record_count, municipio_id;
    END LOOP;

    -- Para ps_residuo_solido
    FOR municipio_id IN 
        SELECT id_municipio 
        FROM tedplan.ps_residuo_solido 
        GROUP BY id_municipio 
        HAVING COUNT(*) > 1
    LOOP
        SELECT id_ps_residuo_solido INTO record_to_keep
        FROM tedplan.ps_residuo_solido
        WHERE id_municipio = municipio_id
        ORDER BY id_ps_residuo_solido DESC
        LIMIT 1;
        
        DELETE FROM tedplan.ps_residuo_solido
        WHERE id_municipio = municipio_id
        AND id_ps_residuo_solido != record_to_keep;
        
        GET DIAGNOSTICS record_count = ROW_COUNT;
        RAISE NOTICE 'Removidos % registros duplicados de ps_residuo_solido para município %', record_count, municipio_id;
    END LOOP;
END $$;

-- 2. Adicionar constraints UNIQUE para garantir apenas um registro por município
DO $$
BEGIN
    -- ps_abastecimento_agua
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'ps_abastecimento_agua_id_municipio_unique'
    ) THEN
        ALTER TABLE tedplan.ps_abastecimento_agua 
        ADD CONSTRAINT ps_abastecimento_agua_id_municipio_unique 
        UNIQUE (id_municipio);
        RAISE NOTICE 'Constraint UNIQUE adicionada em ps_abastecimento_agua';
    END IF;

    -- ps_esgotamento_sanitario
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'ps_esgotamento_sanitario_id_municipio_unique'
    ) THEN
        ALTER TABLE tedplan.ps_esgotamento_sanitario 
        ADD CONSTRAINT ps_esgotamento_sanitario_id_municipio_unique 
        UNIQUE (id_municipio);
        RAISE NOTICE 'Constraint UNIQUE adicionada em ps_esgotamento_sanitario';
    END IF;

    -- ps_drenagem_aguas_pluviais
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'ps_drenagem_aguas_pluviais_id_municipio_unique'
    ) THEN
        ALTER TABLE tedplan.ps_drenagem_aguas_pluviais 
        ADD CONSTRAINT ps_drenagem_aguas_pluviais_id_municipio_unique 
        UNIQUE (id_municipio);
        RAISE NOTICE 'Constraint UNIQUE adicionada em ps_drenagem_aguas_pluviais';
    END IF;

    -- ps_residuo_solido
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'ps_residuo_solido_id_municipio_unique'
    ) THEN
        ALTER TABLE tedplan.ps_residuo_solido 
        ADD CONSTRAINT ps_residuo_solido_id_municipio_unique 
        UNIQUE (id_municipio);
        RAISE NOTICE 'Constraint UNIQUE adicionada em ps_residuo_solido';
    END IF;
END $$;

-- 3. Verificar resultado
SELECT 
    'ps_abastecimento_agua' as tabela,
    COUNT(*) as total_registros,
    COUNT(DISTINCT id_municipio) as municipios_unicos,
    COUNT(*) - COUNT(DISTINCT id_municipio) as duplicatas
FROM tedplan.ps_abastecimento_agua
UNION ALL
SELECT 
    'ps_esgotamento_sanitario',
    COUNT(*),
    COUNT(DISTINCT id_municipio),
    COUNT(*) - COUNT(DISTINCT id_municipio)
FROM tedplan.ps_esgotamento_sanitario
UNION ALL
SELECT 
    'ps_drenagem_aguas_pluviais',
    COUNT(*),
    COUNT(DISTINCT id_municipio),
    COUNT(*) - COUNT(DISTINCT id_municipio)
FROM tedplan.ps_drenagem_aguas_pluviais
UNION ALL
SELECT 
    'ps_residuo_solido',
    COUNT(*),
    COUNT(DISTINCT id_municipio),
    COUNT(*) - COUNT(DISTINCT id_municipio)
FROM tedplan.ps_residuo_solido;
