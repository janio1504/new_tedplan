'use strict'

const Eixo = use("App/Models/Eixo")

class EixoController {

    async index(){
        const eixos = await Eixo
            .query()
            .from('tedplan.eixos')
            .fetch()

        return eixos
    }

    async store(){

    }
}

module.exports = EixoController
