import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export interface ExportData {
  title: string;
  data: any[];
  headers?: string[];
  metadata?: {
    generatedBy: string;
    generatedAt: string;
    systemInfo: any;
  };
}

// Export PDF avec capture d'écran et données
export class PDFExporter {
  private doc: jsPDF;

  constructor() {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
  }

  async exportDashboard(elementId: string, data: ExportData): Promise<void> {
    try {
      // Capture de l'élément HTML
      const element = document.getElementById(elementId);
      if (!element) throw new Error(`Element with id "${elementId}" not found`);

      const canvas = await html2canvas(element, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Configuration du PDF
      this.addHeader(data.title);
      this.addMetadata(data.metadata);
      
      // Ajouter l'image
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let position = 60; // Position après le header
      
      // Ajouter l'image sur plusieurs pages si nécessaire
      if (imgHeight > 180) {
        let remainingHeight = imgHeight;
        let sourceY = 0;
        
        while (remainingHeight > 0) {
          const pageHeight = Math.min(remainingHeight, 180);
          const sourceHeight = (pageHeight * canvas.height) / imgHeight;
          
          // Créer un canvas temporaire pour cette section
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = canvas.width;
          tempCanvas.height = sourceHeight;
          
          const tempCtx = tempCanvas.getContext('2d');
          if (tempCtx) {
            tempCtx.drawImage(
              canvas, 0, sourceY, canvas.width, sourceHeight,
              0, 0, canvas.width, sourceHeight
            );
            
            const tempImgData = tempCanvas.toDataURL('image/png');
            this.doc.addImage(tempImgData, 'PNG', 10, position, imgWidth, pageHeight);
          }
          
          remainingHeight -= pageHeight;
          sourceY += sourceHeight;
          
          if (remainingHeight > 0) {
            this.doc.addPage();
            position = 20;
          }
        }
      } else {
        this.doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      }

      // Ajouter les données en format tableau
      if (data.data && data.data.length > 0) {
        this.doc.addPage();
        this.addDataTable(data);
      }

      // Footer
      this.addFooter();
      
      // Télécharger le PDF
      const filename = `${data.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      this.doc.save(filename);
      
    } catch (error) {
      console.error('Erreur export PDF:', error);
      throw error;
    }
  }

  private addHeader(title: string): void {
    // Logo et titre
    this.doc.setFillColor(79, 70, 229); // Indigo
    this.doc.rect(10, 10, 190, 25, 'F');
    
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('🏇 Club Jockey Tunisie', 15, 25);
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Système de Gestion Exécutif', 15, 32);
    
    // Titre du rapport
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, 15, 50);
  }

  private addMetadata(metadata?: ExportData['metadata']): void {
    if (!metadata) return;

    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(100, 100, 100);
    
    this.doc.text(`Généré par: ${metadata.generatedBy}`, 120, 45);
    this.doc.text(`Date: ${new Date(metadata.generatedAt).toLocaleString('fr-FR')}`, 120, 50);
  }

  private addDataTable(data: ExportData): void {
    let yPos = 30;
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(0, 0, 0);
    this.doc.text('Données Détaillées', 15, yPos);
    
    yPos += 15;
    
    if (data.headers && data.headers.length > 0) {
      // Headers
      this.doc.setFillColor(240, 240, 240);
      this.doc.rect(15, yPos - 5, 180, 8, 'F');
      
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'bold');
      data.headers.forEach((header, index) => {
        this.doc.text(header, 20 + (index * 35), yPos);
      });
      
      yPos += 12;
    }

    // Données
    this.doc.setFont('helvetica', 'normal');
    data.data.slice(0, 50).forEach((row, index) => { // Limite à 50 lignes
      if (yPos > 270) { // Nouvelle page si nécessaire
        this.doc.addPage();
        yPos = 30;
      }

      if (typeof row === 'object') {
        Object.values(row).forEach((value: any, colIndex) => {
          this.doc.text(String(value).substring(0, 15), 20 + (colIndex * 35), yPos);
        });
      } else {
        this.doc.text(String(row), 20, yPos);
      }
      
      yPos += 7;
    });

    if (data.data.length > 50) {
      this.doc.setFont('helvetica', 'italic');
      this.doc.text(`... et ${data.data.length - 50} autres lignes`, 20, yPos + 10);
    }
  }

  private addFooter(): void {
    const pageCount = this.doc.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      
      this.doc.setFillColor(245, 245, 245);
      this.doc.rect(10, 285, 190, 12, 'F');
      
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(100, 100, 100);
      
      this.doc.text('Club Jockey Tunisie - Document Confidentiel', 15, 292);
      this.doc.text(`Page ${i}/${pageCount}`, 175, 292);
      
      const now = new Date().toLocaleString('fr-FR');
      this.doc.text(`Généré le ${now}`, 15, 295);
    }
  }
}

// Export Excel
export class ExcelExporter {
  async exportData(data: ExportData): Promise<void> {
    try {
      // Créer un nouveau workbook
      const wb = XLSX.utils.book_new();
      
      // Feuille principale avec les données
      if (data.data && data.data.length > 0) {
        const ws = XLSX.utils.json_to_sheet(data.data);
        
        // Style des headers
        if (data.headers) {
          const headerStyle = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "4F46E5" } }, // Indigo
            alignment: { horizontal: "center" }
          };
          
          data.headers.forEach((_, index) => {
            const cellRef = XLSX.utils.encode_cell({ r: 0, c: index });
            if (!ws[cellRef]) ws[cellRef] = { t: 's', v: '' };
            ws[cellRef].s = headerStyle;
          });
        }
        
        // Ajuster la largeur des colonnes
        const colWidths = data.headers?.map(header => ({ wch: Math.max(header.length, 15) }));
        if (colWidths) {
          ws['!cols'] = colWidths;
        }
        
        XLSX.utils.book_append_sheet(wb, ws, 'Données');
      }
      
      // Feuille de métadonnées
      if (data.metadata) {
        const metaData = [
          ['Titre du Rapport', data.title],
          ['Généré par', data.metadata.generatedBy],
          ['Date de Génération', new Date(data.metadata.generatedAt).toLocaleString('fr-FR')],
          ['Nombre de Lignes', data.data.length],
          ['Système', 'Club Jockey Tunisie'],
          ['Version', '2.0.0']
        ];
        
        const metaWs = XLSX.utils.aoa_to_sheet(metaData);
        XLSX.utils.book_append_sheet(wb, metaWs, 'Métadonnées');
      }
      
      // Télécharger le fichier
      const filename = `${data.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, filename);
      
    } catch (error) {
      console.error('Erreur export Excel:', error);
      throw error;
    }
  }

  async exportMultipleSheets(sheets: { name: string; data: any[] }[], title: string): Promise<void> {
    try {
      const wb = XLSX.utils.book_new();
      
      sheets.forEach(sheet => {
        const ws = XLSX.utils.json_to_sheet(sheet.data);
        XLSX.utils.book_append_sheet(wb, ws, sheet.name);
      });
      
      const filename = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, filename);
      
    } catch (error) {
      console.error('Erreur export multi-feuilles Excel:', error);
      throw error;
    }
  }
}

