-- Adicionar foreign key para item_check_box
ALTER TABLE tedplan.item_check_box
ADD CONSTRAINT fk_item_check_box_indicador
FOREIGN KEY (id_indicador) REFERENCES tedplan.indicador(id_indicador) ON DELETE CASCADE;

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_item_check_box_indicador ON tedplan.item_check_box(id_indicador);
