import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToExcel = (data, filename = 'export') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 10 },  // ID
    { wch: 15 },  // Type
    { wch: 15 },  // Category
    { wch: 15 },  // Amount
    { wch: 25 },  // Description
    { wch: 15 },  // Date
  ];
  
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportToPDF = (data, filename = 'export') => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('Transactions Report', 14, 22);
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  
  // Create table
  const tableData = data.map(item => [
    item.id,
    item.type,
    item.category,
    `$${item.amount.toFixed(2)}`,
    item.description || '-',
    new Date(item.date).toLocaleDateString(),
  ]);
  
  doc.autoTable({
    head: [['ID', 'Type', 'Category', 'Amount', 'Description', 'Date']],
    body: tableData,
    startY: 40,
    theme: 'striped',
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });
  
  // Add total
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.text(`Total Amount: $${total.toFixed(2)}`, 14, finalY);
  
  doc.save(`${filename}.pdf`);
};

export const exportUsersToExcel = (users, filename = 'users') => {
  const data = users.map(user => ({
    ID: user.id,
    Name: `${user.firstName} ${user.lastName}`,
    Email: user.email,
    City: user.address?.city || '-',
    Role: user.role,
    Phone: user.phone || '-',
  }));
  
  exportToExcel(data, filename);
};

export const exportTransactionsToPDF = (transactions, filename = 'transactions') => {
  exportToPDF(transactions, filename);
};
