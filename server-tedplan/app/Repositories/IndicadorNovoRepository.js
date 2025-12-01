const IndicadorNovo = use("App/Models/IndicadorNovo");

class IndicadorNovoRepository {

    async getAllIndicadores() {
        const indicadores = await IndicadorNovo.query()
            .with('menuItem')
            .with('tiposCampo')
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
            .first();
        return indicador;
    }

    async getIndicadoresByMenuItem(id_menu_item) {
        const indicadores = await IndicadorNovo.query()
            .where('id_menu_item', id_menu_item)
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
            .orWhere('palavra_chave', 'ilike', `%${searchTerm}%`)
            .orWhere('unidade_indicador', 'ilike', `%${searchTerm}%`)
            .with('menuItem')
            .with('tiposCampo')
            .orderBy("id_indicador", "desc")
            .fetch();
        return indicadores;
    }
}

module.exports = IndicadorNovoRepository;
