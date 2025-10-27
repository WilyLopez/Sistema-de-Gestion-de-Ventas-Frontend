// 70. src/components/layout/seller/SellerLayout.jsx (corregido)
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SellerHeader from './SellerHeader';
import SellerSidebar from './SellerSidebar';
import SellerFooter from './SellerFooter';
import Breadcrumb from '@components/layout/common/Breadcrumb';

const SellerLayout = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const handleToggleSidebar = () => {
        setIsSidebarCollapsed(prev => !prev);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
            {/* Header fijo */}
            <SellerHeader onToggleSidebar={handleToggleSidebar} />

            {/* Sidebar */}
            <SellerSidebar isCollapsed={isSidebarCollapsed} />

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
                <SellerFooter />
            </main>
        </div>
    );
};

export default SellerLayout;