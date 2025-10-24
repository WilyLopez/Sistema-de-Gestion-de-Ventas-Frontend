import { useState, useMemo } from "react";
import { PAGINATION } from "@utils/constants";

// Hook para manejar lógica de tablas (paginación, ordenamiento, filtros)
export const useTable = (
    initialData = [],
    initialPageSize = PAGINATION.DEFAULT_PAGE_SIZE
) => {
    const [data, setData] = useState(initialData);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc"); // 'asc' o 'desc'
    const [filters, setFilters] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    // Filtrar datos según término de búsqueda
    const filteredData = useMemo(() => {
        if (!searchTerm) return data;

        return data.filter((item) =>
            Object.values(item).some((value) =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [data, searchTerm]);

    // Filtrar datos según filtros específicos
    const filteredByFilters = useMemo(() => {
        let result = filteredData;

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== "") {
                result = result.filter((item) => item[key] === value);
            }
        });

        return result;
    }, [filteredData, filters]);

    // Ordenar datos
    const sortedData = useMemo(() => {
        if (!sortBy) return filteredByFilters;

        const sorted = [...filteredByFilters].sort((a, b) => {
            const aValue = a[sortBy];
            const bValue = b[sortBy];

            if (aValue === bValue) return 0;

            if (sortOrder === "asc") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return sorted;
    }, [filteredByFilters, sortBy, sortOrder]);

    // Paginar datos
    const paginatedData = useMemo(() => {
        const start = page * pageSize;
        const end = start + pageSize;
        return sortedData.slice(start, end);
    }, [sortedData, page, pageSize]);

    // Total de páginas
    const totalPages = Math.ceil(sortedData.length / pageSize);

    // Cambiar página
    const goToPage = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    // Página siguiente
    const nextPage = () => {
        if (page < totalPages - 1) {
            setPage(page + 1);
        }
    };

    // Página anterior
    const previousPage = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    // Cambiar ordenamiento
    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortOrder("asc");
        }
    };

    // Cambiar filtro
    const handleFilter = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
        setPage(0); // Resetear a primera página
    };

    // Limpiar filtros
    const clearFilters = () => {
        setFilters({});
        setSearchTerm("");
        setPage(0);
    };

    // Actualizar datos
    const updateData = (newData) => {
        setData(newData);
        setPage(0);
    };

    // Agregar fila
    const addRow = (row) => {
        setData((prev) => [row, ...prev]);
    };

    // Actualizar fila
    const updateRow = (index, updatedRow) => {
        setData((prev) => {
            const newData = [...prev];
            newData[index] = updatedRow;
            return newData;
        });
    };

    // Eliminar fila
    const deleteRow = (index) => {
        setData((prev) => prev.filter((_, i) => i !== index));
    };

    return {
        // Datos
        data: paginatedData,
        allData: sortedData,
        totalItems: sortedData.length,

        // Paginación
        page,
        pageSize,
        totalPages,
        goToPage,
        nextPage,
        previousPage,
        setPageSize,

        // Ordenamiento
        sortBy,
        sortOrder,
        handleSort,

        // Filtros
        filters,
        searchTerm,
        setSearchTerm,
        handleFilter,
        clearFilters,

        // Manipulación de datos
        updateData,
        addRow,
        updateRow,
        deleteRow,
    };
};
