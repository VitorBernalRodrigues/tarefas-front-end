import { estaAtrasada, formatarPrazo } from '../utils/tarefas.js';

const CLASSE_STATUS = {
  Pendente: 'selo-pendente',
  'Em Andamento': 'selo-andamento',
  'Concluída': 'selo-concluida',
};

export default function CartaoTarefa({ tarefa, aoEditar, aoExcluir, emEdicao = false }) {
  const atrasada = estaAtrasada(tarefa);
  const classes = ['cartao'];
  if (emEdicao) classes.push('cartao-editando');
  if (atrasada) classes.push('cartao-atrasado');

  return (
    <article className={classes.join(' ')}>
      <header className="cartao-topo">
        <h3>{tarefa.titulo}</h3>
        <span className={`selo ${CLASSE_STATUS[tarefa.status] ?? ''}`}>{tarefa.status}</span>
      </header>
      <p className="cartao-descricao">{tarefa.descricao || 'Sem descrição.'}</p>
      <footer className="cartao-rodape">
        <span className="prazo">
          Prazo: <strong>{formatarPrazo(tarefa.prazo)}</strong>
          {atrasada && <span className="selo selo-atrasada">Atrasada</span>}
        </span>
        <div className="acoes">
          <button type="button" className="botao-secundario" onClick={() => aoEditar(tarefa)}>
            Editar
          </button>
          <button type="button" className="botao-perigo" onClick={() => aoExcluir(tarefa)}>
            Excluir
          </button>
        </div>
      </footer>
    </article>
  );
}
