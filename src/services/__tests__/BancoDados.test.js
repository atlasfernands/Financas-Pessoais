import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BancoDados } from '../services/BancoDados';

describe('BancoDados', () => {
  let db;
  const mockTransacao = {
    id: '1',
    description: 'Teste',
    amount: 100,
    type: 'receita',
    date: '2025-08-05',
    category: 'Salário'
  };

  beforeEach(() => {
    // Limpa o localStorage antes de cada teste
    localStorage.clear();
    db = new BancoDados();
  });

  describe('operações com transações', () => {

    it('adiciona uma transação corretamente', () => {
      const resultado = db.adicionarTransacao(mockTransacao);
      expect(resultado).toBeTruthy();
      
      const transacoes = db.listarTransacoes();
      expect(transacoes).toHaveLength(1);
      expect(transacoes[0]).toEqual(mockTransacao);
    });

    it('atualiza uma transação existente', () => {
      db.adicionarTransacao(mockTransacao);
      
      const transacaoAtualizada = {
        ...mockTransacao,
        amount: 200
      };

      const resultado = db.atualizarTransacao('1', transacaoAtualizada);
      expect(resultado).toBeTruthy();
      
      const transacao = db.buscarTransacao('1');
      expect(transacao.amount).toBe(200);
    });

    it('remove uma transação existente', () => {
      db.adicionarTransacao(mockTransacao);
      
      const resultado = db.removerTransacao('1');
      expect(resultado).toBeTruthy();
      
      const transacoes = db.listarTransacoes();
      expect(transacoes).toHaveLength(0);
    });

    it('calcula saldo corretamente', () => {
      // Adiciona receita
      db.adicionarTransacao(mockTransacao);
      
      // Adiciona despesa
      db.adicionarTransacao({
        id: '2',
        description: 'Teste Despesa',
        amount: 50,
        type: 'despesa',
        date: '2025-08-05',
        category: 'Alimentação'
      });

      const saldo = db.calcularSaldo();
      expect(saldo).toBe(50); // 100 (receita) - 50 (despesa)
    });
  });

  describe('operações com categorias', () => {
    it('gerencia categorias corretamente', () => {
      // Adiciona categoria
      const novaCategoria = 'Nova Categoria';
      const resultado = db.adicionarCategoria(novaCategoria);
      expect(resultado).toBeTruthy();

      // Lista categorias
      const categorias = db.listarCategorias();
      expect(categorias).toContain(novaCategoria);

      // Remove categoria
      const remocao = db.removerCategoria(novaCategoria);
      expect(remocao).toBeTruthy();
      
      const categoriasAtualizadas = db.listarCategorias();
      expect(categoriasAtualizadas).not.toContain(novaCategoria);
    });
  });

  describe('persistência de dados', () => {
    it('persiste dados no localStorage', () => {
      db.adicionarTransacao(mockTransacao);
      
      // Simula recarregamento criando nova instância
      const novoDb = new BancoDados();
      const transacoes = novoDb.listarTransacoes();
      
      expect(transacoes).toHaveLength(1);
      expect(transacoes[0]).toEqual(mockTransacao);
    });

    it('manipula erros de localStorage', () => {
      // Simula erro no localStorage
      const mockError = new Error('Storage error');
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn().mockImplementation(() => {
        throw mockError;
      });

      // Tenta adicionar transação
      const resultado = db.adicionarTransacao(mockTransacao);
      expect(resultado).toBeFalsy();

      // Restaura localStorage
      localStorage.setItem = originalSetItem;
    });
  });
});
