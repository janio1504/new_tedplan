const Cmsb = use("App/Models/ConselhoMunicipalSaneamentoBasico");

class ConselhoMunicipalSaneamentoBasicoRepository {

    async getConselhosMunicipais(id_municipio) {
        const conselhos = await Cmsb.query()
        .where('id_municipio', id_municipio)
        .orderBy("id_conselho_municipal_saneamento_basico", "desc")
        .fetch();
        return conselhos;
    }
    
    async addConselhoMunicipal(data) {
        const conselho = await Cmsb.create(data);
        return conselho;
    }
    
    async updateConselhoMunicipal(id, data) {
        const conselho = await Cmsb.findOrFail(id);
        conselho.merge(data);
        await conselho.save();
        return conselho;
    }
    
    async deleteConselhoMunicipal(id) {
        const conselho = await Cmsb.findOrFail(id);
        await conselho.delete();
    }
}