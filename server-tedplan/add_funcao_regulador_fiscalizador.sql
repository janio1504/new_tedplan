-- Script para adicionar a coluna 'funcao' na tabela regulador_fiscalizador_ss
-- Execute este script no banco de dados PostgreSQL

-- Verificar se a coluna já existe antes de adicionar
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'tedplan' 
        AND table_name = 'regulador_fiscalizador_ss' 
        AND column_name = 'funcao'
    ) THEN
        ALTER TABLE tedplan.regulador_fiscalizador_ss 
        ADD COLUMN funcao VARCHAR(255) NULL;
        
        RAISE NOTICE 'Coluna funcao adicionada com sucesso na tabela regulador_fiscalizador_ss';
    ELSE
        RAISE NOTICE 'Coluna funcao já existe na tabela regulador_fiscalizador_ss';
    END IF;
END $$;

-- Verificar a estrutura da tabela após a alteração
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'tedplan' 
AND table_name = 'regulador_fiscalizador_ss'
ORDER BY ordinal_position;


