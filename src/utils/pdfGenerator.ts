
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async (element: HTMLElement, filename: string = 'travel-offer') => {
  try {
    // Create canvas from the element
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794,
      height: element.scrollHeight
    });

    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [794, canvas.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, 794, canvas.height);
    
    // Download the PDF
    pdf.save(`${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  }
};
