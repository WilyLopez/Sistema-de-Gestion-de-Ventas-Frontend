import SalesTable from '@components/tables/SalesTable';

const SaleList = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                        Historial de Ventas
                    </h1>
                    <p className="text-gray-600 dark:text-dark-muted mt-1">
                        Explora y gestiona todas las ventas registradas en el sistema.
                    </p>
                </div>
            </div>

            <SalesTable />
        </div>
    );
};

export default SaleList;
