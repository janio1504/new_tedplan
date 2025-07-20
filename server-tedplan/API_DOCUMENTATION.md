# API Documentation - Sistema de Gestão de Menus e Indicadores

Este documento descreve as APIs criadas para o gerenciamento de menus, itens de menu, tipos de campos de indicadores, indicadores e indicadores por município.

## Visão Geral das Entidades

### 1. Menu
Representa os menus principais do sistema.

**Campos:**
- `id_menu` (serial4, PK)
- `titulo` (varchar)
- `descricao` (varchar)
- `id_modulo` (int4, FK)
- `id_eixo` (int4, FK)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 2. MenuItem
Representa os itens de cada menu.

**Campos:**
- `id_menu_item` (serial4, PK)
- `nome_menu_item` (varchar)
- `id_menu` (int4, FK)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 3. TipoCampoIndicador
Define os tipos de campos que podem ser usados nos indicadores.

**Campos:**
- `id_tipo_campo_indicador` (serial4, PK)
- `type` (varchar)
- `name_campo` (varchar)
- `id_campo` (varchar)
- `enable` (bool)
- `default_value` (varchar)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 4. IndicadorNovo
Representa os indicadores do sistema.

**Campos:**
- `id_indicador` (serial4, PK)
- `codigo_indicador` (varchar)
- `nome_indicador` (varchar)
- `grupo_indicador` (varchar)
- `palavra_chave` (varchar)
- `unidade_indicador` (varchar)
- `formula_calculo_indicador` (varchar)
- `informacoes_indicador` (text)
- `indicador_correspondente_ou_similar_snis` (varchar)
- `id_menu_item` (int4, FK)
- `id_tipo_campo_indicador` (int4, FK)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 5. IndicadorMunicipio
Armazena os valores dos indicadores por município e ano.

**Campos:**
- `id_incicador_municipio` (serial4, PK)
- `id_indicador` (int4, FK)
- `codigo_indicador` (varchar)
- `id_municipio` (int4, FK)
- `ano` (int4)
- `valor_indicador` (varchar)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## APIs Disponíveis

### MENU APIs

#### GET /menus
Lista todos os menus
**Response:** Array de menus com seus itens relacionados

#### GET /menus/:id
Busca um menu específico por ID
**Response:** Objeto do menu com seus itens relacionados

#### POST /menus
Cria um novo menu
**Body:**
```json
{
  "titulo": "string (obrigatório)",
  "descricao": "string",
  "id_modulo": "number",
  "id_eixo": "number"
}
```

#### PUT /menus/:id
Atualiza um menu existente
**Body:** Campos a serem atualizados

#### DELETE /menus/:id
Remove um menu

#### GET /menus/modulo/:id_modulo
Lista menus por módulo

#### GET /menus/eixo/:id_eixo
Lista menus por eixo

#### GET /menus/search?q=termo
Busca menus por termo (título ou descrição)

---

### MENU ITEM APIs

#### GET /menu-items
Lista todos os itens de menu

#### GET /menu-items/:id
Busca um item de menu específico por ID

#### POST /menu-items
Cria um novo item de menu
**Body:**
```json
{
  "nome_menu_item": "string (obrigatório)",
  "id_menu": "number (obrigatório)"
}
```

#### PUT /menu-items/:id
Atualiza um item de menu existente

#### DELETE /menu-items/:id
Remove um item de menu

#### GET /menu-items/menu/:id_menu
Lista itens de menu por menu

#### GET /menu-items/search?q=termo
Busca itens de menu por termo

---

### TIPO CAMPO INDICADOR APIs

#### GET /tipos-campo
Lista todos os tipos de campo

#### GET /tipos-campo/:id
Busca um tipo de campo específico por ID

#### POST /tipos-campo
Cria um novo tipo de campo
**Body:**
```json
{
  "name_campo": "string (obrigatório)",
  "type": "string (obrigatório)",
  "id_campo": "string",
  "enable": "boolean",
  "default_value": "string"
}
```

#### PUT /tipos-campo/:id
Atualiza um tipo de campo existente

#### DELETE /tipos-campo/:id
Remove um tipo de campo

#### GET /tipos-campo/ativos
Lista apenas os tipos de campo ativos

#### GET /tipos-campo/tipo/:tipo
Lista tipos de campo por tipo específico

#### PATCH /tipos-campo/:id/toggle-status
Alterna o status ativo/inativo de um tipo de campo

#### GET /tipos-campo/search?q=termo
Busca tipos de campo por termo

---

### INDICADOR APIs

#### GET /indicadores-novo
Lista todos os indicadores

#### GET /indicadores-novo/:id
Busca um indicador específico por ID

