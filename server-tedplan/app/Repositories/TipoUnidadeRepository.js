const TipoUnidade = use("App/Models/TipoUnidade");

class TipoUnidadeRepository {

    async getAllTiposUnidade() {
        const tiposUnidade = await TipoUnidade.query()
            .orderBy("nome_tipo_unidade", "asc")
            .fetch();
        return tiposUnidade;
    }

    async getTiposUnidadeByEixo(id_eixo) {
        try {
            // Converter id_eixo para número se necessário
            const eixoId = parseInt(id_eixo, 10);
            
            if (isNaN(eixoId)) {
                throw new Error('ID do eixo inválido');
            }

            const tiposUnidade = await TipoUnidade.query()
                .where('id_eixo', eixoId)
                .orderBy("nome_tipo_unidade", "asc")
                .fetch();
            
            return tiposUnidade;
        } catch (error) {
            console.log('Erro em getTiposUnidadeByEixo repository:', error);
            console.log('Stack:', error.stack);
            throw error;
        }
    }

    async getTipoUnidadeById(id) {
        const tipoUnidade = await TipoUnidade.query()
            .where('id_tipo_unidade', id)
            .first();
        return tipoUnidade;
    }

    async addTipoUnidade(data) {
        const tipoUnidade = await TipoUnidade.create(data);
        return tipoUnidade;
    }

    async updateTipoUnidade(id, data) {
        const tipoUnidade = await TipoUnidade.findOrFail(id);
        tipoUnidade.merge(data);
        await tipoUnidade.save();
        return tipoUnidade;
    }

    async deleteTipoUnidade(id) {
        const tipoUnidade = await TipoUnidade.findOrFail(id);
        await tipoUnidade.delete();
        return { message: 'Tipo de unidade deletado com sucesso' };
    }

    async searchTiposUnidade(searchTerm) {
        const tiposUnidade = await TipoUnidade.query()
            .where('nome_tipo_unidade', 'ilike', `%${searchTerm}%`)
            .orderBy("nome_tipo_unidade", "asc")
            .fetch();
        return tiposUnidade;
    }
}

module.exports = TipoUnidadeRepository;

