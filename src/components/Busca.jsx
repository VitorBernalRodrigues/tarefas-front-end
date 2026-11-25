export default function Busca({ termo, aoMudar }) {
  return (
    <label className="busca">
      <span className="rotulo">Buscar por título</span>
      <input
        type="search"
        value={termo}
        onChange={(evento) => aoMudar(evento.target.value)}
        placeholder="Ex.: relatório"
      />
    </label>
  );
}
