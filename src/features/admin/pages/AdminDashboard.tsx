import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  DollarSign,
  Package,
  Plus,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { salesApi } from '../../../api/salesApi'
import type { DashboardStats } from '../../../types'

const money = (value: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    salesApi
      .getDashboard()
      .then((data) => {
        setStats(data)
        setError(false)
      })
      .catch(() => setError(true))
  }, [])

  if (error) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
        No pudimos cargar el panel. Probá recargar la página.
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="animate-pulse text-sm text-cheska-text">
        Cargando panel...
      </div>
    )
  }

  const cards = [
    {
      label: 'Ventas este mes',
      value: stats.totalSalesThisMonth,
      icon: ShoppingBag,
      className: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Ingresos este mes',
      value: money(stats.totalRevenueThisMonth),
      icon: DollarSign,
      className: 'bg-green-50 text-green-600',
    },
    {
      label: 'Ganancia este mes',
      value: money(stats.totalProfitThisMonth),
      icon: TrendingUp,
      className: 'bg-rose-50 text-rose-600',
    },
    {
      label: 'Stock bajo',
      value: stats.lowStockAlerts.length,
      icon: AlertTriangle,
      className: 'bg-yellow-50 text-yellow-700',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-cheska-accent">Panel admin</p>
          <h1 className="text-2xl font-bold text-cheska-text">Hola, Angie</h1>
          <p className="text-sm text-gray-500">
            Resumen rapido para manejar productos, stock y ventas.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-cheska-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cheska-primary focus-visible:ring-offset-2"
          >
            <Package size={16} />
            Productos
          </Link>
          <Link
            to="/admin/sales"
            className="inline-flex items-center gap-2 rounded-xl bg-cheska-soft px-4 py-2 text-sm font-medium text-white hover:bg-cheska-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cheska-primary focus-visible:ring-offset-2"
          >
            <Plus size={16} />
            Registrar venta
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, className }) => (
          <div
            key={label}
            className="rounded-xl border border-gray-50 bg-white p-4 shadow-sm"
          >
            <div className={`mb-3 inline-flex rounded-lg p-2 ${className}`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="mt-0.5 text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section className="rounded-xl border border-gray-50 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-4 font-semibold text-gray-700">Ventas por mes</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats.salesByMonth}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => money(Number(value))} />
              <Bar
                dataKey="revenue"
                name="Ingresos"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="profit"
                name="Ganancia"
                fill="#f43f5e"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="rounded-xl border border-gray-50 bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold text-gray-700">Mas vendidos</h2>
          <div className="space-y-2">
            {stats.topProducts.map((product) => (
              <div
                key={product.name}
                className="flex items-center justify-between border-b border-gray-50 py-2 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {product.quantitySold} vendidos
                  </p>
                </div>
                <span className="text-sm font-bold text-green-600">
                  {money(product.revenue)}
                </span>
              </div>
            ))}
            {stats.topProducts.length === 0 && (
              <p className="py-6 text-center text-sm text-gray-400">
                Todavia no hay ventas registradas
              </p>
            )}
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
        <h2 className="mb-3 flex items-center gap-2 font-semibold text-yellow-800">
          <AlertTriangle size={18} />
          Productos para reponer
        </h2>

        {stats.lowStockAlerts.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {stats.lowStockAlerts.map((alert) => (
              <Link
                key={alert.id}
                to="/admin/products"
                className="rounded-lg bg-white px-3 py-2 text-sm hover:bg-yellow-100"
              >
                <p className="font-medium text-gray-700">{alert.name}</p>
                <p className="font-bold text-yellow-700">
                  {alert.stock} unidades
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-yellow-800">
            No hay productos con stock bajo.
          </p>
        )}
      </section>
    </div>
  )
}
