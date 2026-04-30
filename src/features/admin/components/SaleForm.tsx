import { useEffect, useState } from 'react'
import { productsApi } from '../../../api/productsApi'
import { salesApi } from '../../../api/salesApi'
import type { Product } from '../../../types'
import { X, Plus, Trash2 } from 'lucide-react'

const CHANNELS = ['WhatsApp', 'Instagram', 'Presencial']

interface SaleItemLocal {
  productId: number
  quantity: number
}

interface Props {
  onClose: () => void
  onSaved: () => void
}

export default function SaleForm({ onClose, onSaved }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [items, setItems] = useState<SaleItemLocal[]>([{ productId: 0, quantity: 1 }])
  const [customer, setCustomer] = useState('')
  const [channel, setChannel] = useState(0)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { productsApi.getAllAdmin().then(setProducts) }, [])

  const addItem = () => setItems((i) => [...i, { productId: 0, quantity: 1 }])
  const removeItem = (idx: number) => setItems((i) => i.filter((_, j) => j !== idx))
  const updateItem = (idx: number, key: keyof SaleItemLocal, val: number) =>
    setItems((i) => i.map((item, j) => (j === idx ? { ...item, [key]: val } : item)))

  const total = items.reduce((sum, item) => {
    const p = products.find((p) => p.id === item.productId)
    return sum + (p?.price ?? 0) * item.quantity
  }, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await salesApi.create({ customerName: customer, channel, notes, items })
      onSaved()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-800">Registrar Venta</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input placeholder="Nombre del cliente" value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
          <select value={channel} onChange={(e) => setChannel(+e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-300">
            {CHANNELS.map((c, i) => <option key={c} value={i}>{c}</option>)}
          </select>
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <select value={item.productId}
                  onChange={(e) => updateItem(idx, 'productId', +e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-300">
                  <option value={0}>Seleccionar producto</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} â€” ${p.price}</option>
                  ))}
                </select>
                <input type="number" min={1} value={item.quantity}
                  onChange={(e) => updateItem(idx, 'quantity', +e.target.value)}
                  className="w-16 px-2 py-2 border border-gray-200 rounded-lg text-sm text-center" />
                <button type="button" onClick={() => removeItem(idx)}
                  className="text-red-400 hover:text-red-600">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button type="button" onClick={addItem}
              className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700">
              <Plus size={12} /> Agregar producto
            </button>
          </div>
          <textarea placeholder="Notas (opcional)" value={notes}
            onChange={(e) => setNotes(e.target.value)} rows={2}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none" />
          <div className="bg-rose-50 rounded-xl px-4 py-3">
            <p className="font-bold text-rose-700 text-lg">Total: ${total.toFixed(2)}</p>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600">
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-xl text-sm hover:bg-rose-700 disabled:opacity-60">
              {loading ? 'Guardando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
