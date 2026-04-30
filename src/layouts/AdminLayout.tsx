import { Outlet, NavLink } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { LayoutDashboard, Package, ShoppingBag, LogOut } from 'lucide-react'

const links = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: Package, label: 'Productos' },
  { to: '/admin/sales', icon: ShoppingBag, label: 'Ventas' },
]

export default function AdminLayout() {
  const logout = useAuthStore((s) => s.logout)

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-56 bg-white shadow-md flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-bold text-gray-800">Panel Admin</h2>
          <p className="text-xs text-gray-500">Cheska Perfumes</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {links.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-rose-50 text-rose-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-6 py-4 text-sm text-gray-500 hover:text-red-600 border-t"
        >
          <LogOut size={16} /> Cerrar sesiÃ³n
        </button>
      </aside>
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
