// 73. src/components/layout/employee/EmployeeFooter.jsx
const EmployeeFooter = () => {
    const currentYear = new Date().getFullYear();
    const version = import.meta.env.VITE_APP_VERSION || '1.0.0';

    return (
        <footer className="bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-border py-4 px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-600 dark:text-dark-muted">
                <p>
                    © {currentYear} SGVIA - Módulo de Empleado
                </p>
                <p>
                    Versión {version} • Gestión de inventario
                </p>
            </div>
        </footer>
    );
};

export default EmployeeFooter;