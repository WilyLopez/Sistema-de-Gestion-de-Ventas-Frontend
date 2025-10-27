//src/components/layout/admin/AdminHeader.jsx
import { useState } from 'react';
import { Menu } from 'lucide-react';
import Logo from '@components/layout/common/Logo';
import SearchBar from '@components/layout/common/SearchBar';
import NotificationIcon from '@components/layout/common/NotificationIcon';
import NotificationPanel from '@components/layout/common/NotificationPanel';
import ThemeToggle from '@components/layout/common/ThemeToggle';
import UserMenu from '@components/layout/common/UserMenu';

const AdminHeader = ({ onToggleSidebar }) => {
    const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-30 h-16 bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border">
                <div className="flex items-center justify-between h-full px-4">
                    {/* Izquierda: Toggle Sidebar + Logo */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onToggleSidebar}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors"
                            aria-label="Toggle sidebar"
                        >
                            <Menu className="w-5 h-5 text-gray-700 dark:text-dark-text" />
                        </button>
                        <Logo />
                    </div>

                    {/* Centro: SearchBar */}
                    <div className="flex-1 max-w-2xl mx-4">
                        <SearchBar />
                    </div>

                    {/* Derecha: Acciones */}
                    <div className="flex items-center gap-2">
                        <NotificationIcon onClick={() => setIsNotificationPanelOpen(true)} />
                        <ThemeToggle />
                        <UserMenu />
                    </div>
                </div>
            </header>

            <NotificationPanel
                isOpen={isNotificationPanelOpen}
                onClose={() => setIsNotificationPanelOpen(false)}
            />
        </>
    );
};

export default AdminHeader;