// 74. src/components/layout/employee/EmployeeLayout.jsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import EmployeeHeader from './EmployeeHeader';
import EmployeeSidebar from './EmployeeSidebar';
import EmployeeFooter from './EmployeeFooter';
import Breadcrumb from '@components/layout/common/Breadcrumb';

const EmployeeLayout = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const handleToggleSidebar = () => {
        setIsSidebarCollapsed(prev => !prev);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
            {/* Header fijo */}
            <EmployeeHeader onToggleSidebar={handleToggleSidebar} />

            {/* Sidebar */}
            <EmployeeSidebar isCollapsed={isSidebarCollapsed} />

            {/* Contenido principal */}
            <main
                className={`
                    pt-16 transition-all duration-300
                    ${isSidebarCollapsed ? 'pl-16' : 'pl-64'}
                `}
            >
                <div className="p-6">
                    {/* Breadcrumb */}
                    <Breadcrumb className="mb-4" />

                    {/* Contenido dinámico */}
                    <Outlet />
                </div>

                {/* Footer */}
                <EmployeeFooter />
            </main>
        </div>
    );
};

export default EmployeeLayout;