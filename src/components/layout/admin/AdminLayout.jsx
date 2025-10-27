//src/components/layout/admin/AdminLayout.jsx
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import AdminFooter from './AdminFooter';
import Breadcrumb from '@components/layout/common/Breadcrumb';

const AdminLayout = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detectar si es móvil
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            // En móvil, el sidebar siempre está colapsado por defecto
            if (window.innerWidth < 768) {
                setIsSidebarCollapsed(true);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleToggleSidebar = () => {
        setIsSidebarCollapsed(prev => !prev);
    };

    // Cerrar sidebar en móvil al hacer clic fuera
    const handleCloseSidebar = () => {
        if (isMobile) {
            setIsSidebarCollapsed(true);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
            {/* Header fijo */}
            <AdminHeader 
                onToggleSidebar={handleToggleSidebar}
                isSidebarCollapsed={isSidebarCollapsed}
            />

            {/* Sidebar con overlay en móvil */}
            <div className="relative">
                <AdminSidebar 
                    isCollapsed={isSidebarCollapsed} 
                    onToggle={handleToggleSidebar}
                />
                
                {/* Overlay para móvil */}
                {isMobile && !isSidebarCollapsed && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-10"
                        onClick={handleCloseSidebar}
                    />
                )}
            </div>

            {/* Contenido principal */}
            <main
                className={`
                    pt-16 transition-all duration-300 min-h-screen
                    ${isSidebarCollapsed ? 'pl-16' : 'pl-64'}
                    ${isMobile ? 'pl-0' : ''}
                `}
            >
                <div className="p-4 md:p-6">
                    {/* Breadcrumb */}
                    <Breadcrumb className="mb-4 md:mb-6" />

                    {/* Contenido dinámico */}
                    <div onClick={handleCloseSidebar}>
                        <Outlet />
                    </div>
                </div>

                {/* Footer */}
                <AdminFooter />
            </main>
        </div>
    );
};

export default AdminLayout;