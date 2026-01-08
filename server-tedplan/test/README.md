# Testes do MunicipioController

Este diretório contém os testes unitários e de integração para o `MunicipioController`.

## Estrutura

```
test/
├── unit/                          # Testes unitários
│   ├── MunicipioController.index.test.js
│   ├── MunicipioController.getMunicipio.test.js
│   └── MunicipioController.store.test.js
├── integration/                   # Testes de integração
│   └── MunicipioController.integration.test.js
├── helpers/                       # Helpers e mocks
│   ├── mockMunicipio.js
│   ├── mockRequestResponse.js
│   └── sanitizeHelpers.js
├── setup.js                       # Configuração global
└── README.md                      # Este arquivo
```

## Executando os Testes

### Todos os testes
```bash
npm test
```

### Testes em modo watch (desenvolvimento)
```bash
npm run test:watch
```

### Testes com cobertura
```bash
npm run test:coverage
```

### Testes específicos
```bash
# Apenas testes unitários
npm test -- test/unit

# Apenas testes de integração
npm test -- test/integration

# Um arquivo específico
npm test -- MunicipioController.index.test.js
```

## Cobertura de Testes

Os testes cobrem:

### Endpoints
- ✅ `GET /getMunicipios` (index)
- ✅ `GET /getMunicipio` (getMunicipio)
- ✅ `POST /addMunicipio` (store)

### Funcionalidades
- ✅ Validação de entrada (id_municipio obrigatório)
- ✅ Sanitização de valores (undefined, null, strings vazias)
- ✅ Criação de novos registros (add)
- ✅ Atualização de registros existentes (update)
- ✅ Tratamento de erros do banco de dados
- ✅ Fluxo completo de salvamento de todos os submenus

### Submenus Testados
- ✅ Dados do Município
- ✅ Titular dos Serviços
- ✅ Prestadores de Serviços:
  - ✅ Abastecimento de Água
  - ✅ Esgotamento Sanitário
  - ✅ Drenagem e Águas Pluviais
  - ✅ Resíduos Sólidos
- ✅ Regulador e Fiscalizador
- ✅ Controle Social
- ✅ Conselho Municipal
- ✅ Responsável SIMISAB
- ✅ Dados Geográficos
- ✅ Dados Demográficos

## Helpers e Mocks

### mockMunicipio.js
Mock do model `Municipio` para simular queries do banco de dados.

### mockRequestResponse.js
Helpers para criar mocks de `request` e `response` do AdonisJS.

### sanitizeHelpers.js
Funções auxiliares para testar a sanitização de valores.

## Adicionando Novos Testes

### Teste Unitário
```javascript
const MunicipioController = require('../../../app/Controllers/Http/MunicipioController');
const { createMockRequest, createMockResponse } = require('../helpers/mockRequestResponse');

describe('MunicipioController - novoMetodo()', () => {
  let controller;
  let request;
  let response;

  beforeEach(() => {
    controller = new MunicipioController();
    response = createMockResponse();
  });

  test('deve fazer algo', async () => {
    request = createMockRequest({ /* dados */ });
    await controller.novoMetodo({ request, response });
    // assertions
  });
});
```

### Teste de Integração
```javascript
describe('MunicipioController - Teste de Integração', () => {
  test('deve testar fluxo completo', async () => {
    // Teste que envolve múltiplos métodos ou submenus
  });
});
```

## Boas Práticas

1. **Isolamento**: Cada teste deve ser independente
2. **Mocks**: Use mocks para isolar dependências externas
3. **Nomes Descritivos**: Use nomes que descrevam o comportamento esperado
4. **Arrange-Act-Assert**: Organize os testes em 3 fases claras
5. **Cobertura**: Mantenha alta cobertura de código crítico

## Troubleshooting

### Erro: "Cannot find module 'App/Models/Municipio'"
Certifique-se de que o `moduleNameMapper` no `jest.config.js` está configurado corretamente.

### Erros de timeout
Aumente o `testTimeout` no `jest.config.js` se necessário.

### Mocks não funcionando
Verifique se os mocks estão sendo resetados no `afterEach`.


