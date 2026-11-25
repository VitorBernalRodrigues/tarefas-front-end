import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import FormularioTarefa from './FormularioTarefa.jsx';

describe('FormularioTarefa', () => {
  it('mostra mensagem de validação e não salva quando enviado vazio', () => {
    const aoSalvar = vi.fn();
    render(<FormularioTarefa aoSalvar={aoSalvar} aoCancelar={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Informe o título da tarefa.');
    expect(aoSalvar).not.toHaveBeenCalled();
  });

  it('preenche os campos e mostra o botão Cancelar no modo edição', () => {
    const tarefa = { id: '1', titulo: 'Revisar código', descricao: '', status: 'Concluída', prazo: '2026-12-04' };
    render(<FormularioTarefa tarefaEmEdicao={tarefa} aoSalvar={() => {}} aoCancelar={() => {}} />);

    expect(screen.getByRole('heading', { name: 'Editar tarefa' })).toBeInTheDocument();
    expect(screen.getByDisplayValue('Revisar código')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
  });
});
