const IndicadorMunicipio = use("App/Models/IndicadorMunicipio");

class IndicadorMunicipioRepository {

    async getAllIndicadoresMunicipio() {
        const indicadores = await IndicadorMunicipio.query()
            .with('indicador')
            .with('municipio')
            .orderBy("ano", "desc")
            .fetch();
        return indicadores;
    }

    async getIndicadorMunicipioById(id) {
        const indicador = await IndicadorMunicipio.query()
            .where('id_incicador_municipio', id)
            .with('indicador')
            .with('municipio')
            .first();
        return indicador;
    }

    async getIndicadoresByMunicipio(id_municipio, ano = null) {
        let query = IndicadorMunicipio.query()
            .where('id_municipio', id_municipio)
            .with('indicador')
            .with('municipio');
            
        if (ano) {
            query = query.where('ano', ano);
        }
        
        const indicadores = await query
            .orderBy("ano", "desc")
            .fetch();
        return indicadores;
    }

    async getIndicadoresByIndicador(id_indicador, ano = null) {
        let query = IndicadorMunicipio.query()
            .where('id_indicador', id_indicador)
            .with('indicador')
            .with('municipio');
            
        if (ano) {
            query = query.where('ano', ano);
        }
        
        const indicadores = await query
            .orderBy("ano", "desc")
            .fetch();
        return indicadores;
    }

    async getIndicadoresByAno(ano) {
        const indicadores = await IndicadorMunicipio.query()
            .where('ano', ano)
            .with('indicador')
            .with('municipio')
            .orderBy("id_municipio", "asc")
            .fetch();
        return indicadores;
    }

    async getIndicadorByCodigoMunicipioAno(codigo_indicador, id_municipio, ano) {
        const indicador = await IndicadorMunicipio.query()
            .where('codigo_indicador', codigo_indicador)
            .where('id_municipio', id_municipio)
            .where('ano', ano)
            .with('indicador')
            .with('municipio')
            .first();
        return indicador;
    }
    
    async addIndicadorMunicipio(data) {
        const indicador = await IndicadorMunicipio.create(data);
        return indicador;
    }
    
    async updateIndicadorMunicipio(id, data) {
        const indicador = await IndicadorMunicipio.findOrFail(id);
        indicador.merge(data);
        await indicador.save();
        return indicador;
    }
    
    async deleteIndicadorMunicipio(id) {
        const indicador = await IndicadorMunicipio.findOrFail(id);
        await indicador.delete();
        return { message: 'Indicador de município deletado com sucesso' };
    }

    async bulkInsertIndicadores(data) {
        const indicadores = await IndicadorMunicipio.createMany(data);
        return indicadores;
    }

    async bulkUpdateIndicadores(municipio, ano, indicadores) {
        // Remove todos os indicadores existentes do município para o ano
        await IndicadorMunicipio.query()
            .where('id_municipio', municipio)
            .where('ano', ano)
            .delete();
            
        // Insere os novos indicadores
        const novosIndicadores = await IndicadorMunicipio.createMany(indicadores);
        return novosIndicadores;
    }
}

module.exports = IndicadorMunicipioRepository;