// Utilitaires d'export
export const exportUtils = {
  pdf: new PDFExporter(),
  excel: new ExcelExporter(),
  
  // Export rapide des métriques dashboard
  async exportDashboardMetrics(metrics: any, user: any) {
    const data: ExportData = {
      title: 'Métriques Dashboard Exécutif',
      data: [
        { Métrique: 'Chevaux Enregistrés', Valeur: metrics.horses.total, Évolution: metrics.horses.change, Description: metrics.horses.description },
        { Métrique: 'Utilisateurs Actifs', Valeur: metrics.users.total, Évolution: metrics.users.change, Description: metrics.users.description },
        { Métrique: 'Courses Programmées', Valeur: metrics.races.total, Évolution: metrics.races.change, Description: metrics.races.description },
        { Métrique: 'Jockeys Certifiés', Valeur: metrics.jockeys.total, Évolution: metrics.jockeys.change, Description: metrics.jockeys.description }
      ],
      headers: ['Métrique', 'Valeur', 'Évolution', 'Description'],
      metadata: {
        generatedBy: `${user.firstName} ${user.lastName} (${user.role})`,
        generatedAt: new Date().toISOString(),
        systemInfo: { version: '2.0.0', environment: 'production' }
      }
    };

    return data;
  },

  // Export des licences
  async exportLicenses(licenses: any[], user: any) {
    const data: ExportData = {
      title: 'Rapport des Licences Professionnelles',
      data: licenses.map(license => ({
        'Numéro Licence': license.licenseNumber,
        'Titulaire': license.holderName,
        'Type': license.type,
        'Catégorie': license.category,
        'Statut': license.status,
        'Date Émission': new Date(license.issueDate).toLocaleDateString('fr-FR'),
        'Date Expiration': new Date(license.expiryDate).toLocaleDateString('fr-FR'),
        'Spécialisations': license.specializations?.join(', ') || ''
      })),
      headers: ['Numéro Licence', 'Titulaire', 'Type', 'Catégorie', 'Statut', 'Date Émission', 'Date Expiration', 'Spécialisations'],
      metadata: {
        generatedBy: `${user.firstName} ${user.lastName} (${user.role})`,
        generatedAt: new Date().toISOString(),
        systemInfo: { totalLicenses: licenses.length }
      }
    };

    return data;
  }
};
