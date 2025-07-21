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
