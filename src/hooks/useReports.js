import { useState } from 'react';
import { ReportService } from '../services/ReportService';

export const useReports = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateTransactionReport = async (transactions, period) => {
    try {
      setIsGenerating(true);
      const pdf = await ReportService.generateTransactionReport(transactions, period);
      ReportService.downloadPDF(pdf, `relatorio_transacoes_${period}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateBalanceReport = async (balanceData) => {
    try {
      setIsGenerating(true);
      const pdf = await ReportService.generateBalanceReport(balanceData);
      ReportService.downloadPDF(pdf, `relatorio_saldo_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar relatório de saldo:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateTransactionReport,
    generateBalanceReport
  };
};
