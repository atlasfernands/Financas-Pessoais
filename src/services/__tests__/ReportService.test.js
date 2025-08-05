import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReportService } from '../ReportService';
import jsPDF from 'jspdf';

// Mock do jsPDF
vi.mock('jspdf');

describe('ReportService', () => {
  const mockTransactions = [
    {
      id: 1,
      date: '2025-08-05',
      description: 'Teste',
      category: 'Salário',
      amount: 1000,
      type: 'receita'
    }
  ];

  const mockBalanceData = {
    saldoAtual: 1000,
    receitasPrevistas: 2000,
    despesasPrevistas: 1500
  };

  beforeEach(() => {
    // Limpa todos os mocks antes de cada teste
    vi.clearAllMocks();
    
    // Mock das funções do jsPDF
    jsPDF.mockImplementation(() => ({
      setFontSize: vi.fn(),
      text: vi.fn(),
      rect: vi.fn(),
      save: vi.fn(),
      addPage: vi.fn()
    }));
  });

  describe('generateTransactionReport', () => {
    it('gera relatório de transações com sucesso', async () => {
      const pdf = await ReportService.generateTransactionReport(mockTransactions, 'mensal');
      
      expect(pdf.text).toHaveBeenCalled();
      expect(pdf.save).not.toHaveBeenCalled(); // save só é chamado em downloadPDF
    });

    it('lida com lista vazia de transações', async () => {
      const pdf = await ReportService.generateTransactionReport([], 'mensal');
      
      expect(pdf.text).toHaveBeenCalled();
      // Verifica se o relatório indica que não há transações
      const pdfInstance = jsPDF.mock.results[0].value;
      const textCalls = pdfInstance.text.mock.calls;
      expect(textCalls.some(call => call[0].includes('0.00'))).toBe(true);
    });

    it('lida com período personalizado', async () => {
      await ReportService.generateTransactionReport(mockTransactions, 'anual');
      
      const pdfInstance = jsPDF.mock.results[0].value;
      const textCalls = pdfInstance.text.mock.calls;
      expect(textCalls.some(call => call[0].includes('Anual'))).toBe(true);
    });

    it('calcula totais corretamente', async () => {
      await ReportService.generateTransactionReport(mockTransactions, 'mensal');
      
      const pdfInstance = jsPDF.mock.results[0].value;
      const textCalls = pdfInstance.text.mock.calls;
      
      // Verifica se os totais estão corretos
      expect(textCalls.some(call => call[0].includes('1000.00'))).toBe(true);
    });
  });

  describe('generateBalanceReport', () => {
    it('gera relatório de saldo com sucesso', async () => {
      const pdf = await ReportService.generateBalanceReport(mockBalanceData);
      
      expect(pdf.text).toHaveBeenCalled();
      expect(pdf.save).not.toHaveBeenCalled();
    });

    it('inclui todas as informações de saldo', async () => {
      await ReportService.generateBalanceReport(mockBalanceData);
      
      const pdfInstance = jsPDF.mock.results[0].value;
      const textCalls = pdfInstance.text.mock.calls;
      
      // Verifica se todos os valores estão presentes
      expect(textCalls.some(call => call[0].includes('1000.00'))).toBe(true);
      expect(textCalls.some(call => call[0].includes('2000.00'))).toBe(true);
      expect(textCalls.some(call => call[0].includes('1500.00'))).toBe(true);
    });
  });

  describe('downloadPDF', () => {
    it('chama método save do PDF com nome do arquivo correto', () => {
      const mockPdf = { save: vi.fn() };
      const filename = 'teste.pdf';
      
      ReportService.downloadPDF(mockPdf, filename);
      expect(mockPdf.save).toHaveBeenCalledWith(filename);
    });
  });
});
