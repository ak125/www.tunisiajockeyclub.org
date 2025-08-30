import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

// Mock des utilitaires d'export
const mockJsPDF = {
  text: vi.fn(),
  addImage: vi.fn(),
  addPage: vi.fn(),
  save: vi.fn(),
  setFontSize: vi.fn(),
  setFont: vi.fn(),
  autoTable: vi.fn()
};

const mockHtml2canvas = vi.fn().mockResolvedValue({
  toDataURL: vi.fn().mockReturnValue('data:image/png;base64,mock_image_data')
});

const mockXLSX = {
  utils: {
    json_to_sheet: vi.fn().mockReturnValue({}),
    book_new: vi.fn().mockReturnValue({ Sheets: {}, SheetNames: [] }),
    book_append_sheet: vi.fn(),
  },
  writeFile: vi.fn()
};

vi.mock('jspdf', () => ({
  default: vi.fn(() => mockJsPDF)
}));

vi.mock('html2canvas', () => ({
  default: mockHtml2canvas
}));

vi.mock('xlsx', () => mockXLSX);

describe('Export Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('PDF Export', () => {
    const mockUser = {
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    };

    const mockData = [
      { name: 'Horse 1', age: 3, status: 'Active', owner: 'Owner 1' },
      { name: 'Horse 2', age: 4, status: 'Retired', owner: 'Owner 2' },
      { name: 'Horse 3', age: 5, status: 'Active', owner: 'Owner 3' }
    ];

    it('should create PDF with correct metadata', async () => {
      const createPDFExporter = () => ({
        addMetadata: vi.fn((title, user) => ({
          title,
          author: `${user.firstName} ${user.lastName}`,
          subject: 'Tunisia Jockey Club Export',
          creator: 'TJC Management System',
          creationDate: new Date()
        })),
        
        addTableData: vi.fn((data, headers) => ({
          headers,
          data: data.map(row => Object.values(row)),
          totalRows: data.length
        }))
      });

      const exporter = createPDFExporter();
      const metadata = exporter.addMetadata('Horses Report', mockUser);
      const tableData = exporter.addTableData(mockData, ['Name', 'Age', 'Status', 'Owner']);

      expect(metadata.title).toBe('Horses Report');
      expect(metadata.author).toBe('Admin User');
      expect(metadata.subject).toBe('Tunisia Jockey Club Export');
      expect(tableData.totalRows).toBe(3);
      expect(tableData.headers).toEqual(['Name', 'Age', 'Status', 'Owner']);
    });

    it('should handle screenshot capture', async () => {
      const captureScreenshot = async (elementId: string) => {
        const mockElement = document.createElement('div');
        mockElement.id = elementId;
        document.body.appendChild(mockElement);

        const canvas = await mockHtml2canvas(mockElement);
        return canvas.toDataURL();
      };

      const imageData = await captureScreenshot('dashboard');
      expect(mockHtml2canvas).toHaveBeenCalled();
      expect(imageData).toBe('data:image/png;base64,mock_image_data');
    });

    it('should format currency values correctly', () => {
      const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('fr-TN', {
          style: 'currency',
          currency: 'TND',
          minimumFractionDigits: 2
        }).format(value);
      };

      expect(formatCurrency(1500.50)).toBe('1 500,50 TND');
      expect(formatCurrency(0)).toBe('0,00 TND');
      expect(formatCurrency(999999.99)).toBe('999 999,99 TND');
    });

    it('should handle large datasets with pagination', () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        value: Math.random() * 1000
      }));

      const paginateData = (data: any[], pageSize: number = 50) => {
        const pages = [];
        for (let i = 0; i < data.length; i += pageSize) {
          pages.push(data.slice(i, i + pageSize));
        }
        return pages;
      };

      const pages = paginateData(largeDataset);
      expect(pages).toHaveLength(20); // 1000 / 50 = 20 pages
      expect(pages[0]).toHaveLength(50);
      expect(pages[19]).toHaveLength(50);
    });

    it('should add headers and footers to PDF', () => {
      const addHeaderFooter = (pageNumber: number, totalPages: number, title: string) => ({
        header: {
          text: title,
          fontSize: 16,
          position: 'center',
          margin: 20
        },
        footer: {
          text: `Page ${pageNumber} sur ${totalPages} - Généré le ${new Date().toLocaleDateString('fr-FR')}`,
          fontSize: 10,
          position: 'center',
          margin: 10
        }
      });

      const headerFooter = addHeaderFooter(1, 5, 'Rapport des Chevaux');
      
      expect(headerFooter.header.text).toBe('Rapport des Chevaux');
      expect(headerFooter.footer.text).toContain('Page 1 sur 5');
      expect(headerFooter.footer.text).toContain('Généré le');
    });

    it('should handle PDF generation errors gracefully', async () => {
      mockJsPDF.save.mockImplementationOnce(() => {
        throw new Error('Failed to save PDF');
      });

      const handlePDFExport = async () => {
        try {
          mockJsPDF.save('test.pdf');
          return { success: true };
        } catch (error) {
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          };
        }
      };

      const result = await handlePDFExport();
      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to save PDF');
    });
  });

  describe('Excel Export', () => {
    const mockData = [
      { name: 'Horse 1', age: 3, status: 'Active' },
      { name: 'Horse 2', age: 4, status: 'Retired' }
    ];

    it('should create workbook with multiple sheets', () => {
      const createWorkbook = (sheets: Record<string, any[]>) => {
        const workbook = mockXLSX.utils.book_new();
        
        Object.entries(sheets).forEach(([sheetName, data]) => {
          const worksheet = mockXLSX.utils.json_to_sheet(data);
          mockXLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        });

        return workbook;
      };

      const sheets = {
        'Chevaux': mockData,
        'Résumé': [{ total: mockData.length, actifs: 1, retraités: 1 }]
      };

      createWorkbook(sheets);
      
      expect(mockXLSX.utils.book_new).toHaveBeenCalled();
      expect(mockXLSX.utils.json_to_sheet).toHaveBeenCalledTimes(2);
      expect(mockXLSX.utils.book_append_sheet).toHaveBeenCalledTimes(2);
    });

    it('should format data for Excel export', () => {
      const formatDataForExcel = (data: any[]) => {
        return data.map(item => ({
          ...item,
          // Convertir les dates en format Excel
          createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString('fr-FR') : '',
          // Formater les nombres
          price: item.price ? parseFloat(item.price).toFixed(2) : '0.00',
          // Nettoyer les chaînes
          description: item.description ? item.description.replace(/\n/g, ' ') : ''
        }));
      };

      const rawData = [
        { 
          name: 'Test', 
          createdAt: '2024-01-01T10:00:00Z', 
          price: '1500.5',
          description: 'Line 1\nLine 2'
        }
      ];

      const formatted = formatDataForExcel(rawData);
      
      expect(formatted[0].createdAt).toBe('01/01/2024');
      expect(formatted[0].price).toBe('1500.50');
      expect(formatted[0].description).toBe('Line 1 Line 2');
    });

    it('should generate summary statistics', () => {
      const generateSummary = (data: any[]) => {
        const stats = {
          total: data.length,
          byStatus: data.reduce((acc, item) => {
            acc[item.status] = (acc[item.status] || 0) + 1;
            return acc;
          }, {}),
          averageAge: data.reduce((sum, item) => sum + (item.age || 0), 0) / data.length
        };

        return [
          { metric: 'Total', value: stats.total },
          { metric: 'Actifs', value: stats.byStatus['Active'] || 0 },
          { metric: 'Retraités', value: stats.byStatus['Retired'] || 0 },
          { metric: 'Âge moyen', value: Math.round(stats.averageAge * 10) / 10 }
        ];
      };

      const summary = generateSummary(mockData);
      
      expect(summary).toHaveLength(4);
      expect(summary[0]).toEqual({ metric: 'Total', value: 2 });
      expect(summary[1]).toEqual({ metric: 'Actifs', value: 1 });
      expect(summary[2]).toEqual({ metric: 'Retraités', value: 1 });
      expect(summary[3]).toEqual({ metric: 'Âge moyen', value: 3.5 });
    });

    it('should handle empty datasets', () => {
      const handleEmptyData = (data: any[]) => {
        if (data.length === 0) {
          return [{ message: 'Aucune donnée disponible' }];
        }
        return data;
      };

      const result = handleEmptyData([]);
      expect(result).toEqual([{ message: 'Aucune donnée disponible' }]);
    });

    it('should validate data before export', () => {
      const validateExportData = (data: any[]) => {
        const errors = [];
        
        if (!Array.isArray(data)) {
          errors.push('Data must be an array');
        }
        
        if (data.length === 0) {
          errors.push('No data to export');
        }
        
        // Vérifier que tous les objets ont les mêmes clés
        if (data.length > 0) {
          const firstKeys = Object.keys(data[0]);
          const inconsistentRows = data.filter(item => {
            const keys = Object.keys(item);
            return keys.length !== firstKeys.length || 
                   !keys.every(key => firstKeys.includes(key));
          });
          
          if (inconsistentRows.length > 0) {
            errors.push(`${inconsistentRows.length} rows have inconsistent structure`);
          }
        }
        
        return { isValid: errors.length === 0, errors };
      };

      // Test données valides
      const validResult = validateExportData(mockData);
      expect(validResult.isValid).toBe(true);
      expect(validResult.errors).toHaveLength(0);

      // Test données invalides
      const invalidResult = validateExportData([]);
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.errors).toContain('No data to export');

      // Test structure inconsistante
      const inconsistentData = [
        { name: 'Test1', age: 3 },
        { name: 'Test2', status: 'Active' } // Clé différente
      ];
      const inconsistentResult = validateExportData(inconsistentData);
      expect(inconsistentResult.isValid).toBe(false);
      expect(inconsistentResult.errors[0]).toContain('inconsistent structure');
    });
  });

  describe('Export Progress Tracking', () => {
    it('should track export progress', async () => {
      const createProgressTracker = () => {
        let progress = 0;
        const callbacks: ((progress: number) => void)[] = [];
        
        return {
          updateProgress: (newProgress: number) => {
            progress = Math.max(0, Math.min(100, newProgress));
            callbacks.forEach(callback => callback(progress));
          },
          
          onProgress: (callback: (progress: number) => void) => {
            callbacks.push(callback);
          },
          
          getProgress: () => progress
        };
      };

      const tracker = createProgressTracker();
      let receivedProgress = 0;
      
      tracker.onProgress((progress) => {
        receivedProgress = progress;
      });

      tracker.updateProgress(25);
      expect(receivedProgress).toBe(25);

      tracker.updateProgress(75);
      expect(receivedProgress).toBe(75);

      tracker.updateProgress(150); // Should be clamped to 100
      expect(receivedProgress).toBe(100);
    });

    it('should simulate export steps', async () => {
      const simulateExport = async (onProgress: (progress: number) => void) => {
        const steps = [
          { name: 'Preparing data', duration: 100 },
          { name: 'Generating file', duration: 200 },
          { name: 'Finalizing', duration: 50 }
        ];

        let currentProgress = 0;
        const progressIncrement = 100 / steps.length;

        for (const step of steps) {
          await new Promise(resolve => setTimeout(resolve, step.duration));
          currentProgress += progressIncrement;
          onProgress(Math.round(currentProgress));
        }
      };

      const progressValues: number[] = [];
      
      await simulateExport((progress) => {
        progressValues.push(progress);
      });

      expect(progressValues).toHaveLength(3);
      expect(progressValues[0]).toBe(33);
      expect(progressValues[1]).toBe(67);
      expect(progressValues[2]).toBe(100);
    });
  });

  describe('Export File Naming', () => {
    it('should generate unique filenames', () => {
      const generateFilename = (type: string, extension: string, user?: any) => {
        const date = new Date();
        const dateStr = date.toISOString().split('T')[0];
        const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '-');
        const userStr = user ? `_${user.firstName}_${user.lastName}` : '';
        
        return `TJC_${type}_${dateStr}_${timeStr}${userStr}.${extension}`;
      };

      const mockUser = { firstName: 'Admin', lastName: 'User' };
      const filename = generateFilename('Horses', 'pdf', mockUser);
      
      expect(filename).toMatch(/^TJC_Horses_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}_Admin_User\.pdf$/);
    });

    it('should sanitize filenames', () => {
      const sanitizeFilename = (filename: string) => {
        return filename
          .replace(/[^a-zA-Z0-9\-_.]/g, '_')
          .replace(/_{2,}/g, '_')
          .replace(/^_|_$/g, '');
      };

      expect(sanitizeFilename('Invalid/Chars<>:"file.pdf')).toBe('Invalid_Chars___file.pdf');
      expect(sanitizeFilename('Normal_file-name.xlsx')).toBe('Normal_file-name.xlsx');
      expect(sanitizeFilename('___multiple___underscores___')).toBe('multiple_underscores');
    });
  });
});
