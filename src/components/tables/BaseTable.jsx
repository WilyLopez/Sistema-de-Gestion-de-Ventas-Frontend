// src/components/tables/BaseTable
import { useState, useEffect,useCallback } from 'react';
import {
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Download,
    Search,
    X,
} from 'lucide-react';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Select from '@components/ui/Select';
import Checkbox from '@components/ui/Checkbox';
import Spinner from '@components/ui/Spinner';
import { PAGINATION } from '@utils/constants';

const BaseTable = ({
    columns = [],
    fetchData,
    actions = [],
    onExport,
    selectable = false,
    onSelectionChange,
    searchable = true,
    searchPlaceholder = 'Buscar...',
    emptyMessage = 'No hay datos para mostrar',
}) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_PAGE_SIZE);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const sort = sortField ? `${sortField},${sortDirection}` : null;
            const response = await fetchData(currentPage, pageSize, sort);
            setData(response.content || []);
            setTotalElements(response.totalElements || 0);
            setTotalPages(response.totalPages || 0);
        } catch (err) {
            console.error('Error al cargar datos:', err);
            setError('Error al cargar los datos. Intenta nuevamente.');
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, pageSize, sortField, sortDirection, fetchData]);


    useEffect(() => {
        loadData();
    }, [loadData, searchQuery]);


    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        setSelectedRows([]);
        setSelectAll(false);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(0);
        setSelectedRows([]);
        setSelectAll(false);
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(0);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setCurrentPage(0);
    };

    const handleRowSelect = (id) => {
        setSelectedRows(prev => {
            const newSelection = prev.includes(id)
                ? prev.filter(rowId => rowId !== id)
                : [...prev, id];
            if (onSelectionChange) {
                onSelectionChange(newSelection);
            }
            return newSelection;
        });
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedRows([]);
            if (onSelectionChange) onSelectionChange([]);
        } else {
            const allIds = data.map(row => row.id);
            setSelectedRows(allIds);
            if (onSelectionChange) onSelectionChange(allIds);
        }
        setSelectAll(!selectAll);
    };

    const renderSortIcon = (field) => {
        if (sortField !== field) {
            return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
        }
        return sortDirection === 'asc' ? (
            <ChevronUp className="w-4 h-4 text-primary-600" />
        ) : (
            <ChevronDown className="w-4 h-4 text-primary-600" />
        );
    };

    const startElement = currentPage * pageSize + 1;
    const endElement = Math.min((currentPage + 1) * pageSize, totalElements);

    return (
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-md">
            <div className="p-4 border-b border-gray-200 dark:border-dark-border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {searchable && (
                        <div className="flex-1 max-w-md relative">
                            <Input
                                type="text"
                                placeholder={searchPlaceholder}
                                value={searchQuery}
                                onChange={handleSearch}
                                leftIcon={<Search className="w-5 h-5" />}
                                className="pr-8"
                            />
                            {searchQuery && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-dark-text"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        {onExport && (
                            <Button
                                variant="secondary"
                                size="md"
                                onClick={onExport}
                                leftIcon={<Download className="w-4 h-4" />}
                            >
                                Exportar
                            </Button>
                        )}
                        {selectable && selectedRows.length > 0 && (
                            <span className="text-sm text-gray-600 dark:text-dark-muted">
                                {selectedRows.length} seleccionado(s)
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-dark-hover">
                        <tr>
                            {selectable && (
                                <th className="px-4 py-3 text-left w-12">
                                    <Checkbox
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                            )}

                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-muted uppercase tracking-wider"
                                >
                                    {column.sortable ? (
                                        <button
                                            onClick={() => handleSort(column.key)}
                                            className="flex items-center gap-2 hover:text-gray-700 dark:hover:text-dark-text transition-colors"
                                        >
                                            {column.label}
                                            {renderSortIcon(column.key)}
                                        </button>
                                    ) : (
                                        column.label
                                    )}
                                </th>
                            ))}

                            {actions?.length > 0 && (
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-dark-muted uppercase tracking-wider">
                                    Acciones
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-dark-border">
                        {isLoading ? (
                            <tr>
                                <td
                                    colSpan={
                                        columns.length +
                                        (selectable ? 1 : 0) +
                                        (actions?.length > 0 ? 1 : 0)
                                    }
                                    className="px-4 py-12 text-center"
                                >
                                    <Spinner centered text="Cargando datos..." />
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td
                                    colSpan={
                                        columns.length +
                                        (selectable ? 1 : 0) +
                                        (actions?.length > 0 ? 1 : 0)
                                    }
                                    className="px-4 py-12 text-center"
                                >
                                    <p className="text-red-600 dark:text-red-400">{error}</p>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={loadData}
                                        className="mt-4"
                                    >
                                        Reintentar
                                    </Button>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={
                                        columns.length +
                                        (selectable ? 1 : 0) +
                                        (actions?.length > 0 ? 1 : 0)
                                    }
                                    className="px-4 py-12 text-center text-gray-500 dark:text-dark-muted"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((row) => (
                                <tr
                                    key={row.id ?? JSON.stringify(row)} // evita warning si id no existe
                                    className="hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors"
                                >
                                    {selectable && (
                                        <td className="px-4 py-3">
                                            <Checkbox
                                                checked={selectedRows.includes(row.id)}
                                                onChange={() => handleRowSelect(row.id)}
                                            />
                                        </td>
                                    )}

                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className="px-4 py-3 text-sm text-gray-900 dark:text-dark-text"
                                        >
                                            {column.render
                                                ? column.render(row[column.key], row)
                                                : row[column.key]}
                                        </td>
                                    ))}

                                    {actions?.length > 0 && (
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {actions.map((action, index) => {
                                                    const Icon =
                                                        typeof action.icon === "function"
                                                            ? action.icon(row)
                                                            : action.icon;
                                                    const label =
                                                        typeof action.label === "function"
                                                            ? action.label(row)
                                                            : action.label;
                                                    return (
                                                        <button
                                                            key={`${row.id}-${index}`}
                                                            onClick={() => action.onClick(row)}
                                                            className={`p-2 rounded-lg transition-colors ${action.variant === "danger"
                                                                ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                                                                : "text-gray-600 hover:bg-gray-100 dark:hover:bg-dark-hover dark:text-dark-text"
                                                                }`}
                                                            title={label}
                                                        >
                                                            {Icon}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {!isLoading && data.length > 0 && (
                <div className="px-4 py-3 border-t border-gray-200 dark:border-dark-border">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-700 dark:text-dark-text">
                                Mostrando <span className="font-medium">{startElement}</span> a{' '}
                                <span className="font-medium">{endElement}</span> de{' '}
                                <span className="font-medium">{totalElements}</span> resultados
                            </span>
                            <Select
                                value={pageSize}
                                onChange={handlePageSizeChange}
                                options={PAGINATION.PAGE_SIZE_OPTIONS.map(size => ({
                                    value: size,
                                    label: `${size} por página`,
                                }))}
                                className="w-40"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handlePageChange(0)}
                                disabled={currentPage === 0}
                            >
                                <ChevronsLeft className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 0}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <span className="text-sm text-gray-700 dark:text-dark-text px-2">
                                Página {currentPage + 1} de {totalPages}
                            </span>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages - 1}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handlePageChange(totalPages - 1)}
                                disabled={currentPage >= totalPages - 1}
                            >
                                <ChevronsRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BaseTable;