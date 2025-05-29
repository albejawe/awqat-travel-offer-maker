
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async (element: HTMLElement, filename: string = 'travel-offer') => {
  try {
    // Temporarily remove the transform scale for accurate capture
    const originalTransform = element.style.transform;
    const originalWidth = element.style.width;
    element.style.transform = 'none';
    element.style.width = '794px';

    // Create canvas from the element with proper sizing
    const canvas = await html2canvas(element, {
      scale: 1.5, // Reduced scale for better performance
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794,
      height: element.scrollHeight,
      windowWidth: 794,
      windowHeight: element.scrollHeight
    });

    // Restore original styles
    element.style.transform = originalTransform;
    element.style.width = originalWidth;

    // Calculate proper dimensions for A4
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Create PDF with A4 dimensions
    const pdf = new jsPDF({
      orientation: imgHeight > pageHeight ? 'portrait' : 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    let heightLeft = imgHeight;
    let position = 0;

    // Add image to PDF
    const imgData = canvas.toDataURL('image/png', 0.8); // Reduced quality for smaller file size
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add new pages if content is longer than one page
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Download the PDF
    pdf.save(`${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  }
};
