//src/router/index.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROLES } from '@utils/constants';
import RoleRoute from './RoleRoute';

// ==================== LAYOUTS ====================
import AdminLayout from '@components/layout/admin/AdminLayout';

// ==================== PÁGINAS PÚBLICAS ====================
import Login from '@pages/auth/Login';
import ForgotPassword from '@pages/auth/ForgotPassword';
import Unauthorized from '@pages/common/Unauthorized';
import NotFound from '@pages/common/NotFound';

// ==================== PÁGINAS ADMIN ====================
import AdminDashboard from '@pages/admin/Dashboard';

// Users
import UserList from '@pages/admin/Users/UserList';
import UserCreate from '@pages/admin/Users/UserCreate';
import UserEdit from '@pages/admin/Users/UserEdit';
import UserDetail from '@pages/admin/Users/UserDetail';

// Roles
import RoleList from '@pages/admin/Roles/RoleList';
import RoleCreate from '@pages/admin/Roles/RoleCreate';
import RoleEdit from '@pages/admin/Roles/RoleEdit';

// Products
import ProductList from '@pages/admin/Products/ProductList';
import ProductCreate from '@pages/admin/Products/ProductCreate';
import ProductEdit from '@pages/admin/Products/ProductEdit';
import ProductDetail from '@pages/admin/Products/ProductDetail';

//category
import CategoryList from '@pages/admin/Categories/CategoryList';

// proveedor
import ProveedorList from '@pages/admin/Proveedores/ProveedorList';

//inventario
import InventoryView from '@pages/admin/Inventory/InventoryView';

const AppRoutes = () => {
    return (
        <Routes>
            {/* ==================== RUTAS PÚBLICAS ==================== */}
            <Route path="/login" element={<Login />} />
            <Route path="/recuperar-contrasena" element={<ForgotPassword />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* ==================== RUTAS ADMIN ==================== */}
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

                {/* ========== USUARIOS ========== */}
                <Route path="usuarios" element={<UserList />} />
                <Route path="usuarios/crear" element={<UserCreate />} />
                <Route path="usuarios/:id/editar" element={<UserEdit />} />
                <Route path="usuarios/:id" element={<UserDetail />} />

                {/* ========== ROLES ========== */}
                <Route path="roles" element={<RoleList />} />
                <Route path="roles/crear" element={<RoleCreate />} />
                <Route path="roles/:id/editar" element={<RoleEdit />} />


                {/* ========== PRODUCTOS ========== */}
                <Route path="productos" element={<ProductList />} />
                <Route path="productos/crear" element={<ProductCreate />} />
                <Route path="productos/:id/editar" element={<ProductEdit />} />
                <Route path="productos/:id" element={<ProductDetail />} />

                {/* Categorias*/}
                <Route path="categorias" element={<CategoryList />} />
                {/* Proveedores */}
                <Route path="proveedores" element={<ProveedorList />} />

                {/* Inventario */}
                <Route path="inventario" element={<InventoryView />} />

            </Route>

            {/* ==================== REDIRECCIONAMIENTO RAÍZ ==================== */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* ==================== 404 ==================== */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;