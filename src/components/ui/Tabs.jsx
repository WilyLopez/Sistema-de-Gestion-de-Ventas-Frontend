import { useState } from "react";

/**
 * Componente Tabs reutilizable
 * Sistema de pestañas para organizar contenido
 */
const Tabs = ({ tabs = [], defaultTab = 0, onChange, className = "" }) => {
    const [activeTab, setActiveTab] = useState(defaultTab);

    const handleTabChange = (index) => {
        setActiveTab(index);
        if (onChange) {
            onChange(index);
        }
    };

    return (
        <div className={className}>
            <div className="border-b border-gray-200 dark:border-dark-border">
                <nav className="flex -mb-px space-x-8">
                    {tabs.map((tab, index) => {
                        const isActive = activeTab === index;
                        return (
                            <button
                                key={index}
                                onClick={() => handleTabChange(index)}
                                className={`
                  py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${isActive
                                        ? "border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-500"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-dark-muted dark:hover:text-dark-text dark:hover:border-dark-border"
                                    }
                `}
                                disabled={tab.disabled}
                            >
                                <div className="flex items-center gap-2">
                                    {tab.icon && <span>{tab.icon}</span>}
                                    <span>{tab.label}</span>
                                    {tab.badge && (
                                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-dark-hover">
                                            {tab.badge}
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-6">
                {tabs[activeTab] && tabs[activeTab].content}
            </div>
        </div>
    );
};

export default Tabs;
