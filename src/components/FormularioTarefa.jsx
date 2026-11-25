import { useEffect, useState } from 'react';
import { STATUS, paraEnvio, validarTarefa } from '../utils/tarefas.js';

const VAZIO = { titulo: '', descricao: '', prazo: '', status: 'Pendente' };

function paraFormulario(tarefa) {
  if (!tarefa) return VAZIO;
  return {
    titulo: tarefa.titulo ?? '',
    descricao: tarefa.descricao ?? '',
    prazo: tarefa.prazo ?? '',
    status: tarefa.status ?? 'Pendente',
  };
}

export default function FormularioTarefa({ tarefaEmEdicao = null, aoSalvar, aoCancelar }) {
  const [campos, setCampos] = useState(paraFormulario(tarefaEmEdicao));
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const editando = Boolean(tarefaEmEdicao);

  useEffect(() => {
    setCampos(paraFormulario(tarefaEmEdicao));
    setMensagem('');
  }, [tarefaEmEdicao]);

  function alterar(evento) {
    const { name, value } = evento.target;
    setCampos((atuais) => ({ ...atuais, [name]: value }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    try {
      validarTarefa(campos);
    } catch (erro) {
      setMensagem(erro.message);
      return;
    }

    setEnviando(true);
    setMensagem('');
    try {
      await aoSalvar(paraEnvio(campos, tarefaEmEdicao));
      if (!editando) setCampos(VAZIO);
    } catch (erro) {
      setMensagem(erro.message);
    } finally {
      setEnviando(false);
    }
  }

  let textoBotao = 'Cadastrar';
  if (editando) textoBotao = 'Salvar alterações';
  if (enviando) textoBotao = 'Salvando...';

  return (
    <form className="formulario" onSubmit={enviar} noValidate>
      <h2>{editando ? 'Editar tarefa' : 'Nova tarefa'}</h2>

      <label>
        <span className="rotulo">Título *</span>
        <input name="titulo" value={campos.titulo} onChange={alterar} placeholder="Ex.: Entregar relatório" />
      </label>

      <label>
        <span className="rotulo">Descrição</span>
        <textarea name="descricao" value={campos.descricao} onChange={alterar} rows={3} placeholder="Detalhes da tarefa" />
      </label>

      <div className="linha">
        <label>
          <span className="rotulo">Prazo *</span>
          <input type="date" name="prazo" value={campos.prazo} onChange={alterar} />
        </label>

        <label>
          <span className="rotulo">Status</span>
          <select name="status" value={campos.status} onChange={alterar}>
            {STATUS.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </label>
      </div>

      {mensagem && <p className="mensagem-erro" role="alert">{mensagem}</p>}

      <div className="acoes">
        <button type="submit" className="botao-primario" disabled={enviando}>
          {textoBotao}
        </button>
        {editando && (
          <button type="button" className="botao-secundario" onClick={aoCancelar} disabled={enviando}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
