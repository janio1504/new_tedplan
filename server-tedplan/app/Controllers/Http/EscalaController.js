'use strict'

const Escalas = use("App/Models/Eixo")

class EscalaController {

    async index(){
        const escalas = await Escalas
            .query()
            .from('tedplan.escala')
            .fetch()

        return escalas
    }

    async store(){

    }
}

module.exports = EscalaController
