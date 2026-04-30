import { useEffect, useState } from 'react'
import { salesApi } from '../../../api/salesApi'
import type { DashboardStats } from '../../../types'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, ShoppingBag, DollarSign, AlertTriangle } from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => { salesApi.getDashboard().then(setStats) }, [])

  if (!stats)
    return <div className="animate-pulse text-gray-400">Cargando dashboard...</div>

  const cards = [
    { label: 'Ventas este mes', value: stats.totalSalesThisMonth, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Ingresos este mes', value: `$${stats.totalRevenueThisMonth.toFixed(0)}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Ganancia este mes', value: `$${stats.totalProfitThisMonth.toFixed(0)}`, icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Alertas de stock', value: stats.lowStockAlerts.length, icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-50">
            <div className={`inline-flex p-2 rounded-lg mb-3 ${bg}`}>
              <Icon size={20} className={color} />
            </div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-50">
          <h3 className="font-semibold text-gray-700 mb-4">Ventas por mes</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.salesByMonth}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="revenue" name="Ingresos" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" name="Ganancia" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-50">
          <h3 className="font-semibold text-gray-700 mb-3">Top Productos</h3>
          <div className="space-y-2">
            {stats.topProducts.map((p, i) => (
              <div key={i} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-700">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.quantitySold} vendidos</p>
                </div>
                <span className="text-sm font-bold text-green-600">${p.revenue.toFixed(0)}</span>
              </div>
            ))}
            {stats.topProducts.length === 0 && (
              <p className="text-sm text-gray-400">Sin ventas aÃºn</p>
            )}
          </div>
        </div>
      </div>

      {stats.lowStockAlerts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <h3 className="font-semibold text-yellow-800 flex items-center gap-2 mb-3">
            <AlertTriangle size={18} /> Alertas de Stock Bajo
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {stats.lowStockAlerts.map((a) => (
              <div key={a.id} className="bg-white rounded-lg px-3 py-2 text-sm">
                <p className="font-medium text-gray-700">{a.name}</p>
                <p className="text-yellow-600 font-bold">{a.stock} unidades</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
