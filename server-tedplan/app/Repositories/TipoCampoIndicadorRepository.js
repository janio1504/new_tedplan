const TipoCampoIndicador = use("App/Models/TipoCampoIndicador");

class TipoCampoIndicadorRepository {

    async getAllTiposCampo() {
        const tipos = await TipoCampoIndicador.query()
            .orderBy("name_campo", "asc")
            .fetch();
        return tipos.toJSON();
    }

    async getTipoCampoById(id) {
        const tipo = await TipoCampoIndicador.query()
            .where('id_tipo_campo_indicador', id)
            .first();
        return tipo;
    }

    async getTiposCampoAtivos() {
        const tipos = await TipoCampoIndicador.query()
            .where(function() {
                this.where('enable', true).orWhereNull('enable')
            })
            .orderBy("name_campo", "asc")
            .fetch();
        return tipos.toJSON();
    }

    async getTiposCampoPorTipo(type) {
        const tipos = await TipoCampoIndicador.query()
            .where('type', type)
            .orderBy("name_campo", "asc")
            .fetch();
        return tipos;
    }

    async getTiposCampoPorIndicador(indicadorId) {
        const tipos = await TipoCampoIndicador.query()
            .where('id_indicador', indicadorId)
            .with('selectOptions')
            .orderBy("created_at", "asc")
            .fetch();
        return tipos.toJSON();
    }

    async deleteTiposCampoPorIndicador(indicadorId) {
        // Primeiro, buscar os tipos de campo para deletar suas opções
        const tipos = await TipoCampoIndicador.query()
            .where('id_indicador', indicadorId)
            .fetch();

        // Deletar opções de select para cada tipo de campo
        const SelectOption = use('App/Models/SelectOption');
        for (let tipo of tipos.toJSON()) {
            await SelectOption.query()
                .where('id_tipo_campo_indicador', tipo.id_tipo_campo_indicador)
                .delete();
        }

        // Deletar os tipos de campo
        await TipoCampoIndicador.query()
            .where('id_indicador', indicadorId)
            .delete();

        return { message: 'Tipos de campo do indicador removidos com sucesso' };
    }

    async addTipoCampo(data) {
        const tipo = await TipoCampoIndicador.create(data);
        return tipo;
    }

    async updateTipoCampo(id, data) {
        const tipo = await TipoCampoIndicador.findOrFail(id);
        tipo.merge(data);
        await tipo.save();
        return tipo;
    }

    async deleteTipoCampo(id) {
        const tipo = await TipoCampoIndicador.findOrFail(id);

        // Deletar também as opções de select associadas
        const SelectOption = use('App/Models/SelectOption');
        await SelectOption.query()
            .where('id_tipo_campo_indicador', id)
            .delete();

        await tipo.delete();
        return { message: 'Tipo de campo deletado com sucesso' };
    }

    async toggleStatusTipoCampo(id) {
        const tipo = await TipoCampoIndicador.findOrFail(id);
        tipo.enable = !tipo.enable;
        await tipo.save();
        return tipo;
    }

    async searchTiposCampo(searchTerm) {
        const tipos = await TipoCampoIndicador.query()
            .where('name_campo', 'ilike', `%${searchTerm}%`)
            .orWhere('type', 'ilike', `%${searchTerm}%`)
            .orderBy("name_campo", "asc")
            .fetch();
        return tipos;
    }
}

module.exports = TipoCampoIndicadorRepository;
