const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api/v1';

const MENSAGENS_POR_STATUS = {
  400: 'Dados inválidos. Confira os campos.',
  404: 'Item não encontrado.',
  409: 'Já existe um item com esses dados.',
  422: 'A operação viola uma regra de negócio.',
  500: 'Erro interno no servidor. Tente novamente mais tarde.',
};

export class ErroApi extends Error {
  constructor(status, mensagem, tipo = null) {
    super(mensagem);
    this.name = 'ErroApi';
    this.status = status;
    this.tipo = tipo;
  }
}

export function mensagemDoStatus(status) {
  return MENSAGENS_POR_STATUS[status] ?? `Erro inesperado (status ${status}).`;
}

async function lerCorpo(resposta) {
  if (resposta.status === 204) return null;
  const texto = await resposta.text();
  return texto ? JSON.parse(texto) : null;
}

async function requisitar(caminho, opcoes = {}) {
  let resposta;
  try {
    resposta = await fetch(`${BASE_URL}${caminho}`, opcoes);
  } catch (erro) {
    if (erro.name === 'AbortError') throw erro;
    throw new ErroApi(0, 'Não foi possível conectar à API. Verifique se ela está rodando.');
  }

  const corpo = await lerCorpo(resposta);

  if (!resposta.ok) {
    throw new ErroApi(resposta.status, corpo?.message ?? mensagemDoStatus(resposta.status), corpo?.type);
  }

  return corpo;
}

function comJson(metodo, dados) {
  return {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  };
}

export async function apiGet(caminho, { signal } = {}) {
  const corpo = await requisitar(caminho, { signal });
  return corpo?.data ?? corpo;
}

export function apiPost(caminho, dados) {
  return requisitar(caminho, comJson('POST', dados));
}

export function apiPut(caminho, dados) {
  return requisitar(caminho, comJson('PUT', dados));
}

export function apiDelete(caminho) {
  return requisitar(caminho, { method: 'DELETE' });
}
