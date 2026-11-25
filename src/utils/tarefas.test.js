import { describe, expect, it } from 'vitest';
import { estaAtrasada, filtrarTarefas, formatarPrazo, paraEnvio, validarTarefa } from './tarefas.js';

const tarefas = [
  { id: '1', titulo: 'Entregar relatório', status: 'Pendente', prazo: '2026-12-01' },
  { id: '2', titulo: 'Revisar código', status: 'Concluída', prazo: '2026-11-10' },
  { id: '3', titulo: 'Reunião de RELATÓRIO', status: 'Em Andamento', prazo: null },
];

describe('validarTarefa', () => {
  it('aceita uma tarefa com título e prazo', () => {
    expect(validarTarefa({ titulo: 'Estudar React', prazo: '2026-12-04' })).toBe(true);
  });

  it('lança erro quando o título está vazio', () => {
    expect(() => validarTarefa({ titulo: '   ', prazo: '2026-12-04' })).toThrow('Informe o título da tarefa.');
  });

  it('lança erro quando falta o prazo', () => {
    expect(() => validarTarefa({ titulo: 'Estudar React', prazo: '' })).toThrow('Informe o prazo da tarefa.');
  });
});

describe('filtrarTarefas', () => {
  it('filtra pelo título sem diferenciar maiúsculas e minúsculas', () => {
    const resultado = filtrarTarefas(tarefas, 'relatório');
    expect(resultado.map((t) => t.id)).toEqual(['1', '3']);
  });

  it('devolve a lista inteira quando o termo está vazio', () => {
    expect(filtrarTarefas(tarefas, '  ')).toHaveLength(3);
  });
});

describe('formatarPrazo', () => {
  it('converte AAAA-MM-DD para DD/MM/AAAA', () => {
    expect(formatarPrazo('2026-12-04')).toBe('04/12/2026');
  });

  it('mostra "Sem prazo" quando não há data', () => {
    expect(formatarPrazo(null)).toBe('Sem prazo');
  });
});

describe('estaAtrasada', () => {
  it('considera atrasada a tarefa não concluída com prazo vencido', () => {
    expect(estaAtrasada(tarefas[0], '2026-12-02')).toBe(true);
  });

  it('não considera atrasada a tarefa concluída', () => {
    expect(estaAtrasada(tarefas[1], '2026-12-02')).toBe(false);
  });
});

describe('paraEnvio', () => {
  it('mantém o responsável e a categoria da tarefa original na edição', () => {
    const original = { usuario_id: 'abc', categoria_id: 'def' };
    const formulario = { titulo: ' Nova ', descricao: '', prazo: '2026-12-04', status: 'Pendente' };
    expect(paraEnvio(formulario, original)).toEqual({
      titulo: 'Nova',
      descricao: null,
      prazo: '2026-12-04',
      status: 'Pendente',
      usuario_id: 'abc',
      categoria_id: 'def',
    });
  });
});
