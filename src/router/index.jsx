// src/router/index.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROLES } from '@utils/constants';
import RoleRoute from './RoleRoute';

// Layouts
import AdminLayout from '@components/layout/admin/AdminLayout';
import SellerLayout from '@components/layout/seller/SellerLayout';
import EmployeeLayout from '@components/layout/employee/EmployeeLayout';

// Auth
import Login from '@pages/auth/Login';
import ForgotPassword from '@pages/auth/ForgotPassword';

// Common
import Unauthorized from '@pages/common/Unauthorized';
import NotFound from '@pages/common/NotFound';
import UserProfile from '@pages/common/UserProfile';

// Admin - Dashboard
import AdminDashboard from '@pages/admin/Dashboard';

// Admin - Users
import UserList from '@pages/admin/Users/UserList';
import UserCreate from '@pages/admin/Users/UserCreate';
import UserEdit from '@pages/admin/Users/UserEdit';
import UserDetail from '@pages/admin/Users/UserDetail';

// Admin - Roles
import RoleList from '@pages/admin/Roles/RoleList';
import RoleCreate from '@pages/admin/Roles/RoleCreate';
import RoleEdit from '@pages/admin/Roles/RoleEdit';

// Admin - Products
import ProductList from '@pages/admin/Products/ProductList';
import ProductCreate from '@pages/admin/Products/ProductCreate';
import ProductEdit from '@pages/admin/Products/ProductEdit';
import ProductDetail from '@pages/admin/Products/ProductDetail';

// Admin - Categories
import CategoryList from '@pages/admin/Categories/CategoryList';

// Admin - Proveedores
import ProveedorList from '@pages/admin/Proveedores/ProveedorList';

// Admin - Inventory
import InventoryView from '@pages/admin/Inventory/InventoryView';
import MovementHistory from '@pages/admin/Inventory/MovementHistory';
import StockAlerts from '@pages/admin/Inventory/StockAlerts';

// Admin - Returns
import ReturnList from '@pages/admin/Returns/ReturnList';
import ReturnProcess from '@pages/admin/Returns/ReturnProcess';

// Admin - Reports
import ReportsDashboard from '@pages/admin/Reports/ReportDashboard';

// Seller
import SellerDashboard from '@pages/seller/Dashboard';
import NewSale from '@pages/seller/NewSale';
import MySales from '@pages/seller/MySales';
import ClientList from '@pages/seller/Clients/ClientList';
import ProductSearch from '@pages/seller/Products/ProductSearch';
import SellerReturnProcess from '@pages/seller/Returns/ReturnProcess';
import DailyReport from '@pages/seller/Reports/DailyReport';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/recuperar-contrasena" element={<ForgotPassword />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/perfil" element={<UserProfile />} />

            <Route
                path="/admin/*"
                element={
                    <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                        <AdminLayout />
                    </RoleRoute>
                }
            >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />

                <Route path="usuarios" element={<UserList />} />
                <Route path="usuarios/crear" element={<UserCreate />} />
                <Route path="usuarios/:id/editar" element={<UserEdit />} />
                <Route path="usuarios/:id" element={<UserDetail />} />

                <Route path="roles" element={<RoleList />} />
                <Route path="roles/crear" element={<RoleCreate />} />
                <Route path="roles/:id/editar" element={<RoleEdit />} />

                <Route path="productos" element={<ProductList />} />
                <Route path="productos/crear" element={<ProductCreate />} />
                <Route path="productos/:id/editar" element={<ProductEdit />} />
                <Route path="productos/:id" element={<ProductDetail />} />

                <Route path="categorias" element={<CategoryList />} />

                <Route path="proveedores" element={<ProveedorList />} />

                <Route path="inventario" element={<InventoryView />} />
                <Route path="inventario/historial" element={<MovementHistory />} />
                <Route path="inventario/alertas" element={<StockAlerts />} />

                <Route path="devoluciones" element={<ReturnList />} />
                <Route path="devoluciones/:id/procesar" element={<ReturnProcess />} />

                <Route path="reportes" element={<ReportsDashboard />} />
            </Route>

            <Route
                path="/vendedor/*"
                element={
                    <RoleRoute allowedRoles={[ROLES.SELLER]}>
                        <SellerLayout />
                    </RoleRoute>
                }
            >
                <Route index element={<Navigate to="/vendedor/dashboard" replace />} />
                <Route path="dashboard" element={<SellerDashboard />} />
                <Route path="nueva-venta" element={<NewSale />} />
                <Route path="mis-ventas" element={<MySales />} />
                <Route path="clientes" element={<ClientList />} />
                <Route path="productos" element={<ProductSearch />} />
                <Route path="devoluciones" element={<SellerReturnProcess />} />
                <Route path="reporte-diario" element={<DailyReport />} />
            </Route>

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;