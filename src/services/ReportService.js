import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export class ReportService {
  static async generateTransactionReport(transactions, period = 'mensal') {
    const pdf = new jsPDF('p', 'pt', 'a4');
    
    // Configurações do relatório
    const title = `Relatório de Transações - ${period.charAt(0).toUpperCase() + period.slice(1)}`;
    const dateStr = new Date().toLocaleDateString('pt-BR');
    
    // Adiciona cabeçalho
    pdf.setFontSize(20);
    pdf.text(title, 40, 40);
    pdf.setFontSize(12);
    pdf.text(`Gerado em: ${dateStr}`, 40, 60);
    
    // Calcula totais
    const totals = transactions.reduce((acc, trans) => {
      if (trans.type === 'receita') {
        acc.receitas += trans.amount;
      } else {
        acc.despesas += trans.amount;
      }
      return acc;
    }, { receitas: 0, despesas: 0 });
    
    // Adiciona resumo
    pdf.setFontSize(14);
    pdf.text('Resumo Financeiro', 40, 90);
    pdf.setFontSize(12);
    pdf.text(`Total de Receitas: R$ ${totals.receitas.toFixed(2)}`, 40, 110);
    pdf.text(`Total de Despesas: R$ ${totals.despesas.toFixed(2)}`, 40, 130);
    pdf.text(`Saldo: R$ ${(totals.receitas - totals.despesas).toFixed(2)}`, 40, 150);
    
    // Adiciona tabela de transações
    let yPos = 190;
    pdf.setFontSize(14);
    pdf.text('Detalhamento de Transações', 40, yPos);
    yPos += 20;
    
    // Cabeçalho da tabela
    pdf.setFillColor(240, 240, 240);
    pdf.rect(40, yPos, 515, 25, 'F');
    pdf.setFontSize(12);
    pdf.text('Data', 50, yPos + 17);
    pdf.text('Descrição', 150, yPos + 17);
    pdf.text('Categoria', 300, yPos + 17);
    pdf.text('Valor', 450, yPos + 17);
    
    // Dados da tabela
    yPos += 35;
    transactions.forEach((transaction) => {
      if (yPos > 750) {
        pdf.addPage();
        yPos = 40;
      }
      
      const date = new Date(transaction.date).toLocaleDateString('pt-BR');
      pdf.text(date, 50, yPos);
      pdf.text(transaction.description.substring(0, 25), 150, yPos);
      pdf.text(transaction.category, 300, yPos);
      pdf.text(
        `R$ ${transaction.amount.toFixed(2)}`,
        450,
        yPos,
        { align: 'right' }
      );
      
      yPos += 25;
    });
    
    return pdf;
  }

  static async generateBalanceReport(balanceData) {
    const pdf = new jsPDF('p', 'pt', 'a4');
    
    pdf.setFontSize(20);
    pdf.text('Relatório de Saldo e Projeções', 40, 40);
    
    pdf.setFontSize(12);
    pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 40, 60);
    
    // Adiciona informações do saldo
    pdf.setFontSize(14);
    pdf.text('Saldo Atual', 40, 90);
    pdf.setFontSize(12);
    pdf.text(`Saldo em Conta: R$ ${balanceData.saldoAtual.toFixed(2)}`, 40, 110);
    pdf.text(`Receitas Previstas: R$ ${balanceData.receitasPrevistas.toFixed(2)}`, 40, 130);
    pdf.text(`Despesas Previstas: R$ ${balanceData.despesasPrevistas.toFixed(2)}`, 40, 150);
    
    return pdf;
  }

  static downloadPDF(pdf, filename) {
    pdf.save(filename);
  }
}
