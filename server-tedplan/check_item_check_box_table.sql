-- Verificar se a tabela item_check_box existe
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'tedplan' 
   AND table_name = 'item_check_box'
);

-- Se não existir, criar a tabela
CREATE TABLE IF NOT EXISTS tedplan.item_check_box (
    id_item_check_box SERIAL PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    valor VARCHAR(255) NOT NULL,
    id_indicador INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_indicador) REFERENCES tedplan.indicador(id_indicador) ON DELETE CASCADE
);

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_item_check_box_indicador ON tedplan.item_check_box(id_indicador); 