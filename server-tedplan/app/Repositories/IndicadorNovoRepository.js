const IndicadorNovo = use("App/Models/IndicadorNovo");
const Database = use('Database');

class IndicadorNovoRepository {

    async getAllIndicadores() {
        const indicadores = await IndicadorNovo.query()
            .with('menuItem')
            .with('tiposCampo')
            .with('tipoUnidade')
            .orderBy("id_indicador", "desc")
            .fetch();
        return indicadores;
    }

    async getIndicadorById(id) {
        const indicador = await IndicadorNovo.query()
            .where('id_indicador', id)
            .with('menuItem')
            .with('tiposCampo')
            .with('indicadoresMunicipio')
            .with('tipoUnidade')
            .first();
        return indicador;
    }

    async getIndicadoresByMenuItem(id_menu_item) {
        const indicadores = await IndicadorNovo.query()
            .where('id_menu_item', id_menu_item)
            .where((builder) => {
                builder.where('is_unidade', false).orWhereNull('is_unidade');
            })
            .with('tiposCampo')
            .orderBy("id_indicador", "asc")
            .fetch();
        return indicadores;
    }

    async getIndicadoresByGrupo(grupo_indicador) {
        const indicadores = await IndicadorNovo.query()
            .where('grupo_indicador', grupo_indicador)
            .with('menuItem')
            .with('tiposCampo')
            .orderBy("id_indicador", "desc")
            .fetch();
        return indicadores;
    }

    async getIndicadoresByCodigo(codigo_indicador) {
        const indicador = await IndicadorNovo.query()
            .where('codigo_indicador', codigo_indicador)
            .with('menuItem')
            .with('tiposCampo')
            .first();
        return indicador;
    }

    async addIndicador(data) {
        const indicador = await IndicadorNovo.create(data);
        return indicador;
    }

    async updateIndicador(id, data) {
        const indicador = await IndicadorNovo.findOrFail(id);
        indicador.merge(data);
        await indicador.save();
        return indicador;
    }

    async deleteIndicador(id) {
        const indicador = await IndicadorNovo.findOrFail(id);
        await indicador.delete();
        return { message: 'Indicador deletado com sucesso' };
    }

    async searchIndicadores(searchTerm) {
        const indicadores = await IndicadorNovo.query()
            .where('nome_indicador', 'ilike', `%${searchTerm}%`)
            .orWhere('codigo_indicador', 'ilike', `%${searchTerm}%`)
            .orWhere('unidade_indicador', 'ilike', `%${searchTerm}%`)
            .with('menuItem')
            .with('tiposCampo')
            .orderBy("id_indicador", "desc")
            .fetch();
        return indicadores;
    }

    async getIndicadoresByEixoAndUnidade(id_eixo, id_tipo_unidade = null) {
        try {
            const eixoId = parseInt(id_eixo, 10);

            if (isNaN(eixoId)) {
                throw new Error('ID do eixo inválido');
            }

            // Usar query SQL direta com Database
            const db = Database.connection('tedplan_db');

            // Se tiver id_tipo_unidade, buscar diretamente por ele e verificar eixo
            if (id_tipo_unidade) {
                const tipoUnidadeId = parseInt(id_tipo_unidade, 10);
                if (!isNaN(tipoUnidadeId)) {
                    // Verificar se o tipo_unidade pertence ao eixo
                    const tipoUnidade = await db
                        .table('tedplan.tipo_unidade')
                        .where('id_tipo_unidade', tipoUnidadeId)
                        .first();

                    if (!tipoUnidade) {
                        return [];
                    }

                    // Se o tipo_unidade tem id_eixo, verificar se corresponde
                    if (tipoUnidade.id_eixo && tipoUnidade.id_eixo !== eixoId) {
                        // Tipo de unidade não pertence ao eixo, retornar vazio
                        return [];
                    }

                    // Buscar indicadores diretamente por tipo_unidade
                    const indicadoresIds = await db
                        .table('tedplan.indicador as i')
                        .where('i.is_unidade', true)
                        .where('i.id_tipo_unidade', tipoUnidadeId)
                        .pluck('i.id_indicador');

                    if (!indicadoresIds || indicadoresIds.length === 0) {
                        return [];
                    }

                    // Buscar os indicadores completos com relacionamentos
                    const indicadores = await IndicadorNovo.query()
                        .whereIn('id_indicador', indicadoresIds)
                        .with('menuItem')
                        .with('tiposCampo')
                        .with('tipoUnidade')
                        .orderBy("id_indicador", "asc")
                        .fetch();

                    return indicadores;
                }
            }

            // Sem tipo_unidade, usar a lógica antiga com join com menu para filtrar por eixo
            // Isso mantém compatibilidade com código que não passa id_tipo_unidade
            const indicadoresIds = await db
                .table('tedplan.indicador as i')
                .leftJoin('tedplan.menu_item as mi', 'i.id_menu_item', 'mi.id_menu_item')
                .leftJoin('tedplan.menu as m', 'mi.id_menu', 'm.id_menu')
                .where('i.is_unidade', true)
                .where((builder) => {
                    builder
                        .where('m.id_eixo', eixoId)
                        .orWhere((subBuilder) => {
                            // Também incluir indicadores sem menu_item mas com tipo_unidade do eixo correto
                            subBuilder
                                .whereNull('i.id_menu_item')
                                .whereExists((existsBuilder) => {
                                    existsBuilder
                                        .select('*')
                                        .from('tedplan.tipo_unidade as tu')
                                        .whereRaw('tu.id_tipo_unidade = i.id_tipo_unidade')
                                        .where('tu.id_eixo', eixoId);
                                });
                        });
                })
                .pluck('i.id_indicador');

            if (!indicadoresIds || indicadoresIds.length === 0) {
                return [];
            }

            // Buscar os indicadores completos com relacionamentos
            const indicadores = await IndicadorNovo.query()
                .whereIn('id_indicador', indicadoresIds)
                .with('menuItem')
                .with('tiposCampo')
                .with('tipoUnidade')
                .orderBy("id_indicador", "asc")
                .fetch();

            return indicadores;
        } catch (error) {
            console.log('Erro em getIndicadoresByEixoAndUnidade repository:', error);
            console.log('Stack:', error.stack);
            throw error;
        }
    }
}

module.exports = IndicadorNovoRepository;
