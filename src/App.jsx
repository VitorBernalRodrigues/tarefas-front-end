import { useEffect, useState } from 'react';
import { apiDelete, apiGet, apiPost, apiPut } from './api.js';
import { filtrarTarefas } from './utils/tarefas.js';
import FormularioTarefa from './components/FormularioTarefa.jsx';
import ListaTarefas from './components/ListaTarefas.jsx';
import Busca from './components/Busca.jsx';

export default function App() {
  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [termo, setTermo] = useState('');
  const [emEdicao, setEmEdicao] = useState(null);

  useEffect(() => {
    const controlador = new AbortController();

    async function carregar() {
      try {
        const lista = await apiGet('/tarefas', { signal: controlador.signal });
        setTarefas(lista);
        setErro('');
      } catch (falha) {
        if (falha.name === 'AbortError') return;
        setErro(falha.message);
      } finally {
        if (!controlador.signal.aborted) setCarregando(false);
      }
    }

    carregar();
    return () => controlador.abort();
  }, []);

  async function salvar(dados) {
    if (emEdicao) {
      const atualizada = await apiPut(`/tarefas/${emEdicao.id}`, dados);
      setTarefas((atuais) => atuais.map((t) => (t.id === atualizada.id ? atualizada : t)));
      setEmEdicao(null);
      setAviso('Tarefa atualizada.');
    } else {
      const criada = await apiPost('/tarefas', dados);
      setTarefas((atuais) => [criada, ...atuais]);
      setAviso('Tarefa cadastrada.');
    }
  }

  async function excluir(tarefa) {
    setAviso('');
    try {
      await apiDelete(`/tarefas/${tarefa.id}`);
      setTarefas((atuais) => atuais.filter((t) => t.id !== tarefa.id));
      if (emEdicao?.id === tarefa.id) setEmEdicao(null);
      setAviso('Tarefa excluída.');
    } catch (falha) {
      setAviso(falha.message);
    }
  }

  function editar(tarefa) {
    setAviso('');
    setEmEdicao(tarefa);
  }

  const visiveis = filtrarTarefas(tarefas, termo);

  return (
    <div className="app">
      <header className="cabecalho">
        <div>
          <h1>Tarefas da equipe</h1>
          <p>Cadastre, acompanhe e conclua o que cada um tem para fazer.</p>
        </div>
        <span className="contador">{tarefas.length === 1 ? '1 tarefa' : `${tarefas.length} tarefas`}</span>
      </header>

      <main className="conteudo">
        <section className="painel-formulario">
          <FormularioTarefa tarefaEmEdicao={emEdicao} aoSalvar={salvar} aoCancelar={() => setEmEdicao(null)} />
        </section>

        <section className="painel-lista">
          <div className="lista-topo">
            <h2>Tarefas</h2>
            <Busca termo={termo} aoMudar={setTermo} />
          </div>
          {aviso && <p className="aviso" role="status">{aviso}</p>}
          <ListaTarefas
            tarefas={visiveis}
            carregando={carregando}
            erro={erro}
            temBusca={termo.trim() !== ''}
            idEmEdicao={emEdicao?.id}
            aoEditar={editar}
            aoExcluir={excluir}
          />
        </section>
      </main>
    </div>
  );
}
