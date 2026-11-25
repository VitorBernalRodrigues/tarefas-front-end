export const STATUS = ['Pendente', 'Em Andamento', 'Concluída'];

export function validarTarefa(tarefa) {
  if (!tarefa.titulo || tarefa.titulo.trim() === '') {
    throw new Error('Informe o título da tarefa.');
  }
  if (tarefa.titulo.trim().length < 3) {
    throw new Error('O título deve ter ao menos 3 caracteres.');
  }
  if (!tarefa.prazo) {
    throw new Error('Informe o prazo da tarefa.');
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tarefa.prazo)) {
    throw new Error('O prazo deve estar no formato AAAA-MM-DD.');
  }
  return true;
}

export function filtrarTarefas(lista, termo) {
  const busca = termo.trim().toLowerCase();
  if (!busca) return lista;
  return lista.filter((tarefa) => tarefa.titulo.toLowerCase().includes(busca));
}

export function formatarPrazo(prazo) {
  if (!prazo) return 'Sem prazo';
  const [ano, mes, dia] = prazo.split('-');
  return `${dia}/${mes}/${ano}`;
}

export function estaAtrasada(tarefa, hoje = new Date().toLocaleDateString('sv-SE')) {
  return tarefa.status !== 'Concluída' && Boolean(tarefa.prazo) && tarefa.prazo < hoje;
}

export function paraEnvio(formulario, original = null) {
  return {
    titulo: formulario.titulo.trim(),
    descricao: formulario.descricao.trim() || null,
    prazo: formulario.prazo,
    status: formulario.status,
    usuario_id: original?.usuario_id ?? null,
    categoria_id: original?.categoria_id ?? null,
  };
}
