# Gerenciador de Tarefas

Aplicação React que gerencia as tarefas de uma equipe (cadastrar, listar, editar, excluir e buscar), consumindo o recurso `/tarefas` da API Express do PTAS3.

**Tema:** gerenciamento de tarefas e produtividade de equipes (mesmo tema da API).

## Opção de API: A (API Express do PTAS3)

- Repositório da API: https://github.com/VitorBernalRodrigues/api-tarefas
- Base URL: `http://localhost:3333/api/v1` (configurável em `VITE_API_URL`)
- Listas chegam no envelope `{ data, meta }` e erros em `{ type, message }`.
- A API libera CORS para `http://localhost:5173`.

### Rotas usadas

| Método | Rota                     | Uso no front                   |
| ------ | ------------------------ | ------------------------------ |
| GET    | `/api/v1/tarefas`        | Carrega a lista no início      |
| POST   | `/api/v1/tarefas`        | Cadastra uma tarefa            |
| PUT    | `/api/v1/tarefas/:id`    | Salva a edição de uma tarefa   |
| DELETE | `/api/v1/tarefas/:id`    | Exclui uma tarefa              |

### Campos da tarefa

| Campo          | Tipo                 | Obrigatório | Observação                                   |
| -------------- | -------------------- | ----------- | -------------------------------------------- |
| `id`           | texto (24 hex)       | gerado      | ObjectId do MongoDB convertido em texto      |
| `titulo`       | texto                | sim         | mínimo de 3 caracteres no front              |
| `descricao`    | texto                | não         |                                              |
| `prazo`        | data `AAAA-MM-DD`    | sim         |                                              |
| `status`       | texto                | não         | `Pendente`, `Em Andamento` ou `Concluída`    |
| `usuario_id`   | texto (24 hex)       | não         | mantido na edição                            |
| `categoria_id` | texto (24 hex)       | não         | mantido na edição                            |
| `criado_em`    | data e hora          | gerado      |                                              |
| `concluida_em` | data e hora          | gerado      | preenchido quando a tarefa é concluída       |

## Como rodar

Requisitos: Node.js 22.13 ou superior e Docker.

### 1. API

```bash
git clone https://github.com/VitorBernalRodrigues/api-tarefas.git
cd api-tarefas
npm install
cp .env.example .env
npm run dev
```

O `npm run dev` sobe o MongoDB em um container Docker e inicia a API em `http://localhost:3333/api/v1`.

### 2. Front-end

Em outro terminal:

```bash
git clone https://github.com/VitorBernalRodrigues/tarefas-front-end.git
cd tarefas-front-end
npm install
cp .env.example .env
npm run dev
```

Acesse `http://localhost:5173`.

### Testes e build

```bash
npm test
npm run build
```

## Estrutura

```
src/
├── api.js                     helper de API (único arquivo com fetch)
├── utils/tarefas.js           funções puras: validar, filtrar, formatar
├── components/
│   ├── Busca.jsx              campo de busca por título
│   ├── CartaoTarefa.jsx       cartão de uma tarefa
│   ├── FormularioTarefa.jsx   formulário de cadastro e edição
│   └── ListaTarefas.jsx       lista com estados de carregando, erro e vazio
├── App.jsx                    estado da aplicação e chamadas à API
└── App.css                    estilos
```

## Funcionalidades

- **Listar:** a lista carrega no primeiro render com `useEffect` e `AbortController`, com estados de carregando, erro e vazio.
- **Cadastrar:** o formulário envia `POST`, limpa os campos e adiciona a tarefa na lista sem refazer o `GET`.
- **Editar:** o botão "Editar" preenche o formulário, o envio vira `PUT` e a lista é atualizada com `map`. "Cancelar" volta ao modo de cadastro.
- **Excluir:** `DELETE` pelo helper e a tarefa sai da lista com `filter`.
- **Buscar:** filtra por título no próprio navegador, sem nova requisição, pela função `filtrarTarefas`.
- **Validação:** título e prazo vazios mostram mensagem no formulário e a API não é chamada.
- **Erros da API:** o helper usa a mensagem do corpo `{ type, message }` ou uma mensagem padrão por status (404 → "Item não encontrado.").

## NoSQL vs SQL

Documento real devolvido por `GET /api/v1/tarefas`:

```json
{
  "id": "6b06f59291ea1e345e8f3f4a",
  "titulo": "Configurar MongoDB no Docker",
  "descricao": "Script db:up",
  "status": "Concluída",
  "prazo": "2026-11-18",
  "usuario_id": null,
  "categoria_id": null,
  "criado_em": "2026-11-25 11:49:54",
  "concluida_em": "2026-11-25 11:49:54"
}
```

No MongoDB, cada tarefa é um **documento**: um objeto no formato JSON (BSON) com seus próprios campos. Documentos do mesmo tipo ficam agrupados em uma **coleção**, que é o equivalente a uma tabela do SQL, mas sem um esquema fixo de colunas. O MongoDB identifica cada documento pelo campo `_id`, um ObjectId de 24 caracteres hexadecimais gerado pelo próprio banco. A API converte esse `_id` no campo `id` em texto, como aparece no exemplo acima. Em um banco SQL (ou no JSONPlaceholder), o `id` costuma ser um número inteiro sequencial (1, 2, 3...) gerado com auto incremento. Por isso o front trata o `id` sempre como texto e nunca faz contas com ele.
