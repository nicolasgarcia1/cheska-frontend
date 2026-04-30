import { useEffect, useState } from 'react'
import { salesApi } from '../../../api/salesApi'
import type { Sale } from '../../../types'
import SaleForm from '../components/SaleForm'
import { Plus, Download } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SalesAdmin() {
  const [sales, setSales] = useState<Sale[]>([])
  const [showForm, setShowForm] = useState(false)

  const load = () => salesApi.getAll().then(setSales)
  useEffect(() => { load() }, [])

  const handleExport = async (type: 'csv' | 'excel') => {
    const res = type === 'csv' ? await salesApi.exportCsv('sales') : await salesApi.exportExcel()
    const url = URL.createObjectURL(new Blob([res.data as BlobPart]))
    const a = document.createElement('a')
    a.href = url
    a.download = type === 'csv' ? 'ventas.csv' : 'ventas.xlsx'
    a.click()
    toast.success('Exportado correctamente')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Ventas</h1>
        <div className="flex gap-2">
          <button onClick={() => handleExport('csv')}
            className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">
            <Download size={14} /> CSV
          </button>
          <button onClick={() => handleExport('excel')}
            className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">
            <Download size={14} /> Excel
          </button>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-xl hover:bg-rose-700 text-sm">
            <Plus size={16} /> Registrar venta
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {sales.map((sale) => (
          <div key={sale.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-800">
                  {sale.customerName || 'Cliente anÃ³nimo'} â€” {sale.channel}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(sale.saleDate).toLocaleDateString('es-AR')}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {sale.items.map((item, i) => (
                    <span key={i} className="text-xs bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full">
                      {item.productName} x{item.quantity}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800">${sale.totalAmount.toFixed(2)}</p>
                <p className="text-xs text-green-600">+${sale.totalProfit.toFixed(2)} ganancia</p>
              </div>
            </div>
          </div>
        ))}
        {sales.length === 0 && (
          <p className="text-center text-gray-400 py-12">No hay ventas registradas</p>
        )}
      </div>

      {showForm && (
        <SaleForm
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); load(); toast.success('Venta registrada') }}
        />
      )}
    </div>
  )
}
