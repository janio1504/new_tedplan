const Unidade = use("App/Models/Unidade");

class UnidadeRepository {

    async getAllUnidades() {
        const unidades = await Unidade.query()
            .with('tipoUnidade')
            .with('eixo')
            .with('municipio')
            .orderBy("id_unidade", "desc")
            .fetch();
        return unidades;
    }

    async getUnidadeById(id) {
        const unidade = await Unidade.query()
            .where('id_unidade', id)
            .with('tipoUnidade')
            .with('eixo')
            .with('municipio')
            .first();
        return unidade;
    }

    async getUnidadesByTipo(id_tipo_unidade) {
        const unidades = await Unidade.query()
            .where('id_tipo_unidade', id_tipo_unidade)
            .with('tipoUnidade')
            .with('eixo')
            .with('municipio')
            .orderBy("nome_unidade", "asc")
            .fetch();
        return unidades;
    }

    async getUnidadesByEixo(id_eixo) {
        try {
            const eixoId = parseInt(id_eixo, 10);
            
            if (isNaN(eixoId)) {
                throw new Error('ID do eixo inválido');
            }

            const unidades = await Unidade.query()
                .where('id_eixo', eixoId)
                .orderBy("nome_unidade", "asc")
                .fetch();
            
            return unidades;
        } catch (error) {
            console.log('Erro em getUnidadesByEixo repository:', error);
            console.log('Stack:', error.stack);
            throw error;
        }
    }

    async getUnidadesByMunicipio(id_municipio) {
        const unidades = await Unidade.query()
            .where('id_municipio', id_municipio)
            .with('tipoUnidade')
            .with('eixo')
            .with('municipio')
            .orderBy("nome_unidade", "asc")
            .fetch();
        return unidades;
    }

    async addUnidade(data) {
        const unidade = await Unidade.create(data);
        return unidade;
    }

    async updateUnidade(id, data) {
        const unidade = await Unidade.findOrFail(id);
        unidade.merge(data);
        await unidade.save();
        return unidade;
    }

    async deleteUnidade(id) {
        const unidade = await Unidade.findOrFail(id);
        await unidade.delete();
        return { message: 'Unidade deletada com sucesso' };
    }

    async searchUnidades(searchTerm) {
        const unidades = await Unidade.query()
            .where('nome_unidade', 'ilike', `%${searchTerm}%`)
            .with('tipoUnidade')
            .with('eixo')
            .with('municipio')
            .orderBy("nome_unidade", "asc")
            .fetch();
        return unidades;
    }

    async getUnidadesByFilters(filters) {
        let query = Unidade.query();

        if (filters.id_tipo_unidade) {
            query.where('id_tipo_unidade', filters.id_tipo_unidade);
        }

        if (filters.id_eixo) {
            query.where('id_eixo', filters.id_eixo);
        }

        if (filters.id_municipio) {
            query.where('id_municipio', filters.id_municipio);
        }

        if (filters.nome_unidade) {
            query.where('nome_unidade', 'ilike', `%${filters.nome_unidade}%`);
        }

        const unidades = await query
            .with('tipoUnidade')
            .with('eixo')
            .with('municipio')
            .orderBy("nome_unidade", "asc")
            .fetch();

        return unidades;
    }
}

module.exports = UnidadeRepository;

