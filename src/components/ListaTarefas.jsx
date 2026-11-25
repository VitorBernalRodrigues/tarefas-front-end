import CartaoTarefa from './CartaoTarefa.jsx';

export default function ListaTarefas({ tarefas, carregando, erro, temBusca, idEmEdicao, aoEditar, aoExcluir }) {
  if (carregando) {
    return <p className="estado">Carregando tarefas...</p>;
  }

  if (erro) {
    return <p className="estado estado-erro" role="alert">{erro}</p>;
  }

  if (tarefas.length === 0) {
    return (
      <p className="estado">
        {temBusca ? 'Nenhuma tarefa encontrada para essa busca.' : 'Nenhuma tarefa cadastrada ainda.'}
      </p>
    );
  }

  return (
    <div className="lista">
      {tarefas.map((tarefa) => (
        <CartaoTarefa
          key={tarefa.id}
          tarefa={tarefa}
          emEdicao={tarefa.id === idEmEdicao}
          aoEditar={aoEditar}
          aoExcluir={aoExcluir}
        />
      ))}
    </div>
  );
}
