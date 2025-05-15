const DataBase = use("App/Models/DatabaseTedplan");


class PresidenciaConselhoMunicipalRepository {
    async getConselhosMunicipais(id_municipio) {
        const conselhos = await DataBase.query()
        .from("presidencia_conselho_municipal")
        .where('id_municipio', id_municipio)
        .fetch();
        return conselhos;
    }
    
    async addConselhoMunicipal(data) {
        const conselho = await DataBase.create(data);
        return conselho;
    }
    
    async updateConselhoMunicipal(id, data) {
        const conselho = await DataBase.findOrFail(id);
        conselho.merge(data);
        await conselho.save();
        return conselho;
    }
    
    async deleteConselhoMunicipal(id) {
        const conselho = await DataBase.findOrFail(id);
        await conselho.delete();
    }        

}