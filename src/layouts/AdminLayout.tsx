import { useRef, useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

const links = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: Package, label: 'Productos' },
  { to: '/admin/sales', icon: ShoppingBag, label: 'Ventas' },
]

export default function AdminLayout() {
  const logout = useAuthStore((s) => s.logout)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const touchStartX = useRef<number | null>(null)

  const closeMenu = () => {
    setDragOffset(0)
    setIsMenuOpen(false)
  }

  const openMenu = () => {
    setDragOffset(0)
    setIsMenuOpen(true)
  }

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    touchStartX.current = event.touches[0].clientX
  }

  const handleTouchMove = (event: React.TouchEvent<HTMLElement>) => {
    if (touchStartX.current === null) return

    const nextOffset = event.touches[0].clientX - touchStartX.current
    setDragOffset(Math.min(0, nextOffset))
  }

  const handleTouchEnd = () => {
    if (dragOffset < -70) {
      closeMenu()
    } else {
      setDragOffset(0)
    }

    touchStartX.current = null
  }

  const nav = (
    <nav className="flex-1 space-y-1 p-3">
      {links.map(({ to, icon: Icon, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={closeMenu}
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
              isActive
                ? 'bg-gray-50 font-medium text-cheska-accent'
                : 'text-gray-600 hover:bg-gray-50'
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="hidden w-56 flex-col bg-white shadow-md md:flex">
        <div className="border-b p-4">
          <h2 className="font-bold text-gray-800">Panel Admin</h2>
          <p className="text-xs text-gray-500">Cheska Perfumes</p>
        </div>
        {nav}
        <button
          onClick={logout}
          className="flex items-center gap-2 border-t px-6 py-4 text-sm text-gray-500 hover:text-red-600"
        >
          <LogOut size={16} /> Cerrar sesion
        </button>
      </aside>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <style>
            {`
              @keyframes admin-menu-backdrop-in {
                from { opacity: 0; }
                to { opacity: 1; }
              }

              @keyframes admin-menu-slide-in {
                from { transform: translateX(-100%); }
                to { transform: translateX(0); }
              }

            `}
          </style>
          <button
            type="button"
            onClick={closeMenu}
            className="absolute inset-0 bg-black/30 [animation:admin-menu-backdrop-in_150ms_ease-out]"
            aria-label="Cerrar menu"
          />
          <aside
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={
              dragOffset === 0
                ? undefined
                : { transform: `translateX(${dragOffset}px)` }
            }
            className="absolute left-0 top-0 flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-xl [animation:admin-menu-slide-in_220ms_ease-out]"
          >
            <div className="flex items-center justify-between border-b p-4">
              <div>
                <h2 className="font-bold text-gray-800">Panel Admin</h2>
                <p className="text-xs text-gray-500">Cheska Perfumes</p>
              </div>
              <button
                type="button"
                onClick={closeMenu}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
                aria-label="Cerrar menu"
              >
                <X size={20} />
              </button>
            </div>
            {nav}
            <button
              onClick={() => {
                closeMenu()
                logout()
              }}
              className="flex items-center gap-2 border-t px-6 py-4 text-sm text-gray-500 hover:text-red-600"
            >
              <LogOut size={16} /> Cerrar sesion
            </button>
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b bg-white px-4 shadow-sm md:hidden">
          <button
            type="button"
            onClick={openMenu}
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100"
            aria-label="Abrir menu"
          >
            <Menu size={22} />
          </button>
          <div>
            <p className="text-sm font-bold text-gray-800">Panel Admin</p>
            <p className="text-xs text-gray-500">Cheska Perfumes</p>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
