import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import CartaoTarefa from './CartaoTarefa.jsx';

const tarefa = {
  id: '65f1c2a9e4b0a1b2c3d4e5f6',
  titulo: 'Entregar relatório',
  descricao: 'Relatório mensal da equipe',
  status: 'Pendente',
  prazo: '2099-12-04',
};

describe('CartaoTarefa', () => {
  it('mostra título, descrição, status e prazo formatado', () => {
    render(<CartaoTarefa tarefa={tarefa} aoEditar={() => {}} aoExcluir={() => {}} />);

    expect(screen.getByText('Entregar relatório')).toBeInTheDocument();
    expect(screen.getByText('Relatório mensal da equipe')).toBeInTheDocument();
    expect(screen.getByText('Pendente')).toBeInTheDocument();
    expect(screen.getByText('04/12/2099')).toBeInTheDocument();
  });

  it('chama aoEditar e aoExcluir com a tarefa ao clicar nos botões', () => {
    const aoEditar = vi.fn();
    const aoExcluir = vi.fn();
    render(<CartaoTarefa tarefa={tarefa} aoEditar={aoEditar} aoExcluir={aoExcluir} />);

    fireEvent.click(screen.getByRole('button', { name: 'Editar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));

    expect(aoEditar).toHaveBeenCalledWith(tarefa);
    expect(aoExcluir).toHaveBeenCalledWith(tarefa);
  });
});
