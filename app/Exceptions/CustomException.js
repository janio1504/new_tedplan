"use strict";

const { LogicalException } = require("@adonisjs/generic-exceptions");

class CustomException extends LogicalException {
  handle(error, { response }) {
    if (error.code === "ECONNREFUSED") {
      response.status(500).send({ error: "O servidor esta offline!" });
    }
    if (error.code === "E_MISSING_DATABASE_ROW") {
      response.status(404).send({ error: "O registro não foi encontrado!" });
    }
    if (error.code === "E_INVALID_JWT_TOKEN") {
      response.status(401).send({ error: "Acesso não autorizado!" });
    }
    response.status(500).send({ error: error.message });
  }
}

module.exports = CustomException;