#### POST /indicadores-novo
Cria um novo indicador
**Body:**
```json
{
  "codigo_indicador": "string (obrigatório)",
  "nome_indicador": "string (obrigatório)",
  "grupo_indicador": "string",
  "palavra_chave": "string",
  "unidade_indicador": "string",
  "formula_calculo_indicador": "string",
  "informacoes_indicador": "string",
  "indicador_correspondente_ou_similar_snis": "string",
  "id_menu_item": "number",
  "id_tipo_campo_indicador": "number"
}
```

#### PUT /indicadores-novo/:id
Atualiza um indicador existente

#### DELETE /indicadores-novo/:id
Remove um indicador

#### GET /indicadores-novo/menu-item/:id_menu_item
Lista indicadores por item de menu

#### GET /indicadores-novo/grupo/:grupo
Lista indicadores por grupo

#### GET /indicadores-novo/codigo/:codigo
Busca indicador por código

#### GET /indicadores-novo/search?q=termo
Busca indicadores por termo

---

### INDICADOR MUNICÍPIO APIs

#### GET /indicadores-municipio
Lista todos os indicadores de município

#### GET /indicadores-municipio/:id
Busca um indicador de município específico por ID

#### POST /indicadores-municipio
Cria um novo indicador de município
**Body:**
```json
{
  "id_indicador": "number (obrigatório)",
  "codigo_indicador": "string",
  "id_municipio": "number (obrigatório)",
  "ano": "number (obrigatório)",
  "valor_indicador": "string"
}
```

#### PUT /indicadores-municipio/:id
Atualiza um indicador de município existente

#### DELETE /indicadores-municipio/:id
Remove um indicador de município

#### GET /indicadores-municipio/municipio/:id_municipio?ano=2024
Lista indicadores por município (opcionalmente filtrado por ano)

#### GET /indicadores-municipio/indicador/:id_indicador?ano=2024
Lista indicadores por indicador específico (opcionalmente filtrado por ano)

#### GET /indicadores-municipio/ano/:ano
Lista indicadores por ano

#### GET /indicadores-municipio/buscar?codigo_indicador=COD&id_municipio=1&ano=2024
Busca indicador específico por código, município e ano

#### POST /indicadores-municipio/bulk-insert
Inserção em lote de indicadores
**Body:**
```json
{
  "indicadores": [
    {
      "id_indicador": 1,
      "id_municipio": 1,
      "ano": 2024,
      "valor_indicador": "10.5"
    }
  ]
}
```

#### PUT /indicadores-municipio/bulk-update
Atualização em lote de indicadores (substitui todos os indicadores de um município em um ano)
**Body:**
```json
{
  "id_municipio": 1,
  "ano": 2024,
  "indicadores": [
    {
      "id_indicador": 1,
      "valor_indicador": "15.2"
    }
  ]
}
```

## Relacionamentos

- **Menu** → **MenuItem** (1:N)
- **MenuItem** → **IndicadorNovo** (1:N)
- **TipoCampoIndicador** → **IndicadorNovo** (1:N)
- **IndicadorNovo** → **IndicadorMunicipio** (1:N)
- **Municipio** → **IndicadorMunicipio** (1:N)

## Validações

- Todas as APIs incluem validações básicas de campos obrigatórios
- Tratamento de erros padronizado (404 para não encontrado, 400 para dados inválidos, 500 para erros internos)
- Autenticação via middleware ["auth"]

## Middleware

Todas as rotas estão protegidas pelo middleware de autenticação `["auth"]`.

## Status Codes

- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Dados inválidos ou faltando
- **404**: Recurso não encontrado
- **500**: Erro interno do servidor

## Exemplos de Uso

### Criar um menu completo com itens:

```bash
# 1. Criar menu
POST /menus
{
  "titulo": "Gestão de Água",
  "descricao": "Menu para gestão de indicadores de água",
  "id_modulo": 1
}

# 2. Criar item de menu
POST /menu-items
{
  "nome_menu_item": "Qualidade da Água",
  "id_menu": 1
}

# 3. Criar tipo de campo
POST /tipos-campo
{
  "name_campo": "Percentual",
  "type": "number",
  "enable": true
}

# 4. Criar indicador
POST /indicadores-novo
{
  "codigo_indicador": "AG001",
  "nome_indicador": "Índice de Qualidade da Água",
  "id_menu_item": 1,
  "id_tipo_campo_indicador": 1
}

# 5. Registrar valor do indicador para um município
POST /indicadores-municipio
{
  "id_indicador": 1,
  "id_municipio": 1,
  "ano": 2024,
  "valor_indicador": "85.5"
}
```
