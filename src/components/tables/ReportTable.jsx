import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import Badge from '@components/ui/Badge';
import Button from '@components/ui/Button';
import reporteService from '@services/reporteService';

/**
 * Tabla de Reportes Disponibles
 * Lista estática de reportes que se pueden generar
 */
const ReportTable = () => {
    // Reportes disponibles
    const reports = [
        {
            id: 1,
            nombre: 'Reporte de Ventas',
            descripcion: 'Listado completo de ventas por período con detalles de productos y totales',
            tipo: 'EXCEL',
            categoria: 'Ventas',
            requiresDateRange: true,
            icon: <FileSpreadsheet className="w-5 h-5" />,
            action: async (fechaInicio, fechaFin) => {
                await reporteService.downloadVentasExcel(fechaInicio, fechaFin);
            },
        },
        {
            id: 2,
            nombre: 'Reporte de Stock Actual',
            descripcion: 'Estado actual del inventario de todos los productos',
            tipo: 'EXCEL',
            categoria: 'Inventario',
            requiresDateRange: false,
            icon: <FileSpreadsheet className="w-5 h-5" />,
            action: async () => {
                await reporteService.downloadStockExcel();
            },
        },
        {
            id: 3,
            nombre: 'Reporte de Stock Bajo',
            descripcion: 'Productos con stock por debajo del mínimo establecido',
            tipo: 'EXCEL',
            categoria: 'Inventario',
            requiresDateRange: false,
            icon: <FileSpreadsheet className="w-5 h-5" />,
            action: async () => {
                await reporteService.downloadStockBajoExcel();
            },
        },
        {
            id: 4,
            nombre: 'Reporte de Movimientos',
            descripcion: 'Historial de entradas, salidas y ajustes de inventario',
            tipo: 'EXCEL',
            categoria: 'Inventario',
            requiresDateRange: true,
            icon: <FileSpreadsheet className="w-5 h-5" />,
            action: async (fechaInicio, fechaFin) => {
                const blob = await reporteService.generateMovimientosExcel(fechaInicio, fechaFin);
                const filename = `movimientos_${new Date().getTime()}.xlsx`;
                reporteService.downloadFile(blob, filename);
            },
        },
        {
            id: 5,
            nombre: 'Reporte de Devoluciones',
            descripcion: 'Listado de productos devueltos con motivos y fechas',
            tipo: 'EXCEL',
            categoria: 'Operaciones',
            requiresDateRange: true,
            icon: <FileSpreadsheet className="w-5 h-5" />,
            action: async (fechaInicio, fechaFin) => {
                const blob = await reporteService.generateDevolucionesExcel(fechaInicio, fechaFin);
                const filename = `devoluciones_${new Date().getTime()}.xlsx`;
                reporteService.downloadFile(blob, filename);
            },
        },
    ];

    // Categorías únicas
    const categories = [...new Set(reports.map(r => r.categoria))];

    // Mapeo de colores por categoría
    const categoryColors = {
        Ventas: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
        Inventario: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
        Operaciones: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
    };

    // Generar reporte
    const handleGenerate = async (report) => {
        try {
            if (report.requiresDateRange) {
                // Por ahora usar rango del mes actual
                const { fechaInicio, fechaFin } = reporteService.getCurrentMonthRange();
                await report.action(fechaInicio, fechaFin);
            } else {
                await report.action();
            }
        } catch (error) {
            console.error('Error al generar reporte:', error);
            alert('Error al generar el reporte. Intenta nuevamente.');
        }
    };

    return (
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-md">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-dark-border">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text">
                    Reportes Disponibles
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-dark-muted">
                    Genera y descarga reportes en formato Excel
                </p>
            </div>

            {/* Lista de reportes por categoría */}
            <div className="p-6">
                {categories.map((category) => (
                    <div key={category} className="mb-8 last:mb-0">
                        {/* Título de categoría */}
                        <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text mb-4 flex items-center gap-2">
                            <span>{category}</span>
                            <Badge
                                variant="custom"
                                className={categoryColors[category]}
                            >
                                {reports.filter(r => r.categoria === category).length}
                            </Badge>
                        </h3>

                        {/* Grid de reportes */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {reports
                                .filter(report => report.categoria === category)
                                .map((report) => (
                                    <div
                                        key={report.id}
                                        className="p-4 border border-gray-200 dark:border-dark-border rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-primary-600 dark:text-primary-400">
                                                    {report.icon}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-dark-text">
                                                        {report.nombre}
                                                    </h4>
                                                    <p className="text-sm text-gray-500 dark:text-dark-muted mt-1">
                                                        {report.descripcion}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant="custom"
                                                    className="bg-gray-100 text-gray-700 dark:bg-dark-hover dark:text-dark-text"
                                                >
                                                    {report.tipo}
                                                </Badge>
                                                {report.requiresDateRange && (
                                                    <Badge
                                                        variant="custom"
                                                        className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                                                    >
                                                        Rango de fechas
                                                    </Badge>
                                                )}
                                            </div>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleGenerate(report)}
                                                leftIcon={<Download className="w-4 h-4" />}
                                            >
                                                Generar
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer con nota */}
            <div className="p-6 border-t border-gray-200 dark:border-dark-border bg-blue-50 dark:bg-blue-900/10">
                <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                            Nota sobre reportes con rango de fechas
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                            Los reportes marcados como "Rango de fechas" generarán datos del mes actual por defecto. 
                            Próximamente podrás seleccionar rangos personalizados.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportTable;